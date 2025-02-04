---
title: Podman 配置 DockerHub Mirror Registry
authors:
  - me
---

省流版等全部写完再写吧

<!-- truncate -->

## 背景

### Podman

我在新的共享主机上尽量配置 Podman 而不是 Docker 。

原因：

- 多用户使用
- 最小特权
- 其他，有时间再想

### 文档只会给出针对 Docker 的配置方法

比如我们用的华为云，在镜像加速器（链接）页面，会给出针对 Docker 的配置方法。

就是那个什么 JSON 文件

（贴个实例代码）

配好了之后跑两行命令重启一下 Docker （到底需不需要跑，忘记了）

## 怎么做

Docker 由于钦点了 DockerHub ，所以有一个专门的配置项，代表 DockerHub Mirror 。

而 Podman 面前众生平等，DockerHub 只是一个普通的 Registry ，

所以 Podman 当中找不到这样的傻瓜配置项。我们需要像配置一个外部 Registry 一样配置我们的 Mirror 。

### 介绍 Podman Registry 的配置方法

介绍一下

### 介绍 Podman Mirror Registry 的配置方法

介绍一下

### 把 DockerHub 镜像站给的配置方法翻译成 Podman 配置

翻译一下

### Block DockerHub

配置完了之后我们还要阻止对于 DockerHub 的访问，让所有请求走我们的镜像站。
