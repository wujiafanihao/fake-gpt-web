// ScrollHandle.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCodeHighlight from '../../hook/useCodeHighlight';

interface Props {
  chatWindowRef: React.RefObject<HTMLDivElement>;
  messages: { role: string; content: string }[];
}

const ScrollHandle: React.FC<Props> = ({ chatWindowRef, messages }) => {
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);

  useCodeHighlight([messages]); // 在 messages 变化时触发代码高亮
  
  // 使用useCallback包装handleScroll函数，该函数依赖于chatWindowRef.current
  const handleScroll = useCallback(() => {
    if (chatWindowRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = chatWindowRef.current;
      // 根据滚动位置决定是否显示“滚动到底部”的按钮
      setShowScrollToBottomButton(scrollTop + clientHeight < scrollHeight);
    }
  }, [chatWindowRef]); // handleScroll函数的依赖项数组

  // 滚动到底部的函数
  const scrollToBottom = useCallback(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      setShowScrollToBottomButton(false);
    }
  }, [chatWindowRef]);

  // 副作用 - 添加和移除滚动事件监听器
  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (chatWindow) {
      chatWindow.addEventListener('scroll', handleScroll);
    }

    // 清理函数，移除事件监听
    return () => {
      if (chatWindow) {
        chatWindow.removeEventListener('scroll', handleScroll);
      }
    };
  }, [chatWindowRef, handleScroll]); // 副作用的依赖项数组，确保对 handleScroll 的引用不会变

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages,scrollToBottom]); // 当消息变化时执行自动滚动到底部的逻辑

  return (
    <>
      {showScrollToBottomButton && (
        <div className="scroll-to-bottom" onClick={scrollToBottom}>
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
      )}
    </>
  );
};

export default ScrollHandle;