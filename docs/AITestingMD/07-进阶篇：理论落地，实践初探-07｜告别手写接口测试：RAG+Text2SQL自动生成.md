你好，我是陈磊。

上一节课我们一起讨论了基于RAG的测试用例生成方法，其中我们应用了比较传统的**需求条目化**方法重新整理了需求，为RAG的知识库做好了准备，最后用dify这个低代码的大模型应用搭建平台完成了一个demo的搭建。在我给出demo后，相信你也有了自己的想法。今天我会继续聊RAG应用于测试实践这个话题，下面我们看大模型和接口测试有哪些碰撞，相信今天的内容也会让你眼前一亮，有跃跃欲试的冲动。


## 提示词工程能生成接口测试吗？

我们在课程前面几节课中就说过大模型的使用技术中投入成本最低、起效最快的就是提示词工程了，所以当你想利用大模型来帮你做一些工作的时候，最先考虑的就应该是提示词工程，如果Prompt并没有很好地达成你想要的效果，那么我们再考虑用知识库给大模型更多的私域知识作为参考。


按照从简到繁的过程，我们先看如何用提示词工程生成接口测试。


想要生成接口测试，必须有一些接口的相关信息作为提示词输入给大模型，我们最先想到的就是开发人员写的接口代码，把这些接口代码作为提示词的一部分，让大模型生成接口测试用例，通过这个思路我设计了如下系统提示词。

```perl
# 作者：CrissChan
# 版本：0.1
# 日期：2025-05-01
# 模型：claude 3.7 Sonnet
# 用途：根据被测试系统的源代码，生成JMeter5.3的测试脚本
# 如下是你的system prompt

def 资深测试开发专家():
    """
    你是一名从业20年的资深测试开发专家，对于Java技术栈理解深刻，尤其SpringBoot和Spring Cloud的微服务架构非常精通。
    对于测试常用工具JMeter也有深入的了解，尤其情有独钟于JMeter 5.3版本。
    """
    能力 = ["分析代码", "Controller层接口", "测试设计", "JMeter5.3脚本开发", "测试分析","数据库操作","JVM","redis"，"SpringBoot","Spring Cloud","微服务架构"，"接口测试"，"kafka","redis"]
    工作内容 = ["分析被测系统", "完成接口测试用例设计", "完成JMeter5.3测试脚本开发", "Review JMeter5.3测试脚本","修改JMeter5.3测试脚本","执行JMeter5.3测试脚本","分析JMeter5.3测试结果"]
def 分析Controller的API(用户输入):
    """
    读取被测系统的Controller层的API，获取API的请求参数和返回参数
    """
    jmx_list = []
    if 用户输入中有Controller层代码:
        while API=读取Controller层代码中一个没有被分析的API funtion代码:
            jms = developJMeter5_3脚本(API)
            if jms:
                jmx_list.append(jms)

    return jmx_list
def developJMeter5_3脚本(一个API的function代码):
    """
    根据Controller层的一个API的function代码，生成JMeter5.3脚本
    """
    根据 一个API的function代码，完成JMeter5.3的.jmx格式的脚本开发 并存入 JMeter5_3脚本
    if 生成失败：
        JMeter5_3脚本 = None
    return JMeter5_3脚本

if __name__ == "__main__":
    # 必须按照如下的运行规则来运行你的程序：
    # 1 设定system role 为“资深测试开发专家”
    资深测试开发专家()
    print("请输入你需要分析的Controller层的代码：")
    # 2 接收到用户的输入后
    分析Controller的API(用户输入)
    # 3 严格遵守函数的调关系
    # 4 输出 
    i=1
    while jmx_list:
        print("第",i,"个JMeter5.3脚本：")
        print(jmx_list.pop())
        i=i+1
```
提示词中我选了JMeter3.5格式的接口测试脚本，这个系统提示词也是从main函数开始，先进行了角色催眠，让大模型扮演一个资深的测试开发专家，然后分析被测系统的Cotroller代码，然后输出接口测试脚本。

这个系统提示词需要用户输入对应的代码段，在一些大模型的Chat应用中我们也很难将相关代码复制进聊天窗口，所以这个系统提示词比较推荐在IDE中使用，这样我们就可以很容易选中需要生成接口测试脚本的源代码，作为用户提示词和上面的系统提示词一起输入给大模型，让其生成接口测试脚本了。


我们都知道，一个测试用例是由三个要素组成的：输入参数、测试步骤和预期结果，用这个提示词完成了测试步骤的生成，但是输入参数、预期结果还需要人工补齐。那大模型能解决这遗留的两部分吗？

## RAG和接口测试的火花

要想补齐一个接口测试脚本的输入参数、预期结果，就需要了解被测系统的代码实现、数据库中的数据，这些都是一个系统的私域知识，那么我们自然而然地就想到了RAG，下面我就带你一起看看如何构建一个生成接口测试用例的系统。


![图片](https://static001.geekbang.org/resource/image/59/3d/59300579ccee5036346e23ff46bc333d.png?wh=1836x1032)整个接口测试的生成流程是这样的，首先用户输入需要系统完成的任务，也就是用户的Prompt，然后和被测试系统swagger的json文件一起发送给RAG系统，系统会通过大模型生成pytest测试脚本。


接下来，找出生成pytest脚本参数化部分的代码，通过大模型生成对应的Schame，然后系统会参考被测系统数据库，用这个接口测试参数的Schame，生成测试脚本的数据驱动，最后用新的数据驱动的脚本替换第二步生成脚本的对应部分，就完成了接口自动化测试脚本的生成了。

### 建立一个新的查询引擎完成Pytest生成

LlamaIndex的Node Parser是用于解析和处理语法节点的。Node Parser将文档列表分成Node对象，每一个Node 对象代表文档的不同Chunk，子节点继承了全部父文档的属性。


![图片](https://static001.geekbang.org/resource/image/ff/bf/ff00e0404e5773a26e5d847d9f5489bf.png?wh=1596x1034)

我利用JSon的NodeParser类JSONNodeParser完成Swagger JSon的解析，具体是怎么处理的呢？首先检查Swagger JSon格式的有效性，再创建一个查询引擎，然后按照用户的提示词要求返回pytest测试脚本。这部分的主要代码如下：

```perl
class Text2JSon:        
    def get_jsonfile(self,url: str, http_method="GET"):
          '''
          @des  :下载对应的json文件存储到本地文件中
          @params  :url swagger对应json的地址
                    http_method swagger的http访问方式
          '''
                   
          self.url = url
          self.headers = {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
              "content-Type": "application/json"
          }
          if http_method == "GET":
              response = requests.get(url=url, headers=self.headers)
          elif http_method == "POST":
              response = requests.post(url=url, headers=self.headers)
          else:
              raise Exception("http_method must be GET or POST")
          # self.response = response
          json_file = url.replace(":",".").replace("/","_")+'.json'
          with open(json_file, 'w') as f:
              f.write(response.text)
          return json_file
    def is_json_string(self,s):
        '''
        @des  :判断是不是json
        @params  : s 需要判断的字符串
        '''
        try:
            # 尝试解析JSON
            json.loads(s)
            return True
        except json.JSONDecodeError:
            # 如果解析失败，则返回False
            return False
    def query_engine(self,json_file:str):
        '''
        @des  : 查询引擎，传入json文件后生成接口测试代码
        @params  : json_file 需要传入的json文件（swagger模式）
        '''
        self.node_parser = JSONNodeParser()
        # text2json
       
        Settings.llm = OllamaLLM(
            model=model_id, reuse_client=True, base_url=OLLAMA_BASE_URL,)
       

        Settings.embed_model = OllamaEmbeddings(
            model=embed_model, reuse_client=True, base_url=OLLAMA_BASE_URL,)
        with open(json_file, 'r') as f:
            text=f.read()
            if self.is_json_string(text):
                document = Document(id_=json_file, text=text)
                parser = JSONNodeParser()
                nodes = parser.get_nodes_from_documents([document])
                index = VectorStoreIndex(nodes)
                # BM25（Best Matching 25）是一种用于信息检索（IR）的经典算法，用于评估文档与查询之间的相关性。
                retriever = BM25Retriever.from_defaults(
                    index=index,
                    similarity_top_k=1,
                )

                response_synthesizer = get_response_synthesizer(streaming=True)
                # assemble query engine
                # we can plug our retriever into a query engine to synthesize natural language responses.
                query_engine = RetrieverQueryEngine(
                    retriever=retriever,
                    response_synthesizer=response_synthesizer,
                )
                with open("prompt_template_pytest_api.txt", "r") as file:
                    PROMPT_TEMPLATE_STR = file.read()
                prompt_template = PromptTemplate(PROMPT_TEMPLATE_STR)
                      # text_qa_template 这指的是一个用于文本问答（Text Question Answering, 简称 QA）任务的模板
                query_engine.update_prompts(
                    {"response_synthesizer:text_qa_template": prompt_template}
                    )
            else:
                raise  Exception("response text is not json")

        return query_engine

```
如上代码是借助了LlamaIndex的RetrieverQueryEngine完成了这次简单的RAG过程，下面我就给你详细介绍一下这个神器RetrieverQueryEngine。它是个“查询引擎”，专门把用户的提问变成知识库的智能搜索，然后吐出靠谱的回答。简单说，它像个聪明的管家，能听懂你的问题，然后去仓库找东西，处理并整合之后，再讲给你。
* 检索就是去仓库里面找东西，用户问问题时，引擎不会在整个仓库里乱找。它用聪明算法在索引里挑出最匹配的“货”——比如前K个最相关的文档片段（top-k）。这靠的是比对问题和数据的“意思相似度”，不是死板的关键词匹配。

* 后处理，检索出来的内容不一定完美，引擎会再“洗牌”：比如按分数重排序、过滤掉不靠谱的，或根据关键词/元数据（像标签）调整。目的是让结果更准、更精炼。

* 整合讲给你，把用户问题和检索到的“好货”以及一个预设的“提示模板”扔给大语言模型。大模型就根据这些“发挥”，生成你需要的反馈。


可以看出，这部分还有一个提示词模板，我将其放到下面的代码段中，方便你查看。

```perl
#### is delimiter.
Your goal is write API test code to answer queries.
Your answer must be a Python markdown only.
Assert response code and the resopnse json's length.
The  get method requests had no param_list variable,other methond inlude param_list variable.
Test script parameters and parameter values into param_list variable.
param_list does not reference other variables.
param_list'lenght is 1.

####
Query: {query_str}

Completion:
```python
import requests
import pytest
# Let's proceed step by step.

```
### Text2SQL

有的时候，我们想从数据库里挖点数据，但SQL语法像天书，懒得学或者学不动。这时候Text2SQL就登场了！它其实是“**文本转SQL**”的技术，属于自然语言处理（NLP）家族的一员。简单说，就是你用日常聊天式的句子提问，比如“给我查查上个月销售额最高的商品”，Text2SQL就会自动帮你转换成标准的SQL语句，甚至直接跑出来结果给你看。


门槛超低——不用当SQL高手，就能轻松玩转数据库，超级友好！更酷的是，它不光能生成SQL，还能一步到位吐出数据答案，省去了我们手动执行的麻烦。是不是跃跃欲试啦？我们先得有个能操作的数据库当“沙盘”。下面我就用SQLite这个轻量级工具来演示，简单易上手，不会让你卡壳。我们先创建一个demo的数据库，创建表格的SQL如下所示：

```perl
CREATE TABLE `t2` (
  `id`  integer PRIMARY KEY autoincrement ,
  `testcase_name` varchar(80) NOT NULL,
  `create_user` varchar(80) DEFAULT NULL,
  `create_date` varchar(80) DEFAULT NULL
) ;
```
下面就需要**查询引擎**（Query Engine）登场了，它其实是Text2SQL里的“核心翻译机”，先在数据库上建个“向量地图”（就是把数据结构化成AI能懂的索引），然后专攻精准转换，把日常问题直接映射成SQL语句。就像是一个聪明的秘书，他会先读懂你的意图，再对号入座——从数据库的表格和字段里挑对的“零件”拼SQL，实现如下所示：
```perl
def query_engine(self,include_tables:list=None):
        '''
        @des  : 查询引擎
        @params  :include_tables需要传入的表名，如果说选择了QUERYTIME模式，那么只能传入一个表名
        '''
        ## text2sql
        # ## chatglm modle
        Settings.llm = OllamaLLM(model=model_id, reuse_client=True, base_url=OLLAMA_BASE_URL,)
       
        
        Settings.embed_model = OllamaEmbeddings(model=embed_model, reuse_client=True, base_url=OLLAMA_BASE_URL,)

        if self.type == QueryEngineType.DEFAULT:
        
            if include_tables is None:
                query_engine = NLSQLTableQueryEngine(
                    sql_database=self.sql_database
                )
            else:
                query_engine = NLSQLTableQueryEngine(
                    sql_database=self.sql_database, tables=include_tables
                )
        elif self.type == QueryEngineType.QUERYTIME:
            if include_tables is None:
                raise Exception("QueryTime need one table")
            elif len(include_tables) != 1:
                raise Exception("QueryTime need one table")
            table_node_mapping = SQLTableNodeMapping(self.sql_database)
            #############SQLTableSchema可以接受context_str参数，这个参数可以自定义一些schema，例如可以说吗，case代表case_name字段等内容
            table_schema_objs = [
                (SQLTableSchema(table_name=include_tables[0]))
            ] 
            obj_index = ObjectIndex.from_objects(
                table_schema_objs,
                table_node_mapping,
                VectorStoreIndex,
            )
            query_engine = SQLTableRetrieverQueryEngine(
                self.sql_database, obj_index.as_retriever(similarity_top_k=1)
            )
        elif self.type == QueryEngineType.RETRIVER:
            nl_sql_retriever = NLSQLRetriever(
            self.sql_database, tables=include_tables,return_raw=True
            )
            query_engine = RetrieverQueryEngine.from_args(nl_sql_retriever)
        else:
            raise Exception("Unkown QueryEngineType")
        return query_engine 
```
其中QueryEngineType有三种模式：
* **第一种是建立一个数据库相关的向量数据，进行查询。**侧重于直接转换和精确映射，它能够将用户的自然语言查询转换为SQL查询。Query Engine需要理解用户的查询意图，并将其映射到数据库模式中相应的表格和字段。这种方法可能包括自然语言处理（NLP）技术，如词法分析、句法分析和语义解析，以确保生成的SQL语句准确无误。Query Engine的目标是提供一个高效、准确的查询转换服务，用户可以直接与其交互，输入自然语言查询并得到SQL查询结果。

* **第二种强调查询时的动态表格选择。**这种方法强调在查询执行时才确定和检索需要使用的表格。这可能意味着系统在用户提出查询时，首先分析查询内容，然后动态地从数据库中检索和查询相关的表格。这种方法可能更加灵活，因为它允许系统根据实际的查询需求来选择数据源，而不是依赖于预定义的模式。这种方法可能对于用户不熟悉数据库结构或者查询需求不明确的情况特别有用。

* **第三种就是建立一个检索器（Retriever），然后进行查找。**Retriever方法可能指的是一种基于检索的系统，它通过搜索和匹配已有的SQL查询模板或模式来响应用户的自然语言查询。当用户提出查询时，系统会在库中寻找最接近的匹配项，并将其作为响应。Retriever方法的优点在于可以快速响应用户的查询，但它的准确性和适用性可能受限于templete的覆盖范围和质量。


这三种查询引擎类型各有各的优点，所以也并不能一概而论，需要根据具体的问题来选择。

![图片](https://static001.geekbang.org/resource/image/93/8e/93de8cc206ab7a09d988e83dbee95b8e.png?wh=1596x1034)
Text2SQL是怎么帮助到接口测试生成过程呢？这里我使用了数据生成，将代码中的数据驱动部分对应的schema信息和提示词模板整合到一起，形成一个新的prompt，然后将其输入到建立好的Text2SQL查询引擎，这里我选了第一种QueryEngineType返回测试数据。这里可以看出来，这部分还是需要一个提示词模板，这部分的提示词模板如下所示。

```perl
####is delimiter.
Your goal is designed the api test code's param to answer queries.
Your only generate data .
Your should follow  ingore the param_list's values.
Your answer must be a json markdown only，don't answer sql.
If you get the sql,given the results from the SQL queries.
Your can use the equivalence class partitioning designed  parameters.
####
Query: {query_str}
Completion:
```python
# Let's proceed step by step.
param_list=
```
### 整个实现流程

![图片](https://static001.geekbang.org/resource/image/18/c5/181c4771ba01f1d7ab64f72f533501c5.png?wh=1734x456)

这个例子我用Grido创建了一个Web的交互页面，通过demo可以用swagger的json文件生成pytest接口测试脚本，然后利用LlamaIndex的Codersplit类对代码进行chunk，这里我设置chunk_lines=40,chunk_lines_overloop=5，然后建立一个检索器找到了对应的数据驱动代码，解析里面的请求体，生成对应的schema。最后一步就是将生成的Schema交给Text2SQL的查询引擎，完成测试用例数据的生成和替换后，就得到了接口测试脚本。


## 总结


今天的内容就到这里了，它绝不仅仅是理论的停留点——相反，这套方法论特别适合大家动手实践一番。现在我们正站在自动化测试的十字路口：传统的接口测试往往依赖手动编写pytest脚本，耗时费力，还容易遗漏边缘场景。而现在，我们可以用RAG来为测试注入“血肉”——让AI从Swagger文档中自动生成结构化的测试骨架。


同时，Text2SQL的出现补齐测试的“灵魂”——通过智能查询数据库，动态替换测试数据，确保每一次运行都贴近真实业务逻辑。这个过程乍看层层嵌套、颇为复杂，但拆解开来，其实简单得像搭积木：只需三步，就能从Swagger的JSON文件起步，构建出一套半自动化的测试流水线。

1. 用Swagger的JSON文件生成pytest代码

2. 生成参数的schema

3. Text2SQL生成数据驱动

![图片](https://static001.geekbang.org/resource/image/97/63/9732eeaa56f3a0727951a102b6417e63.jpg?wh=3956x6404)
## 思考题

其实今天讲的内容有些是可以单独拿出来处理不同问题的，比如Text2SQL可以帮我们用自然语言操作数据库，coderspliter可以帮我们分析研发的代码等，我希望今天的内容能给你更多的启发，让你开始思考怎么把大模型应用到测试工作中，你还有怎样的思考和想法可以将大模型的一些实践方法应用在测试工作中吗？欢迎你分享到留言区，如果你觉得有所收获也欢迎你分享给需要的朋友，我们下节课再见！

