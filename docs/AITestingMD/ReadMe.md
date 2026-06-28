# AITesting 基础－进阶－实战

(Attention，提示词，评估模型，RAG 分块，MCPServer)

需求格式，RAG 实践;　RAG＋Text2SQL;　MCP 实战

PlaywrightMCPServer;　MCPServer;　5 种 Agentic 模式测试;RAG 应用;AI 赋能;实战复盘。

## 基础

### 基本概念

《论可计算数及其在判定问题中的应用》

机器学习（Machine Learning，简称ML）、深度学习（Deep Learning，简称DL），大语言模型（Large Language Model，简称LLM）

attention is all you need

FNN全称是Feedforward Neural Network，**前馈神经网络;** RNN全称是Recurrent Neural Network，**循环神经网络;** CNN全称Convolutional Neural Network，**卷积神经网络**。Attention也叫注意力机制。**Self-Attention是Transformer的核心**

- 英文: 1 token ≈ 0.75 单词 ≈ 4 字符
- 中文: 1 token ≈ 1-2 字符
- 混合: 1 token ≈ 2-3 字符

### 参数

超参数是指在模型训练或推理过程中需要手动设置、无法通过训练数据直接学习的配置参数。

temperature、top_k、top_p、min_p、惩罚函数（repeat_penalty、frequency_penalty、presence_penalty）、Mirostat、tfs_z、typical_p

提示词工程－RAG－微调模型－训练模型

零样本：直接问问题

少样本：角色催眠，举个例子，再问问题

思维链(CoT，Chain of Thought)：角色催眠，问题理解，步骤分解，再问问题

### 性能指标

大模型性能指标：精确度，召回率，F1Score
真 Ture　假 False　阳 Positive　阴 Negative
真阳性 TP　假阳性FP　真阴性TN　假阴性FN
精确度（Precision）= TP/(TP+FP)
召回率 (Recall) = TP/(TP+FN)
F1Score 精确度和召回率的调和平均数　＝2(精确度×召回率)/(精确度＋召回率)
文本生成指标：BLEU 分数：n－gram几何平均精度，简洁惩罚，Rouge 分数－评估模型生成文本与参考文本相似度指标－精确度？。
词序列(n-gram)，最长公共子序列(LCS)，词对匹配度－召回率
Rouge-N匹配数量，Rouge－L匹配序列

### RAG

RAG(Retrieval-Augmented Generation)，索引增强生成，通过一个外部增强的知识库来帮助我们加强输入内容，从而减少幻觉，使模型生成地更准确。

外部数据库存储检索，当前常用Embedding model（向量模型）和向量数据库。

Embedding模型是一种将高维数据（如文本、图像等）转换为低维连续向量表示（即嵌入向量）的机器学习模型。这些向量能够捕捉数据的语义或特征，使相似的对象在向量空间中距离较近。向量，相似度检索算法：余弦相似度或欧氏距离

Chunk，分片，避免内容丢失。Chunk 策略：固定大小，句子，段落，递归(分隔符表格)，滑动窗口，语义(相似度)，父子(级联，树形)，文档格式分割(Document-Specific Chunking)

性能评估指标：检索－召回率，精确率，F1Score?; 生成-忠实度
