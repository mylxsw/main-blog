---
title: "Gor 网络抓包和流量镜像"
date: 2018-07-16
seo: ["gor", "tcpdump", "command", "linux"]
tags: ["linux"]
category: "技术分享"
---
# Gor 实现网络抓包和流量镜像

项目地址 ：https://github.com/buger/goreplay

## 流量抓包

下面的命令实现了监听 88 端口的HTTP请求，过滤出请求路径为 `/app/noticex` 的请求，输出到标准输出

```bash
/usr/local/bin/gor --input-raw :88 --output-stdout --http-allow-url /app/noticex
```

## 流量镜像

以下命令实现将所有发往 **:9998** 的 HTTP 请求，如果请求地址匹配  **/mid-api/mm/mm/voice/callback**，则将其复制一份，转发给 **http://192.168.0.47:18888**，并且将请求的地址 **/mid-api/mm/mm/voice/callback** 重写为 **/callback/voice/tencent**，添加请求参数 **token=6ae4f7752bae71a6a2**。

```bash
# 镜像发往网关的语音回调请求发往本地的消息服务
/usr/local/bin/gor --input-raw :9998 \
	--output-http http://192.168.0.47:18888 \
	--http-allow-url /mid-api/mm/mm/voice/callback \
	--http-rewrite-url /mid-api/mm/mm/voice/callback:/callback/voice/tencent \
	--http-set-param token=6ae4f7752bae71a6a2
	
# 镜像发往正式消息服务的请求发往本地消息服务
/usr/local/bin/gor --input-raw :24020 --output-http http://192.168.0.47:18888 --http-allow-url /sms --http-allow-url /batch-sms --http-allow-url /voice --http-allow-url /batch-voice 
```

如下图所示

![image-20210311173455517](https://ssl.aicode.cc/prometheus/20210311173455.png)

本地电脑 IP 地址为 192.168.0.47，就能够收到从服务器镜像过来的请求了。

---

- [使用文档参考](https://github.com/buger/goreplay/wiki)
