import asyncio
import os
from wait_done import wait_done
from typing import AsyncIterable
from dotenv import load_dotenv
from langchain.callbacks import AsyncIteratorCallbackHandler
# from langchain.chat_models import ChatOpenAI
# 从 langchain_community 中导入 ChatOpenAI
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import HumanMessage,AIMessage,SystemMessage

# 加载环境变量
load_dotenv()
temperature = float(os.environ.get("TEMPERATURE"))
max_tokens = int(os.environ.get("MAX_TOKENS"))
# OPENAI_MODEL = os.getenv("OPENAI_MODEL")
# 定义一个异步函数，用于调用OpenAI模型并返回生成的文本
async def call_openai(question: str) -> AsyncIterable[str]:
    # 创建回调处理器
    callback = AsyncIteratorCallbackHandler()
    try:
        # 初始化ChatOpenAI模型，并设置为流模式和详细输出
        llm = ChatOpenAI(
            streaming=True, 
            verbose=True,
            callbacks=[callback],
            temperature=temperature,
            max_tokens=max_tokens)

        print([HumanMessage(content=question)])
        # 创建等待任务，调用模型生成响应
        coroutine = wait_done(llm.agenerate(messages=[[
            SystemMessage(content="小红书的写作风格是一个很吸引人的标题，每段文字都加了emoji，并且在最后加上一些与内容相关的标签。请你扮演一位从事AI相关事业的科研工作者，以稳重的语气书写。"), 
            HumanMessage(content=question)]]), callback.done)
        task = asyncio.create_task(coroutine)

        # 收集生成的所有文本片段
        generated_texts = []

        # 异步迭代处理每个生成的文本片段
        async for token in callback.aiter():
            generated_texts.append(token)
            # print(f"Received token: {token}")  # 在控制台打印生成的文本片段
            yield f"{token}"  # 返回生成的文本片段

        # 等待任务完成
        await task
        # 将所有文本片段连接成一个字符串
        content = ''.join(generated_texts)
        print([AIMessage(content=content)])
    except Exception as e:  # 捕获所有可能的异常
        error_message = str(e)
        yield f"出错了，请联系管理人员{error_message}"
        