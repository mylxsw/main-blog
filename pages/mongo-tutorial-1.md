---
title: "MongoDB 新手入门 - 索引"
date: 2022-05-30
tags: ["database"]
category: "技术分享"
---
# MongoDB 新手入门 - 索引

索引可以有效的提高 MongoDB 的查询效率，如果没有索引，在匹配指定条件的文档时，MongoDB 必须执行全集合的扫描，对每一个文档进行判断是否满足查询条件。如果有合适的索引，那 MongoDB 就可以利用该索引来减少需要遍历的文档数量。

## 简介

索引是一种特殊的数据结构，它存储了集合数据集的一部分，用于快速的对集合进行遍历。索引中存储了指定字段或者一组字段的值，并且按照字段的值有序存储。索引记录的有序存储让等值匹配和范围匹配更加高效。另外，MongoDB 也可以使用索引中数据的排序直接返回排序后的结果。

> MongoDB 索引采用了 B-tree 数据结构。

下图描述了使用索引对集合进行查询并且对文档进行排序：

![Diagram of a query that uses an index to select and return sorted results. The index stores ``score`` values in ascending order. MongoDB can traverse the index in either ascending or descending order to return sorted results.](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/06/10/095802-5ed7a3804b51bc7bc014d8c712362d29-index-for-sort.bakedsvg.svg)

MongoDB 中的索引比其他数据库管理系统要更小一些，MongoDB 在集合级别创建索引，并且支持对文档字段以及子文档字段创建索引。

### 默认索引 _id

在集合创建时，MongoDB 会在 `_id` 字段上默认创建一个唯一索引，该索引用于防止客户端插入两个具有相同 `_id` 值的文档。`_id` 字段的索引无法被删除掉。

> 在分片集群中，如果不使用 `_id` 字段作为分片 Key 的话，应用必须确保 `_id` 字段的唯一性来避免发生错误，通常该字段使用一个标准的自动生成的 [`ObjectId`](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ObjectId)。

### 创建索引

在 MongoDB 中使用 `db.collection.createIndex()` 方法来创建索引

```js
db.collection.createIndex( <key and index type specification>, <options> )
```

下面的例子为 `name` 字段创建一个单键降序索引：

```js
db.collection.createIndex({ name: -1 })
```

> `db.collection.createIndex()` 只能在集合中没有相同索引存在时有效。

#### 索引名称

默认的索引名为索引中的 key 和每一个 key 的排序方向（使用 1 或者 -1 表示）使用下划线作为分隔符拼接到一起。例如，对于索引 `{ item: 1, quantity: -1 }` 这个索引，它的名称默认为 `item_1_quantity_-1`。

通过 `name` 可选参数可以为索引自定一个自定义名称

```js
db.products.createIndex(
	{ item: 1, quantity: -1 },
  { name: "query for inventory" }
)
```

使用 `db.collection.getIndexes()` 方法查看集合中所有的的索引名称，索引一旦创建就不能被重命名了，应该先删除再使用新的名称重新创建索引。

### 索引类型

#### 单字段索引

除了 MongoDB 内置的 `_id` 索引，MongoDB 中也支持创建自定义的单字段索引

![Diagram of an index on the ``score`` field (ascending).](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/06/10/102333-8d30baa529c21342d4aa2425314bdea4-index-ascending.bakedsvg.svg)

对于单字段索引和排序操作来说，索引字段的排序（正序或者倒序）对查询没有影响，MongoDB 可以通过任意方向来遍历索引。

#### 组合索引

MongoDB 也支持用户在多个字段上自定义组合索引。组合索引中字段的顺序是非常重要的，例如，如果组合索引包含 `{ userid: 1, score: -1 }`，索引会先按照第一个字段 `userid` 进行排序，然后对于每一个 `userid` 的值，按照 `score` 排序。

![Diagram of a compound index on the ``userid`` field (ascending) and the ``score`` field (descending). The index sorts first by the ``userid`` field and then by the ``score`` field.](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/06/10/102720-79b0baa6b0323cd8af7363da12fd3f5e-index-compound-key.bakedsvg.svg)

对于组合索引和排序操作，索引字段的排序方向（正序和倒序）决定了该索引是否可以用于排序操作。

#### 多值索引（Multikey Index）

MongoDB 使用多值索引来索引数组字段，如果索引的字段包含数组值，MongoDB 会为数组中每一个值创建一个独立的索引记录。多值索引由 MongoDB 自动来判断，不需要显式的指定。

![Diagram of a multikey index on the ``addr.zip`` field. The ``addr`` field contains an array of address documents. The address documents contain the ``zip`` field.](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/06/10/103208-f59b3e62cd9252a5e8ebe512d8e1bff0-index-multikey.bakedsvg.svg)

#### 地理坐标索引

为了更加有效的支持地理坐标数据，MongoDB 提供了两个特殊的索引：

- 二维索引（2d indexes）：返回平面几何结果
- 二维球面索引（2dsphere indexes）：返回球面几何形状的结果

#### 文本索引

MongoDB 提供了一个 `text` 索引类型用于支持集合中字符串内容的搜索。

#### 哈希索引

哈希索引用于支持基于哈希的分片，这种索引会将文档随机的分配，但是支持持等值匹配，不支持范围匹配。

### 索引属性

#### 唯一索引 （Uniqkue Indexes）

索引的唯一属性让 MongoDB 可以拒绝集合中索引字段的重复值。除了唯一性约束之外，唯一索引在功能上与其它索引一致。

#### 部分索引（Partial Indexes）

部分索引只会索引集合中满足指定 flter 表达式的文档，通过索引集合中的文档子集，部分索引会占用的磁盘空间更少，并且也减少了索引创建和维护的性能开销。

部分索引在功能上是稀疏索引的超集，应当优先使用。

#### 稀疏索引（Sparse Indexes）

索引的稀疏属性让索引只包含拥有被索引字段的文档。这种索引会跳过不包含索引字段的文档。可以将稀疏索引选项和唯一索引选项一起使用来防止插入具有重复值的索引字段，并且跳过缺少索引字段的文档。

#### TTL 索引（TTL Indexes）

TTL 索引会让 MongoDB 自动的从集合中删除超过指定时间的文档。事件数据、日志以及会话信息等场景可以使用这种类型的索引。

#### 隐藏索引（Hidden Indexes）

> MongoDB 4.4 新增特性。

隐藏索引对查询计划是不可见的，并且不能用于查询。通过将一个索引设置为隐藏，用户可以在不删除索引的情况下评估删除掉索引所带来的影响。如果影响是负面的，用户可以取消索引的隐藏属性。

> 除了 _id 索引之外，其它索引都可以隐藏。

### 索引和 Collation

Collation 可以让用户指定语言相关的字符串比较规则。要使用索引来进行字符串比较，操作必须指定同样的 collation。

例如，集合 `myColl` 有一个字符串字段 `category` 的索引，collation 的区域为 "fr"：

```js
db.myColl.createIndex( { category: 1 }, { collation: { locale: "fr" } } )
```

对于下面的查询操作，指定同样的 collation 就可以使用该索引

```js
db.myColl.find( { category: "cafe" } ).collation( { locale: "fr" } )
```

下面的查询操作，使用了默认的 `simple` 二级制 collator，就无法使用该索引

```js
db.myColl.find( { category: "cafe" } )
```

### 覆盖查询

当查询条件和查询映射（返回的字段）只包含索引中的字段时，MongoDB 会直接从索引中返回结果，不需要再去扫描文档或者是把文档放入到内存中，这种查询是非常高效的。

![Diagram of a query that uses only the index to match the query criteria and return the results. MongoDB does not need to inspect data outside of the index to fulfill the query.](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/06/10/111824-af0daebe2d52fce2761ff8fd019ac37e-index-for-covered-query.bakedsvg.svg)

### 索引交叉

MongoDB 中可以使用索引的交集来满足查询，对于使用了组合条件的查询，如果一个索引可以满足部分查询条件，另一个索引可以满足另外一部分查询条件，MongoDB 就可以使用这两个索引的交集来满足整个查询。使用组合索引还是索引交叉来满足查询更加高效由特定的查询和系统来决定。

## 单字段索引

![Diagram of an index on the ``score`` field (ascending).](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/06/10/102333-8d30baa529c21342d4aa2425314bdea4-index-ascending.bakedsvg.svg)

假设有集合 `records` 中包含以下文档

```json
{
  "_id": ObjectId("570c04a4ad233577f97dc459"),
  "score": 1034,
  "location": { state: "NY", city: "New York" }
}
```

### 为内嵌文档的某个字段创建索引

为字段 `location.state` 创建索引

```js
db.records.createIndex({ "location.state": 1 })
```

该索引支持按照字段 `location.state` 的查询

```js
db.records.find({ "locaton.state": "CA" })
db.records.find({ "location.city": "Albany", "location.state": "NY" })
```

### 为内嵌文档创建索引

为字段 `location` 创建索引

```js
db.records.createIndex({ location: 1})
```

下面的查询可以使用 `location` 字段的索引

```js
db.records.find({ location: { city: "New York", state: "NY" } })
```

## 组合索引

![Diagram of a compound index on the ``userid`` field (ascending) and the ``score`` field (descending). The index sorts first by the ``userid`` field and then by the ``score`` field.](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/06/10/102720-79b0baa6b0323cd8af7363da12fd3f5e-index-compound-key.bakedsvg.svg)

使用以下的命令创建组合索引

```js
db.collection.createIndex( { <field1>: <type>, <field2>: <type2>, ... } )
```

索引字段的顺序对查询有非常重要的影响。对于大部分组合索引，可以按照 [ESR (Equality, Sort, Range) 规则](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-rule/#std-label-esr-indexing-rule) 进行优化。

假设我们有一个名为 `products` 的集合

```json
{
 "_id": ObjectId(...),
 "item": "Banana",
 "category": ["food", "produce", "grocery"],
 "location": "4th Street Store",
 "stock": 4,
 "type": "cases"
}
```

### 创建组合索引

下面的操作为 `item` 和 `stock` 字段创建正序索引

```js
db.products.createIndex({ "item": 1, "stock": 1 })
```

组合索引中字段的排列顺序是非常重要的，该索引首先会包含对文档中 `item` 字段的排序结果值，对于每一个 `item` 字段的值，按照 `stock` 字段的值进行排序。

除了支持匹配所有索引字段的查询，组合索引也可以支持只包含匹配索引字段前缀的查询：

```js
db.products.find( { item: "Banana" } )
db.products.find( { item: "Banana", stock: { $gt: 5 } } )
```

### 排序

索引中以正序或者倒序存储了字段的引用，对于单字段索引来说，由于 MongoDB 可以支持按照任意方向进行遍历，因此排序方式无关紧要。但是对于组合索引来说，情况就不同了，字段的排序方向决定了该索引是否可以支持排序操作。

假定一个名为 `events` 的集合中的文档包含 `username` 和 `date` 字段。应用可能以以下两种方式查询

```js
db.events.find().sort({ username: 1, date: -1 })
db.events.find().sort({ username: -1, date: 1})
```

下面的索引可以支持以上两个排序操作

```js
db.events.createIndex({ "username": 1, "date": -1 })
```

但是，该索引不支持以下操作

```js
db.events.find().sort({ username: 1, date: 1 })
```

### 前缀

索引前缀是索引字段从开始部分开始的子集，例如下面的组合索引

```json
{ "item": 1, "location": 1, "stock": 1 }
```

这个索引有下面的索引前缀

- `{ item: 1 }`
- `{ item: 1, location: 1 }`

MongoDB 可以使用索引前缀来支持查询，对于上面的索引，MongoDB 可以在以下字段的查询中使用索引

- `item` 字段
- `item` 字段和`location` 字段
- `item` 字段和 `location` 字段以及 `stock` 字段

MongoDB 也可以使用索引来支持对 `item` 和 `stock` 字段的查询，其中 `item` 字段对应了索引前缀 `item`，但是该索引中的 `stock` 字段就没有用到了。
