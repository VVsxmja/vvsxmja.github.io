---
title: 使用 Netdata 来监控开发机的系统指标
authors:
  - me
---

Time to say goodbye to `htop` and `dstat` .

{/* truncate */}

---

不知道大伙在 Linux 系统上进行开发的时候，有没有过这样的体验：

- 我跑的某个工具卡住了，但我不知道它是在计算，还是在进行网络传输，还是挂了。
- 我的某个程序跑的很慢，但我不知道它 Bound 在 IO 还是 CPU 还是别的地方。

如果您之前只接触过 Windows 系统，那么这时您应该会下意识地寻找「任务管理器」这种东西。您可能会找到 `htop` ，或者（如果您正在使用图形界面）某个桌面环境的任务管理器。

这些程序提供了最基本的系统指标，例如 CPU 利用率、内存利用率等。但当我们遇到一些比较复杂/玄学的问题时，我们可能会想：如果能看到更详细的系统指标（比如 CPU 中断发生的频率），说不定能找到什么解决问题的线索。

比较有经验的 Linux 用户此时会转而使用 `dstat` 等工具，这些工具能够看到更加细节、一般的「任务管理器」不会展示的指标。

但这些工具仍然存在「不够开箱即用」，「难以回放历史记录」等问题，例如初次使用 `dstat` 的用户可能会遇到下面的困难：

- `dstat` 的默认输出中是不包含时间信息的，需要通过加上 `-t` 来在每行输出中附加时间信息。
- `dstat` 默认输出到 `stdout` ，能够回看的长度受限于终端缓冲区大小，需要通过加上 `-o ...` 来在打印命令行输出的同时输出到 CSV 文件。
- `dstat` 不支持在运行时更改采样间隔，只能对着打出来的 CSV 去按不同频率采样/聚合。

另外，相信大伙在项目中工作时，往往会发出「线上环境的基建，如果能在我的开发机上也布一套就好了」的感慨，在 CI 或是在生产部署上可以访问到的详细的监控，和我们开发机上可怜的寥寥几项指标相比，就像是奥迪和奥迪双钻的区别。

那么有没有一套开箱即用的监控服务，能很方便地在我的开发机上布起来，能够解决上面的所有痛点，并且也具备接入其他应用的能力？

答案是有的，请看 [Netdata](https://www.netdata.cloud/) 。

## 如果您没有听说过 Netdata

[Netdata](https://www.netdata.cloud/) 是一款很强大的[开源](https://github.com/netdata/netdata)监控工具。它开箱即用，除了具备 `dstat` 的各种能力之外，还提供了非常友好的 Web Dashboard ，**对于每一项指标都有很详细的描述**，就算是第一次接触的用户，也能快速上手。

![Netdata Agent](https://github.com/netdata/netdata/assets/2662304/af4caa23-19be-46ef-9779-8fdad8d99d2a)

例如默认配置下，Overview 中第一个 Metric - CPU 利用率的图表上方，就有如下的介绍：

> Total CPU utilization (all cores). 
>
> 100% here means there is no CPU idle time at all. You can get per core usage at the CPUs section and per application usage at the Applications Monitoring section.
>
> Keep an eye on iowait. If it is constantly high, your disks are a bottleneck and they slow your system down.
>
> An important metric worth monitoring, is softirq. A constantly high percentage of softirq may indicate network driver issues. The individual metrics can be found in the kernel documentation.

Netdata 就像是**生怕用户看不懂这些 Metrics** 一样，在每一个图表的上方都撰写了详细的描述。结合 Netdata 对于系统指标的强大的抓取能力，不管是新手还是老手，都能在 Netdata 中发现查看节点运行状况的一个新的角度。

百闻不如一见，Netdata 官方在世界各地都布了 Netdata Demo ，大伙可以直接点进去看看 Netdata 长什么样。

| [FRANKFURT](https://frankfurt.netdata.rocks) | [NEWYORK](https://newyork.netdata.rocks) | [ATLANTA](https://atlanta.netdata.rocks) | [SANFRANCISCO](https://sanfrancisco.netdata.rocks) | [TORONTO](https://toronto.netdata.rocks) | [SINGAPORE](https://singapore.netdata.rocks) | [BANGALORE](https://bangalore.netdata.rocks) |
| --- | --- | --- | --- | --- | --- | --- |

Netdata 除了自身具有观测系统指标的能力之外，同时也支持接入其他应用（例如 OpenMetrics 和 StatsD）以拓展它的能力。比如，安装了[这个插件](https://github.com/netdata/netdata/tree/master/src/collectors/systemd-journal.plugin)，您就可以在 Netdata 中查看 `systemd` 的 Journal Logs 了！

相信您此时已经按耐不住自己的心情，想要自己部署一套 Netdata 实例了！

（如果您还是 Get 不到 Netdata 好用在哪里，您也可以跟随下面的指引，一键启动一个 Netdata 来玩一玩，看看它是不是您的菜）

## 使用 Docker 启动 Netdata 实例

以下内容基于 [Netdata 官方文档](https://learn.netdata.cloud/docs/netdata-agent/installation/docker)编写。

Netdata 推荐的安装/部署方式是通过容器启动的。只需要一条命令 / 一个配置文件就能快速部署 Netdata ：

（当然在此之前，您需要确认您的网络条件可以让 Docker Engine 访问到 DockerHub ）

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cli" label="Docker CLI">

```sh
docker run -d --name=netdata \
  --pid=host \
  --network=host \
  -v netdataconfig:/etc/netdata \
  -v netdatalib:/var/lib/netdata \
  -v netdatacache:/var/cache/netdata \
  -v /:/host/root:ro,rslave \
  -v /etc/passwd:/host/etc/passwd:ro \
  -v /etc/group:/host/etc/group:ro \
  -v /etc/localtime:/etc/localtime:ro \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /etc/os-release:/host/etc/os-release:ro \
  -v /var/log:/host/var/log:ro \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --restart unless-stopped \
  --cap-add SYS_PTRACE \
  --cap-add SYS_ADMIN \
  --security-opt apparmor=unconfined \
  netdata/netdata
```

</TabItem>
<TabItem value="compose" label="Docker Compose">

```yaml
services:
  netdata:
    image: netdata/netdata
    container_name: netdata
    pid: host
    network_mode: host
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    volumes:
      - netdataconfig:/etc/netdata
      - netdatalib:/var/lib/netdata
      - netdatacache:/var/cache/netdata
      - /:/host/root:ro,rslave
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /etc/localtime:/etc/localtime:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /var/log:/host/var/log:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  netdataconfig:
  netdatalib:
  netdatacache:
```

</TabItem>
</Tabs>

这里的配置是最简单的开箱即用配置，关于更高级的配置，以及除了 Docker 以外的部署方法，请参考[官方文档](https://learn.netdata.cloud/docs/netdata-agent/installation)。

Netdata 会在 `19999` 端口跑一个 Web Dashboard ，结合 `--network=host` ，也就是跑在 Host 的 `19999` 端口上。

我们可以通过 SSH Tunnel 等方式，将这个端口转发到我们访问开发机的电脑上，然后就可以用浏览器访问啦！

最简单的转发方式，就是开一个 VS Code ，通过 [SSH Remote](https://code.visualstudio.com/docs/remote/ssh) 连接到我们的开发机，[在 Panel 里的「端口」标签页中增加一个 `19999` 端口的转发](https://code.visualstudio.com/docs/remote/ssh#_forwarding-a-port-creating-ssh-tunnel)，然后用浏览器打开 `http://localhost:19999` 就能访问了。

如果我们希望自动进行这样的操作，可以更改我们的 SSH Config ，使得每次通过 SSH 连接到开发机的时候，自动转发 19999 端口到本地。在上面的 VS Code 文档链接中[也有提到](https://code.visualstudio.com/docs/remote/ssh#_always-forwarding-a-port)。

下面提供我的配置文件作为参考：

```
Host dev
    # 基础配置
    HostName 开发机的 IP 地址
    User 开发机登陆用户名
    IdentityFile SSH 密钥地址

    # 转发 19999 端口到本地
    LocalForward 19999 127.0.0.1:19999

    # 可选，VS Code 会自动保活，不需要加这个
    ServerAliveInterval 15
    ServerAliveCountMax 240
```

## 结语

Netdata 提供了开箱即用的使用体验，详细、实时的系统指标，以及友好的 Web Dashboard ，值得大家进行尝试。

在具体的开发场景下，结合 Port Forwarding ，可以很方便地随时查看开发机的各项指标。

希望这篇文章有帮到您。
