---
title: "实用的 Linux 命令集锦"
date: 2022-10-01
tags: ["linux"]
category: "技术分享"
---
# 实用的 Linux 命令集锦

## 网络管理

### 捕获指定端口的所有流量

```bash
tcpdump -tttt -s0 -X -vv tcp port 8080 -w captcha.cap
```

### 查看本机的公网 IP

```bash
curl http://members.3322.org/dyndns/getip
```

### TCP 连接数统计（状态维度）

```bash
netstat -na | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
```

### 服务器连接数按照 IP 分类排行榜

```bash
netstat -tun | awk '{print $5}' | cut -d ： -f1 | sort | uniq -c | sort -n -r | head -10
```

### 网络监控工具

#### iftop

![iftop](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/03/02/160325-56d4e3715f63fca1fd705c12269c976e-image-20220302160325913.png)

#### iptraf

安装 

```bash
yum install iptraf
```

![iptraf](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/03/02/160409-929f2e96138aa10062450f1cf16b54d3-image-20220302160409067.png)

#### nethogs 可以查看进程级别的网络用途

安装

```bash
yum install nethogs
```

![nethogs](https://raw.githubusercontent.com/mylxsw/gallery/main/assets/2022/03/02/161154-67f6cb7221a65b89b71357eb11e5f5fb-image-20220302161154468.png)

## 文件处理，内容编辑

### 文件夹内容批量对比

```bash
diff -w -urNa  /Users/mylxsw/Downloads/demo /Users/mylxsw/codes/bigdata/matlc-status-stats/statusReport	
```

### Redis 批量删除 Keys

```bash
redis-cli -h HOST -a PASSWORD keys 'prefix:*' | xargs redis-cli -h HOST -a PASSWORD del
```

### 文件内容替换、修改

```bash
# 内容替换
find -L . -name '.env' -exec sed -i -e 's/DB_DATABASE=\(.\+\)/DB_DATABASE=xxxxxx/' {} \;
# 内容追加
find -L . -name '.env' -exec sed -i -e '$ a SUPERVISOR_CONF_DIR=/etc/supervisor.d' {} \;
```

### 批量对查找到的文件执行命令

基本模式为 

```bash
find -L . -name '.env' -exec 执行的命令 {} \;
```

其中文件名用 `{}` 取代。

```bash
# 修改所有 .env 文件的权限，去掉其它用户读取权限
find -L . -name '.env' -exec chmod o-r {} \;
# 批量删除名为 .env-e 的文件
find -L . -name ".env.*-e" -exec rm -fr {} \;
```

### 批量查询文件中的内容

```bash
find -L . -name '.env' | xargs grep -ri 'YS_SERVICE_CENTER'
```

### 删除 N 天前的文件

```bash
find /data/backup -mtime +15 -name '*.tar.gz' -print0 | xargs -0 rm -fr
```

### 自动备份目录，保留 N 天

```bash
#!/usr/bin/env bash

# 备份产品原型
tar -zcvf /data/backup/smb.$(date +%Y%m%d).tar.gz /data/smb

# 删除5天前的备份
find /data/backup -mtime +5 -name '*.tar.gz' -print0 | xargs -0 rm -fr
```

### 移动指定目录下 N 天前的文件到其它目录

```bash
find . -mtime +30 -name '*.log-*' -print0 | xargs -0 -t -I {} mv {} ../archive/
```

### 查找所有指向某个文件的链接

```bash
find / -lname path/to/foo.txt 
```

### 查找目录下大于 100M 的文件

```bash
find . -type f -size +100M
```

### 图片批量压缩

```bash
for img in `find ./ -name "*.jpg"`; do convert -quality 70 $img ${img/jpg/thumb.jpg}; done
for img in `find ./ -name "*.jpg"`; do convert -quality 70 $img $img; done
```

### 使用pushd和popd命令快速切换目录

经常会有这么一种情况，我们会在不同目录中进行频繁的切换，如果目录很深，那么使用`cd`命令的工作量是不小的，这时可以使用`pushd`和`popd`命令快速切换目录。

```bash
$ pwd
/Users/mylxsw/codes/php/lecloud/api
$ pushd .
~/codes/php/lecloud/api ~/codes/php/lecloud/api
$ cd ../album/
$ pwd
/Users/mylxsw/codes/php/lecloud/album
$ popd
~/codes/php/lecloud/api
$ pwd
/Users/mylxsw/codes/php/lecloud/api
```

### 目录下文件大小排序

```bash
du -sh * | sort -sk1hr
```

## 状态监控

### Redis 统计不同 IP 客户端连接数

```bash
redis-cli -h 127.0.0.1 -p 6379 CLIENT LIST | sed -n 's|.*addr=\(.*\)\:.*|\1|p' | sort | uniq -c
```

![Redis统计不同IP客户端连接数](https://ssl.aicode.cc/prometheus/20200831102211.png)

### 查看服务器 CPU 信息

```bash
# 查看物理CPU个数
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l

# 查看每个物理CPU中core的个数(即核数)
cat /proc/cpuinfo| grep "cpu cores"| uniq

# 查看逻辑CPU的个数
cat /proc/cpuinfo| grep "processor"| wc -l

# 查看CPU信息（型号）
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
```

### 查看某个命令的内存占用详情

```bash
ps ef -o command,vsize,rss,size -C php-fpm
```

参数`-C`指定查找的命令名称，其它参数如下

- VSZ - Virtual Memory Size (swapped out, shared libs, everything)
- RSS - Resident Set Size (everything not swapped out)
- SIZE - Data segment of the process

### 查看系统所有进程打开文件数量排行

```bash
lsof -n +c 15 | awk '{printf "%8s %s\n", $2, $1}' | sort | uniq -c | sort -nr
```

第一个命令 `lsof` 参数 `+c 15` 指定了命令列输出的宽度。

## 磁盘管理

### 磁盘格式化

执行 fdisk 分区

```bash
# fdisk /dev/vdb
n
p

w
```

文件系统初始化

```bash
mkfs.ext4 /dev/sdb1
```

挂载磁盘分区

```bash
mkdir /data
mount /dev/sdb1 /data
```

持久化挂载磁盘

```bash
vim /etc/fstab
/dev/vdb1               /data                   ext4    defaults        1 2
```

### 拷贝外部磁盘（SD卡）到镜像文件

> 使用 `brew install coreutils` 安装 `gdd` 命令

```bash
# /dev/disk7 为通过 diskutil list 命令查看到的外部磁盘设备
sudo gdd if=/dev/disk7 of=sd_backup.dmg  status=progress bs=16M
```

### 拷贝镜像文件到外部磁盘（SD卡）

```bash
# 卸载磁盘 
# /dev/disk8 为通过 diskutil list 命令查看到的外部磁盘设备
sudo diskutil unmountDisk /dev/disk8
# 拷贝到磁盘
sudo gdd of=/dev/disk8 if=sd_backup.dmg status=progress bs=16M
```

## 其它

### 判断证书与私钥是否匹配

```bash
(openssl x509 -noout -modulus -in server.pem | openssl md5 ; openssl rsa -noout -modulus -in server.key | openssl md5) | uniq 
```

### GIT 清理指定文件的历史记录

```bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch src/main/resources/application.properties' --prune-empty --tag-name-filter cat -- --all
git push origin master --force
```

### Linux 设置账号密码过期时间

命令 `chage` 参数:

```bash
Usage: chage [options] LOGIN

Options:
  -d, --lastday LAST_DAY        set date of last password change to LAST_DAY
  -E, --expiredate EXPIRE_DATE  set account expiration date to EXPIRE_DATE
  -h, --help                    display this help message and exit
  -I, --inactive INACTIVE       set password inactive after expiration
                                to INACTIVE
  -l, --list                    show account aging information
  -m, --mindays MIN_DAYS        set minimum number of days before password
                                change to MIN_DAYS
  -M, --maxdays MAX_DAYS        set maximum number of days before password
                                change to MAX_DAYS
  -R, --root CHROOT_DIR         directory to chroot into
  -W, --warndays WARN_DAYS      set expiration warning days to WARN_DAYS
```

命令示例:

```bash
# 查看密码过期时间
chage -l developer

# 设置密码过期时间（设置 developer 账号密码有效期为 90 天，提前 15 天收到警告信息）
chage -d 0 -m 0 -M 90 -W 15 developer

# 设置密码永不过期
chage -M 99999 -W 7 developer
```

### Supervisord

添加新服务时，使用 `supervisorctl reload` 会导致所有服务被重启，请使用下面的命令添加

```bash
[root@namenode1 conf_file]# supervisorctl reread
mat-governance-streaming: available

[root@namenode1 conf_file]# supervisorctl add mat-governance-streaming
mat-governance-streaming: added process group
```

新服务模板

```bash
[program:mongodb-listener]
command = /data/webroot/mongodb-listener/latest/startup.sh
user=hadoop
autostart=true
autorestart=true
startsecs=10
stopasgroup=true
killasgroup=true
startretries=2
redirect_stderr=true
```

### 创建一个临时的 TCP 服务器，监听请求

```bash
nc -l 19994 -k
```

参数说明：

- **-l 19994** 监听 19994 端口
- -k 支持多个连接，不添加该参数，只支持一个连接，连接断开后程序退出

## Windows 端口转发给 WSL

在 Windows 下以管理员权限执行

```bash
netsh interface portproxy add v4tov4 listenport=80 connectaddress=172.27.12.19 connectport=80 listenaddress=* protocol=tcp
```

### Consul 服务手动注销

- 列出所有服务，找到服务的 id

    ```bash
    curl http://127.0.0.1:8500/v1/agent/services
    ```

- 注销服务

    ```bash
    curl -X PUT http://127.0.0.1:8500/v1/agent/service/deregister/biz-machine-checkup-ms-tdy-private-computer-13006
    ```

### Kafka Topic 删除

```bash
# 查看所有 Topics 的消费延迟
./kafka-consumer-groups.sh --bootstrap-server 10.22.1.143:9092 --describe --all-groups

# 删除 Topic
/kafka-topics.sh --bootstrap-server 10.22.1.143:9092  --delete --topic mqtokafka_test
```
