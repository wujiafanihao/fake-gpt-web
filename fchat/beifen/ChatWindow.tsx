import React, {useRef, useState } from "react"; 
import "../../styles/index.css"; // 导入样式文件
import userAvatar from "../../assets/user.png"; // 导入用户头像
import chatgptAvatar from "../../assets/gpt3.5.png"; // 导入ChatGPT头像
import useClipboard from "../../hook/useClipboard";
import useCodeHighlight from "../../hook/useCodeHighlight";
import { faArrowDown,faCopy,faCheck } from '@fortawesome/free-solid-svg-icons'; // 导入向下箭头图标
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入Font Awesome图标组件
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface Props {
  messages: { role: string; content: string }[];
}

const ChatWindow: React.FC<Props> = ({ messages }) => { // 定义 ChatWindow 组件
  const chatWindowRef = useRef<HTMLDivElement>(null); // 创建聊天窗口的引用
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false); // 定义显示滚动到底部按钮的状态
  // const [copySuccess, setCopySuccess] = useState(false);
  const { copyToClipboard, copySuccess } = useClipboard();
  useCodeHighlight([messages], true); // 在 messages 变化时同步执行代码高亮

  // // 当消息发生变化时，滚动到聊天窗口底部
  // useEffect(() => {
  //   if (chatWindowRef.current) { // 如果聊天窗口引用存在
  //     chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight; // 将滚动条滚动到最底部
  //   }
  // }, [messages]); // 依赖于 messages 数组的变化
      
  // // useEffect代码块用于当组件每次渲染后应用代码高亮
  // useEffect(() => {
  //   Prism.highlightAll();
  // });

  // useLayoutEffect(() => {
  //   if (chatWindowRef.current) {
  //     chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  //     Prism.highlightAll();  // 使代码高亮变为同步执行
  //   }
  // }, [messages]);

  // 处理滚动事件
  const handleScroll = () => {
    if (chatWindowRef.current) { // 如果聊天窗口引用存在
      const { scrollTop, clientHeight, scrollHeight } = chatWindowRef.current; // 获取滚动相关属性
      setShowScrollToBottomButton(scrollTop + clientHeight < scrollHeight); // 判断是否显示滚动到底部按钮
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (chatWindowRef.current) { // 如果聊天窗口引用存在
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight; // 将滚动条滚动到最底部
      setShowScrollToBottomButton(false); // 隐藏滚动到底部按钮
    }
  };

  // const copyToClipboard = (content: string) => {
  //   // 使用navigator.clipboard.writeText异步地将内容复制到剪贴板
  //   navigator.clipboard.writeText(content).then(() => {
  //     // 成功复制后，更新状态以显示复制成功的反馈信息
  //     setCopySuccess(true);
  //     // 设定一个350毫秒后的定时器
  //     setTimeout(() => {
  //       // 定时器触发时，将复制成功的状态设置为false，同时重新高亮所有代码
  //       setCopySuccess(false);
  //       Prism.highlightAll();
  //     }, 350);
  //   }).catch((err) => {
  //     // 如果复制过程出现错误，打印错误并更新状态以显示复制失败的反馈信息
  //     console.error('无法复制文本: ', err);
  //     setCopySuccess(false);
  //   });
  // };
  
  return (
    <div className="chat-window" ref={chatWindowRef} onScroll={handleScroll}>
      {messages.map((message, index) => ( // 遍历消息数组，渲染每一条消息
        <div key={index} className={`message ${message.role}`}> {/* 根据消息的角色添加不同的类 */}
          {/* 根据角色显示不同的头像和发送者名称 */}
          <div className="message-content">
            <div className="avatar-wrapper">
              <img
                src={message.role === "you" ? userAvatar : chatgptAvatar} // 根据角色选择显示用户头像或ChatGPT头像
                alt="Avatar"
                className="avatar"
              />
              <p className="sender-name">{message.role === "you" ? "You" : "ChatGPT"}</p> {/* 根据角色显示发送者名称 */}
            </div>
            <p className="message-text">
            <React.Fragment>
            <ReactMarkdown
              className="message_bot"
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  // 显示复制按钮或复制成功的图标
                  const copyIcon = copySuccess ? faCheck : faCopy;
                  return match ? (
                    <div style={{ position: 'relative' }}>
                      <button
                        className="copy-button"
                        onClick={() => copyToClipboard(String(children))}
                        disabled={copySuccess}
                      >
                        <FontAwesomeIcon icon={copyIcon} />
                      </button>
                    <pre className={`language-${match[1]}`}>
                      
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </React.Fragment>  
            </p>
          </div>
        </div>
      ))}
      {/* 显示滚动到底部按钮 */}
      {showScrollToBottomButton && (
        <div className="scroll-to-bottom" onClick={scrollToBottom}>
          <FontAwesomeIcon icon={faArrowDown} /> {/* 使用 Font Awesome 图标 */}
        </div>
      )}
    </div>
  );
};

export default ChatWindow; // 导出 ChatWindow 组件
