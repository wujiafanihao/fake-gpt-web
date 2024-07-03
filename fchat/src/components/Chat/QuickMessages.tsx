import React, { useState } from "react";

// 定义QuickMessages组件的属性类型
interface QuickMessagesProps {
  onClick: (message: string) => void; // 点击消息时的回调函数
}

// QuickMessages组件
const QuickMessages: React.FC<QuickMessagesProps> = ({ onClick }) => {
  // 状态钩子，用于跟踪悬停的消息索引
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 处理消息点击事件
  const handleClick = (message: string) => {
    onClick(message); // 调用传入的点击回调函数
  };

  return (
    <div className="quick-messages" style={styles.quickMessages}>
      {/* 四个快速消息 */}
      <div
        className="quick-message"
        style={{ ...styles.quickMessage, ...(hoveredIndex === 0 ? styles.quickMessageHover : {}) }} // 根据索引应用悬停样式
        onMouseEnter={() => setHoveredIndex(0)} // 鼠标进入时设置悬停索引为当前索引
        onMouseLeave={() => setHoveredIndex(null)} // 鼠标离开时清除悬停索引
        onClick={() => handleClick("What is langchian？")} // 点击消息时调用handleClick
      >
        What is langchian？
      </div>
      <div
        className="quick-message"
        style={{ ...styles.quickMessage, ...(hoveredIndex === 1 ? styles.quickMessageHover : {}) }}
        onMouseEnter={() => setHoveredIndex(1)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => handleClick("What is Ai？")}
      >
        What is Ai？
      </div>
      <div
        className="quick-message"
        style={{ ...styles.quickMessage, ...(hoveredIndex === 2 ? styles.quickMessageHover : {}) }}
        onMouseEnter={() => setHoveredIndex(2)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => handleClick("Hi！")}
      >
        Hi！
      </div>
      <div
        className="quick-message"
        style={{ ...styles.quickMessage, ...(hoveredIndex === 3 ? styles.quickMessageHover : {}) }}
        onMouseEnter={() => setHoveredIndex(3)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => handleClick("tell me What is transformer？")}
      >
        tell me What is transformer？
      </div> 
    </div>
  );
};

export default QuickMessages;

// 样式对象
const styles: { [key: string]: React.CSSProperties } = {
  quickMessages: {
    display: "grid", // 使用网格布局
    gridTemplateColumns: "repeat(2, 1fr)", // 两列布局
    gap: "10px", // 设置行间距
    marginTop: "50px", // 顶部外边距
  },
  quickMessage: {
    backgroundColor: "var(--background-color)", // 使用 CSS 变量定义背景颜色
    padding: "10px", // 内边距
    borderRadius: "5px", // 边框圆角
    fontSize: "16px", // 字体大小
    cursor: "pointer", // 鼠标指针样式为手型
    color: "var(--text-color)", // 使用 CSS 变量定义字体颜色
    border: "#adaaaa 1px solid", // 添加边框样式
    transition: "border-color 0.3s, background-color 0.3s", // 添加边框和背景颜色的过渡动画
  },
  quickMessageHover: {
    backgroundColor: "#b7b9bb", // 鼠标悬停时的背景颜色
  },
};
