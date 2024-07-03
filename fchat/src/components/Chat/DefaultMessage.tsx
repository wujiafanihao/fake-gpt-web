import React, { useState } from "react";
import defaultChat from "../../assets/ollama.png";
import QuickMessages from "./QuickMessages";

interface Props {
  sendMessage: (message: { role: string; content: string }) => void; // 定义 sendMessage 函数的类型
}

const DefaultMessage: React.FC<Props> = ({ sendMessage }) => {
  const [showQuickMessages] = useState(true); // 使用 useState 来管理是否显示快速消息

  // 处理点击快速消息的函数
  const handleQuickMessageClick = (message: string) => {
    // 调用发送消息的函数，并传递消息内容和用户标识
    sendMessage({ role: "you", content: message });
  };

  return (
    <div className="default-message"> {/* 默认消息容器 */}
      <img src={defaultChat} alt="ChatGPT Avatar" className="deavatar" /> {/* 聊天头像 */}
      <p className="default-text">How can I help you today?</p> {/* 默认消息文本 */}
      {/* 如果 showQuickMessages 为 true，则显示快速消息 */}
      {showQuickMessages && <QuickMessages onClick={handleQuickMessageClick} />}
    </div>
  );
};

export default DefaultMessage; // 导出 DefaultMessage 组件
