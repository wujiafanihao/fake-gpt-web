// ChatWindow.tsx
import React, { useRef, useState, useEffect } from "react";
import "../../styles/index.css"; // 导入样式文件
import chatgptAvatar from "../../assets/ollama.png"; // 导入ChatGPT头像
import useClipboard from "../../hook/useClipboard";
import useCodeHighlight from "../../hook/useCodeHighlight";
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons'; // 导入向下箭头图标
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入Font Awesome图标组件
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ScrollHandle from "../handle/ScrollHandle";
import DefaultMessage from "./DefaultMessage"; // 导入 DefaultMessage 组件

interface Props {
  messages: { role: string; content: string }[];
  sendMessage: (message: { role: string; content: string }) => void;
  userAvatar: string;
  userName: string;
}

const ChatWindow: React.FC<Props> = ({ messages, sendMessage, userAvatar, userName }) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const { copyToClipboard, copySuccess } = useClipboard();
  useCodeHighlight([messages], true);
  const [showCursor, setShowCursor] = useState<boolean>(false);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'you') {
      setShowCursor(false);
      return;
    }

    const intervalId = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(intervalId);
  }, [messages]);

  const showDefaultMessage = messages.length === 0;

  return (
    <div className="chat-window" ref={chatWindowRef}>
      {showDefaultMessage && <DefaultMessage sendMessage={sendMessage} />}
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          <div className="message-content">
            <div className="avatar-wrapper">
              <img
                src={message.role === "you" ? userAvatar : chatgptAvatar}
                alt="Avatar"
                className="avatar"
              />
              <p className="sender-name">{message.role === "you" ? userName : "Ollama"}</p>
            </div>
            <div className="message-text">
              <React.Fragment>
                <ReactMarkdown
                  className="message_bot"
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
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
            </div>
          </div>
        </div>
      ))}
      {messages.length > 0 && messages[messages.length - 1].role === 'you' && showCursor && (
        <div className="cursor-animation">
          <span className="cursor">_</span>
        </div>
      )}
      <ScrollHandle chatWindowRef={chatWindowRef} messages={messages} />
    </div>
  );
};

export default ChatWindow;
