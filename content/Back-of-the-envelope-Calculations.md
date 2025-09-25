---
title: "Back-of-the-envelope Calculations 粗略估算"
date: 2023-02-06
tags: ["concept"]
category: "技术分享"
---
# Back-of-the-envelope Calculations 粗略估算

## 时间单位

时间单位秒(second)，毫秒(millisecond)，微秒(microsecond)，纳秒(nanosecond)换算

- 1s = 1000ms （秒 -> 毫秒）
- 1ms = 1000μs （毫秒 -> 微秒）
- 1μs = 1000ns (微秒 -> 纳秒)

## 数据单位

数据的表示常用的有两种标准：

- **IEC**：国际电工委员会（International Electrotechnical Commission）
- **SI**：国际单位制，世界上最普遍采用的标准度量系统

![](https://ssl.aicode.cc/mweb/20240812/16756685292793.jpg)

## 一些常见的数字（2020版）

| 操作                                   | 延迟          | 备注 |
|----------------------------------------|---------------|------|
| L1 cache reference                     | 1ns           |      |
| Branch mispredict                      | 3ns           |      |
| L2 cache reference                     | 4ns           |      |
| Mutex lock/unlock                      | 17ns          |      |
| Main memory reference                  | 100ns         |      |
| Compress 1KB with Zippy                | 2,000ns ≈ 2μs  |      |
| Send 2,000 bytes(2KB) over commodity network | 44ns          |      |
| SSD random read                        | 16,000ns ≈ 16μs |      |
| Read 1,000,000 bytes(1MB) sequentially from memory | 3,000ns ≈ 3μs |      |
| Round trip in same datacenter | 500,000ns ≈ 500μs |      |
| Read 1,000,000 bytes(1MB) sequentially from SSD | 49,000ns ≈ 49μs |      |
| Disk seek | 2,000,000ns ≈ 2ms |      |
| Read 1,000,000 bytes(1MB) sequentially from disk | 825,000ns ≈ 825μs |  |
| Packet roundtrip CA to Netherlands | 150,000,000ns ≈ 150μs |  |

不同年份的数值参考可以看这里：https://colin-scott.github.io/personal_website/research/interactive_latency.html

![](https://ssl.aicode.cc/mweb/20240812/16756707478520.jpg)

## 参考

- [Google Pro Tip: Use Back-Of-The-Envelope-Calculations To Choose The Best Design](http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelope-calculations-to-choo.html)
- [维基百科：SI 国际单位制](https://zh.wikipedia.org/zh-cn/%E5%9B%BD%E9%99%85%E5%8D%95%E4%BD%8D%E5%88%B6)
- [维基百科：Mebibyte](https://zh.wikipedia.org/zh-cn/Mebibyte)
- [Data Units](http://wiki.webperfect.ch/index.php?title=Data_Units)
