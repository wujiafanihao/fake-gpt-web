import { useState, useRef} from 'react';
import { ChatAPI } from '../utils/ChatAPI';
import { Message } from '../type/types';
import chatgpt from '../assets/gpt3.5.png';
import user from '../assets/user.png';
import useCodeHighlight from './useCodeHighlight';

// 创建 ChatAPI 实例
const chatAPI = new ChatAPI('http://127.0.0.1:8088/v1/chat/completions');

// 自定义 hook：用于管理聊天机器人的状态和交互
const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]); // 用于存储聊天消息的状态
  const [error, setError] = useState<string | null>(null); // 用于存储错误消息的状态
  const [isReplying, setIsReplying] = useState<boolean>(false); // 用于指示是否正在等待聊天机器人回复
  const abortController = useRef(new AbortController()); // useRef 用于管理 AbortController 实例

  useCodeHighlight([messages], true);

  // 发送消息的函数
  const sendMessage = async (message: { text: string; isFormatted: boolean }) => {
    abortController.current.abort(); // 如果存在未完成的请求，先取消它
    abortController.current = new AbortController(); // 创建新的 AbortController 实例

    const newMessage: Message = { // 创建新的消息对象，用于更新 UI
      role: 'you',
      content: message.text,
      isContinuing: false,
      avatar: user,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]); // 更新消息列表，显示用户发送的消息
    setError(null); // 清除可能存在的错误消息
    setIsReplying(true); // 设置状态为正在等待回复

    try {
      await chatAPI.sendMessage(message.text, handleChunk, abortController.current.signal); // 调用 ChatAPI 发送消息，并传递终止信号
      setMessages(prevMessages => {
        const lastMessage = { ...prevMessages[prevMessages.length - 1], isContinuing: false };
        return [...prevMessages.slice(0, -1), lastMessage];
      });
    } catch (error) {
      // 处理请求错误
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('用户取消了请求'); // 用户取消请求时的处理
      } else {
        console.error('发送消息时出错:', error); // 其他错误情况，记录错误信息
        setError(`发送消息时出错: ${String(error)}`); // 将错误信息设置为状态，以在 UI 中显示
      }
    } finally {
      setIsReplying(false); // 无论请求成功还是失败，都将 isReplying 设置为 false
    }
  };

  // 处理从服务器接收到的数据流的函数
  const handleChunk = (chunk: string) => {
    if (chunk.startsWith('data:')) {
      handleJSONChunk(chunk); // 如果是 JSON 格式的数据，调用 handleJSONChunk 处理
    } else {
      handleTextChunk(chunk); // 如果是文本格式的数据，调用 handleTextChunk 处理
    }
  };

  // 处理 JSON 格式的数据流
  const handleJSONChunk = (chunk: string) => {
    try {
      const data = JSON.parse(chunk.slice(5)); // 解析 JSON 数据
      if (data.content) {
        updateMessagesWithContent(data.content); // 更新消息列表，显示机器人的回复内容
      }
    } catch (error) {
      console.error('解析数据时出错:', error); // 处理解析错误
      setError(`解析数据时出错: ${error}`); // 设置错误消息状态
    }
  };

  // 处理文本格式的数据流
  const handleTextChunk = (chunk: string) => {
    updateMessagesWithContent(chunk); // 直接更新消息列表，显示机器人的回复内容
  };

  // 根据接收到的内容更新消息列表
  const updateMessagesWithContent = (content: string) => {
    setMessages(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage.role === 'bot' && lastMessage.isContinuing) {
        const updatedLastMessage = { ...lastMessage, content: lastMessage.content + content };
        return [...prevMessages.slice(0, -1), updatedLastMessage]; // 如果上一条消息是机器人的续句，将内容追加到上一条消息中
      } else {
        const newBotMessage: Message = {
          role: 'bot',
          content,
          isContinuing: true,
          avatar: chatgpt,
        };
        return [...prevMessages, newBotMessage]; // 如果上一条消息不是机器人的续句，将内容作为新的消息显示
      }
    });
  };

  // 取消当前正在进行的请求
  const abortReply = () => {
    abortController.current.abort(); // 调用 AbortController 实例的 abort 方法取消请求
  };

  // 返回状态和函数，供组件使用
  return { messages, sendMessage, error, isReplying, abortReply };
};

export default useChatBot; // 导出自定义 hook
