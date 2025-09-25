---
title: "MySQL 间隙锁引发的血案"
date: 2022-06-26
tags: ["database"]
category: "技术分享"
---
# MySQL 间隙锁引发的血案

## 现象

表结构

![Table Def](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2021/06/04/20210604-39247f77e14cf4962c8edf175116d161.png)

索引情况

![image-20210604151418771](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2021/06/04/20210604-374574ab42b10fa7c1f0490b76a79214.png)

执行更新的 SQL

```sql
UPDATE material_checkup_operation_items 
SET id = id,
	enterprise_id = 1866,
	biz_code = '86',
	entity_id = 'd0fd94e7-df33-4e04-b020-24bedcf10a57' 
WHERE (material_ins_id in ('437434', '721548', ..., '721568'));
```

该 SQL 由于没有命中索引，执行了 374s 之久，以下是慢查询执行计划

```bash
User@Host: machine_service[machine_service] @  [192.168.200.78]
Thread_id: 3173883715  Schema: machine_service  QC_hit: No
Query_time: 374.400854  Lock_time: 0.000298  Rows_sent: 0  Rows_examined: 54976647

explain: id	select_type	table	type	possible_keys	key	key_len	ref	rows	Extra
explain: 1	SIMPLE	material_checkup_operation_items	index	NULL	PRIMARY	4	NULL	51917388	Using where; Using buffer
```

可以看到这个 SQL 执行了 374s，没有命中任何索引，最终执行了全表扫描。

问题是该 SQL 执行期间，对该表的所有插入操作都被阻塞了，于是收到了大量的报警

![image-20210604152509607](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2021/06/04/20210604-83c0de4cc288f185778f6a4b7c885f9e.png)

我们从报警中看到，对该表的插入失败了，原因是 `Lock wait timeout exceeded`，也就是说获取锁失败了。

## 原因分析

### MySQL 事务隔离级别

| 隔离级别         | 脏读 | 不可重复读 | 幻读 |
| ---------------- | ---- | ---------- | ---- |
| read-uncommitted | ✔    | ✔          | ✔    |
| read-committed   | ❌    | ✔          | ✔    |
| repeatable-read  | ❌    | ❌          | ✔    |
| serializable     | ❌    | ❌          | ❌    |

- **脏读**：事务 A 读取了事务 B 的更新，但是事务 B 回滚了，导致事务 A 读取到的数据是脏数据
- **不可重复读**：事务 A 多次读取同一数据的结果是不一致的，因为事务 B 再事务 A 多次读取之间提交了对数据的修改
- **幻读**：事务 A 对数据库中所有匹配的条件的数据进行了修改，但是由于修改过程中，事务 B 插入了一条新数据，导致 A 提交后发现还有一条数据没有改到，好像出现了幻觉一样

> **不可重复读** 侧重于数据的修改，通过对相关行加锁就可以解决该问题。**幻读** 则与新增和删除有关，解决该问题一般需要锁表，MySQL 通过 **间隙锁** 缓解了在默认的 **repeatable-read** 隔离级别下出现幻读的问题。

我们知道，MySQL 默认的隔离级别是 **repeatable-read**，该隔离级别下是存在 **幻读** 问题的。

### 解决方案

怎么解决这个问题呢？我们可以想想，在这里为了避免出现幻读问题，我们需要将要插入值的这个区域加锁，让这个区域不能再插入新的数据，这样就可以避免事务提交后，

为了解决这个问题，MySQL 引入了 **间隙锁** 的概念（间隙锁只在 **repeatable-read** 隔离级别下有效）。

**间隙锁** 就是指的在两个值之间的区域添加的锁，一般是一个开区间，如下图所示

![image-20210605021801382](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2021/06/05/20210605-6e3330811ec8e6580a9cf16a21726892.png)

表中有 1,2,5,19,100 共 5 条数据按顺序排列，我们说的 **行锁** 就是指对具体数据所在的行进行加锁，比如对 5 这一行数进行加锁。间隙锁是指的两个数据之间的区域，比如对上图 `(5, 19)` 之间的区域进行加锁，这个锁就叫做间隙锁，加锁后，其它事务是不允许对 `(5, 19)`  这个区域进行插入操作的。

> 我们知道 **行锁** 分为 **读锁** 和 **写锁**，对同一行数据的**读锁**和**读锁**之间是不存在冲突的，只有**读锁**和**写锁**，以及**写锁**之间存在冲突。而 **间隙锁** 则不同，它是对两个记录之间的空隙进行加锁，**锁与锁之间是不存在冲突的**（也就是说，两个事务可以分别对同一个空隙加锁），间隙锁保证的是**如果其它事务持有该间隙的锁，则当前事务不再允许在该间隙插入数据**。

MySQL 还引入了称为 **next-key lock** 的锁，这种锁是一个前开后闭的区间，其实质是 **间隙锁** + **行锁**。MySQL 加锁的基本单位是 **next-key lock**，在更新数据时，它会将查找过程中访问到的对象进行加锁。当然，MySQL 还时做了一些优化的，当对唯一索引进行等值查询时，**next-key lock** 会退化为 **行锁**，当对索引向右遍历时，如果最后一个值不满足等值查询条件，则 **next-key lock** 会退化为 **间隙锁**。
