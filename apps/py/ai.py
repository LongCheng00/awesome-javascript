import os
import json
from typing import Any, Dict, List, Optional

try:
  from langchain_ollama import ollamaLLM as Ollama
except ImportError:
  from langchain_community.llms import Ollama
  
text = []
def getText(role,content):
  jsoncon = {}
  jsoncon['role'] = role
  jsoncon['content'] = content
  text.append(jsoncon)
  return text

def getLength(ext):
  length = 0
  for content in text:
    temp = content['content']
    leng = len(temp)
    length += leng
  return length

def checkLength(text):
  while(getLength(text) > 8000):
    del text[0]
  return text

if __name__ == '__main__':
  text.clear
  delimiter = '####'  
  ep_message =f"""{delimiter}等价类测试用例设计方法是把输入的参数域划分成若等价类,这些等价类包含了有效等价类和无效等价类，
                有效等价类是指对于程序的规格说明来说是合理的,有意义的输入数据构成的集合，利用有效等价类可检验程序是否实现了规格说明中所规定的功能。
                无效等价类是指对于程序的规格说明来说是不合理的,无意义的输入数据构成的集合，利用无效等价类可检验程序是否有效的避免了规格说明中所规定的功能以外的内容。
                然后从每个等价类中选取少数代表性数据作为测试用例，每一类的代表性数据在测试中的作用等价于这一类中的其他值。
                特别注意，一条测试用例可以覆盖多个有效等价类，一条测试用例只能覆盖一个无效等价类{delimiter}
                使用等价类测试用例设计方法需要经过如下几步：{delimiter}
                step1：{delimiter}对输入的参数进行等价类划分，在划分等价类的时候，应该遵从如下的一些原则：{delimiter}
                在输入条件规定了输入值的集合或者规定了必须满足的条件的情况下,可确立一个有效等价类和一个无效等价类。
                在输入条件是一个布尔量的情况下,可确定一个有效等价类和一个无效等价类。布尔量是一个二值枚举类型, 一个布尔量具有两种状态: true 和 false 。
                在规定了输入数据的一组值（假定n个）,并且程序要对每一个输入值分别处理的情况下,可确立n个有效等价类和一个无效等价类.例：输入条件说明输入字符为:中文、英文、阿拉伯文三种之一，则分别取这三种这三个值作为三个有效等价类，另外把三种字符之外的任何字符作为无效等价类。
                在规定了输入数据必须遵守的规则的情况下,可确立一个有效等价类（符合规则）和若干个无效等价类（从不同角度违反规则）。
                在确知已划分的等价类中各元素在程序处理中的方式不同的情况下,则应再将该等价类进一步的划分为更小的等价类{delimiter}
                step2：{delimiter}将等价类转化成测试用例，按照[输入条件][有效等价类][无效等价类] 建立等价类表,等价类表可以用markdown的方式给出，列出所有划分出的等价类，为每一个等价类规定一个唯一的编号。
                {delimiter}设计一个测试用例覆盖有效等价类的时候，需要这个测试用例使其尽可能多地覆盖尚未被覆盖地有效等价类,重复这一步。直到所有的有效等价类都被覆盖为止。
                {delimiter}设计一个新的测试用例,使其仅覆盖一个尚未被覆盖的无效等价类,重复这一步.直到所有的无效等价类都被覆盖为止，测试用例用markdown 的的表格形式输出。{delimiter}

                输出按照如下步骤输出：{delimiter}
                step1:{delimiter} <step 1 reasoning >
                step2:{delimiter} <step 2 reasoning >

                测试用例：{delimiter} <response to customer>

                """
  system_message = f"你是一名资深测试工程师，下面你会用等价类测试用例设计方法设计测试用例{ep_message}，{delimiter}，请根据下面的业务描述设计接口参数的入参：{delimiter}"
  user_message = f"""被测系统是地铁车票自助购票软件系统需求，系统只接收 5元或10元纸币，一次只能使用一张纸币，车票只有两种面值 5 元或者 10 元。其中：
                    若投入5元纸币，并选择购买5元面值票，完成后出票，提示购票成功。
                    若投入5元纸币，并选择购买10元面值票，提示金额不足，并退回5元纸币。
                    若投入10元纸币，并选择购买5元面值票，完成后出票，提示购票成功，并找零5元。
                    若投入10元纸币，并选择购买10元面值票，完成购买后出票，提示购买成功。
                    若输入纸币后在规定时间内不选择票种类的按钮，退回的纸币，提示错误。
                    若选择购票按钮后不投入纸币，提示错误."""
  question = checkLength(getText('user',system_message + user_message))
  llm = Ollama(
    mode='gpt-oss:120b-cloud',
    base_url ='http://localhost:11434',
    temperature=0.1,top_p=0.9,num_ctx=2048
  )
  response = llm.invoke(question)
  print(response)
  
  ##Torun