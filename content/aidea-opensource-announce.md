---
title: "AIdea 宣布开源"
date: 2023-09-10
tags: ["aidea"]
category: "产品洞察"
---
# AIdea 宣布开源

花了小半年开发了一个 AI 套壳 APP ，这是我本人第一次尝试开发 APP ，现学现做，投入了大量的时间和精力，然而大势已过，加上国家对 AIGC 类 APP 的管控越来越严格，APP 上架后第二版就被禁止在国内销售了，思来想去，再继续搞下去前途也比较迷茫。所以直接开源了，需要的自取哈。

APP 使用的是 Flutter 开发的，后端为 Golang 。支持 Web 端，Android 、IOS APP ，桌面端（Windows+Mac）。

大约在 10 天前，我在 V 站发布了名为 [花了小半年开发了一个 AI 套壳 APP ，然而大势已过，直接开源了](https://www.v2ex.com/t/969458) 的帖子，受到了大家的广泛关注，截止至目前已取得以下成绩

- [APP 端代码](https://github.com/mylxsw/aidea) 在 Github 上获得了 3.3K Star  （截止至 2024 年 8 月，已有 6.4K+）
- [APP 服务端代码](https://github.com/mylxsw/aidea-server) 在 Github 上获得了 250+ Star （截止至 2024 年 8 月，已有 1.5K+）
- APP 注册用户数量增长 5.4K+ （截止至 2024 年 8 月，已有 22K+）
    
> APP 服务端代码其实前段时间一直都是一个空仓库，我当时说 2023 年 9 月 10 日前开源后端代码。经过一周的努力（下班时间），终于在上周六将服务端的代码发布到了 [Github](https://github.com/mylxsw/aidea-server)。

### 简介

一款集成了主流大语言模型以及绘图模型的 APP ， 采用 Flutter + Golang 开发，代码完全开源，支持以下功能：

- 支持 OpenAI 的 GPT-3.5，GPT-4 大语言模型
- 支持 Anthropic 的 Claude instant，Claude 2.1 大语言模型
- 支持 Google 的 Gemini Pro 以及视觉大语言模型
- 支持国产模型：通义千问，文心一言，讯飞星火，商汤日日新，腾讯混元，百川53B，360智脑，天工，智谱，月之暗面等
- 支持开源大模型：Yi 34B，Llama2，ChatGLM2，AquilaChat 7B，Bloomz 7B，轩辕 70B，ChatLaw，Mixtral 等，后续还将开放更多
- 支持文生图、图生图、超分辨率、黑白图片上色、艺术字、艺术二维码等功能，支持 SDXL 1.0、Dall·E 3 等
    
### 项目地址

- APP （ Flutter ）： [https://github.com/mylxsw/aidea](https://github.com/mylxsw/aidea)
- 服务端（ Golang ）： [https://github.com/mylxsw/aidea-server](https://github.com/mylxsw/aidea-server)
    
### 在线体验

Android/IOS APP： [https://aidea.aicode.cc/](https://aidea.aicode.cc/)

Mac/Windows 桌面端： [https://github.com/mylxsw/aidea/releases](https://github.com/mylxsw/aidea/releases)

Web 端： [https://web.aicode.cc/](https://web.aicode.cc/)

下面是 App 的部分截图

![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-32-34.png-thumb)  | ![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-32-42.png-thumb)
:-------------------------:|:-------------------------:
![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-32-53.png-thumb)  | ![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-33-44.png-thumb) 
![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-34-14.png-thumb)  | ![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-34-28.png-thumb) 
![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-34-42.png-thumb)  | ![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-35-01.png-thumb) 
![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-35-33.png-thumb)  | ![images](https://ssl.aicode.cc/ai-server/article/Xnip2023-08-30_11-35-52.png-thumb)
