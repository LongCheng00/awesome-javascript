你好，我是陈磊。

上一次我们一起聊了聊RAG系统相关的技术内容，其核心流程是将用户查询经Embedding模型向量化后，在向量数据库中检索相似文档块（chunks），再与原查询组合输入大模型生成响应，从而减少幻觉并提升准确性。今天我们一起聊一聊Anthropic公司在2024年1月份推出的MCP协议，MCP（Model Context Protocol）协议一经推出就受到了大模型应用开发者的热捧，这既得益于实现MCP协议的简单，也得益于大模型本身存在的弊端。


## MCP是什么？

虽然大模型的能力非常强大，但是你也肯定听说过大模型最大的两个问题，一是知识在训练时期固定，二是无法与外部世界交互。


为什么说知识在训练时期固定呢？大模型在训练过程中基于特定数据集学习知识，这些数据集有明确的“截止日期”，GPT-3.5 Turbo训练数据截止到2021年9月。训练完成后，模型无法自动更新或“学习”新信息，除非通过重新训练或微调。这就导致大模型对于训练数据截止日期以后的事情一无所知。


而且纯大模型本质上就是一个“封闭系统”，它们只能基于内部参数生成响应，无法直接调用API、访问数据库或执行实际操作（如预订会议、更新CRM记录）。 这意味着它们缺乏“代理能力”（agency），不能主动改变外部环境，大模型自己无法实时处理数据，也无法执行需要权限或者状态变化的任务。


MCP的提出为大模型与外部数据、应用和服务之间建立了桥梁，它提供了一种安全、标准化的通信方式，将静态的大模型变成了动态的智能体，因此也可以用来解决大模型最大的两个问题。


MCP 建立在工具使用和函数调用等现有概念之上，并对其进行标准化。这样就无需为每个新的 AI 模型和外部系统创建自定义连接。它使 LLM 能够使用最新的真实数据、执行操作，并访问其原始训练中未包含的专业功能。因此MCP也给测试开发工程师提供了新思路。


测试开发工程师很难获得足够的时间、成本、算力投入到模型训练去，从零训练一个服务于测试的大模型这样的事情看机遇，那么微调一个服务于测试的模型也需要投入人力、算力、时间，这类业务需要团队提供强有力的支持，并不是每一个测试开发工程师都有的机遇。但是为大模型提供MCP Server，让大模型可以访问我们的测试服务、测试数据，确实一个小成本的事情，只要掌握了MCP的开发，就可以实现了。

![图片](https://static001.geekbang.org/resource/image/fd/59/fd06bb8940fd82358c62e533b4712459.jpg?wh=3460x1980)

MCP 就像一个“中介管家”，它能把各种本地或远程的资源和服务（比如数据、工具、API）连接起来，让它们通过统一的协议“聊天”，最终服务于一些MCP Host应用。想象一下：你家有本地资源（A和B），外面还有云端服务（C），MCP 就像快递中转站，把这些东西打包，通过专线（协议）送到你的“智能管家”App（MCP Host）手里。


整个流程是双向的：资源发数据给主机，主机也能控制资源。就如上图中所示，MCP有三个组件**MCP Servers**、**MCP Protocol**和 **MCP** **Host**。下面我一步一步地给你讲解一下。

* MCP Server就像本地仓库管理员，负责从其他地方拉取需要的货物，每个MCP Server负责一类货物。这个货物极可能是从本地调取的，也可能是通过网络远程调取的。MCP Server 是需要通过MCP暴露一些特殊能力的轻应用，这就和我们做HTTP 服务测试时的被测试服务一样，封装了一些逻辑处理能力，通过HTTP协议的要求对外提供访问。MCP Server也是一样的，通过MCP协议的封装，提供一些数据、逻辑处理的能力。

* MCP Client就是一个能够对接MCP Server的“翻译官”，专门负责将协议层的内容转成MCP Host可以读懂的内容，这就和我们经常打交道的HTTP Client一样，在我们开发一个接口测试框架的时候，如果有Java，那么有net.http.HttpClient类支持和HTTP Server按照HTTP协议进行交互，如果你是python技术栈，那么可以选择requests库和HTTP Server进行交互，这些都是对应技术栈的HTTP Client，同理 MCP Client也是一样的。

* MCP Host是需要通过MCP获得数据的程序，这就像我们做一些HTTP协议接口测试的时候大家有时候会用一些测试工具，例如postman、jmeter等，这些可以理解成HTTP协议的host，所以MCP Host就类似一些可以支持通过内调用自己内部的MCP Client访问MCP Server的程序，例如Claude Desktop、Cursor、cline（VS Code插件）、Roo Code（VS Code插件）或一些AI工具。


MCP Server和MCP Client间的传输方式有两种，分别是STDIO和SSE（MCP 协议版本 2025-03-26 开始推荐使用Streamable HTTP 替代SSE），STDIO 用于本地（Local）资源和服务器的通信，而 SSE（Streamable HTTP）用于远程（Remote）Web API 和当前MCP Host的传输。

![图片](https://static001.geekbang.org/resource/image/56/ac/56122fb969d6d62d095fb7d78fyy7aac.jpg?wh=3424x1940)

MCP使用了JSON-RPC 2.0作为client和server端的消息传输。JSON-RPC 2.0是一个用JSON编码的轻量级远程过程调用协议，它易读、易调试，与编程语言和环境无关，技术成熟，规范清晰且应用广泛等优点，也为MCP的广泛应用提供了支持。SON-RPC 2.定义了request、response、notification三种类型的消息（例如，图中消息体的例子）。

* request是client发给server的一个操作请求，消息包含唯一的id，调用的方法名（例如，tools/call），传给方法的参数（可空）。

* response是server返回给client的消息，消息包含和request相同的id，处理的结果或者错误。

* notification是不需要回应的单向信息。通常由服务器发送给客户端，以提供有关事件的更新或通知。


![图片](https://static001.geekbang.org/resource/image/47/3d/47664c1f898cbec018f619d4fbc6123d.jpg?wh=3293x1499)

MCP Servers通过MCP Protocol向Host Application提供一些功能列表，例如提供一个工具列表，然后Host 会将这个列表格式化成一个LLM能读懂的格式。Host 可以利用这个功能列表向LLM发送一些需要大模型处理的请求（这就是prompt），LLM会根据这次的prompt返回一个tool_calls的json字符串。当Host接受到这个tool_calls后，就会调用对应的MCP server工具返回对应的结果了。

## Function Call和MCP

我相信你肯定也听说过Function Call，这个由OpenAI创造出来让大模型能够调用外部函数的能力。那么为什么还要有MCP呢？


Function Calling是可以用自己的函数当作调用ChatGPT的参数，在函数中我们可以做任何事情，例如获取网络上的数据、查询自己的数据库等。白话就是大模型函数调用，不是说去调用大模型函数，而是告诉大模型它需要调用哪些函数完成处理，然后返回结果。


这么看着和MCP感觉差不多，其实两者都是为了解决大模型的两个核心问题而设计的。


Function Call是大模型根据上下文自动执行函数的机制，它充当了 AI 模型与外部系统之间的桥梁，但是不同的模型有不同的 Function Calling 实现，代码集成的方式也不一样，这种方式是由不同的 AI 模型平台来定义和实现。


而MCP是一个标准协议，如同电子设备的 Type C 协议（可以充电也可以传输数据），使 AI 模型能够与不同的 API 和数据源无缝交互，从而使 AI 系统更可靠，更有效。通过建立通用标准，服务商可以基于协议来推出它们自己服务的 AI 能力，从而支持开发者更快的构建更强大的 AI 应用。开发者也不需要重复造轮子，通过开源项目可以建立强大的AI生态。MCP 可以在不同的应用/服务之间保持上下文，从而增强整体自主执行任务的能力。


## MCP的第一个例子

随着MCP获得广泛认可，OpenAI也支持对手公司提出的MCP协议了，其实OpenAI是有协议指定的先机的，可是机会稍纵即逝，就这么让给了Anthropic了。说了这么多，相信你肯定对如何使用MCP提起了兴趣，那么下面我就实际带你配置和使用一个简单的本地MCP Server，让你真正体验一下MCP服务的简单和便捷。


下面的例子使用了Claude Desktop作为我们的MCP Host，配置了一个访问本地文件系统的MCP Server，这个MCP Server是本地的服务，因此采用了STDIO的方式访问。


首先打开Claude Desktop 的Setting，然后然后选择Developer下的Edit Config。![图片](https://static001.geekbang.org/resource/image/c1/44/c1cb4c0b02f852c3148b11195a5f3e44.png?wh=916x280)

打开claude_desktop_config.json，完成文件系统的MCP Server配置。配置如下：

```perl
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/Users/username/Downloads"
      ]
    }
  }
}
```
注意，如上配置中username需要替换成自己自己电脑的用户名，同时也需要本地安装node.js的环境，上面的配置可以让MCP Server访问桌面和下载文件夹。
![图片](https://static001.geekbang.org/resource/image/92/c9/92c874a733f6083a5dd79262b53933c9.png?wh=1526x372)
配置完成后，重启Cluade Desktop，点击锤子的icon就可以看到MCP Server提供的工具了。

![图片](https://static001.geekbang.org/resource/image/37/ef/37d115f7980ec2c5eb814856eed43fef.png?wh=962x1016)
怎么样，是不是非常简单，那么下面我们看看怎么使用这个MCP Server。你可以在Claude Desktop中输入如下Prompt：

```perl
谁帮我把桌面上的所有图片都移到一个新文件夹里，新的文件夹命名为"picture"。
```
当大模型接收到上面的Prompt后，大模型判断是否有可以用MCP Server提供的工具可以使用，这个时候它刚好读到了我们提供的MCP Server有list_allowed_directories、get_file_info、create_directory等工具，因此它就利用这些工具完成了你交给它的任务。
![图片](https://static001.geekbang.org/resource/image/95/41/95eb268be3de45b520804e532514a541.png?wh=932x416)
在大模型调用工具完成任务过程中，会需要几次获取访问文件系统的权限授权，一定要点击允许，否则它就完不成任务了。

![图片](https://static001.geekbang.org/resource/image/43/c3/432f428110c170d847bf7eea16b841c3.png?wh=1350x610)
在允许了对应的操作后，我们就可以看到大模型调用MCP Server开始刚工作了。


## 总结

今天我们一起聊了MCP协议以及它和Function Call的区别，最后我们一起实践了一个MCP Server的例子，相信MCP的用法简单、配置容易等特点一定给你留下了深刻的印象，MCP将为每一个测试开发工程师打开一个新的大模型赋能测试过程的大门。


最后希望你能牢记今天的主要内容：

* MCP服务提供了STDIO和SSE（Streamable HTTP）两种模式，这两种模式本地服务STDIO方式最为有效，网络方式SSE（Streamable HTTP）模式是最优解。

* MCP Host可以是任何一个继承了MCP Client的应用，因此你在内部使用的时候一定要物尽其用，尽量充分利用现有的Host来解决问题，避免重复开发浪费精力。

## 思考题

今天MCP最后的例子我推荐你自己亲手试一试，只有动手了才能对MCP的有更充分的理解，如果你也完成了如上的MCP Server的配置，你都利用它完成了什么样的任务呢？请你在隐藏了关键信息后，将利用大模型和MCP Server的过程发到评论区，我是陈磊，我在评论区等你一起交流讨论。


