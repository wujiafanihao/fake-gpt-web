import { useEffect, useState } from 'react';
import useCodeHighlight from './useCodeHighlight'; // 导入 useCodeHighlight 钩子

/**
 * 自定义 Hook：用于复制文本到剪贴板，并提供复制成功状态和代码高亮
 */
const useClipboard = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  useCodeHighlight([copySuccess]); // 在 copySuccess 变化时触发代码高亮

  useEffect(() => {
    // 当 copySuccess 变为 true 时，设置一个定时器在 350ms 后将 copySuccess 状态置为 false
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 350);

      // 返回清除定时器的函数，以确保组件卸载时清除定时器
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  // 复制文本到剪贴板
  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopySuccess(true); // 复制成功时设置 copySuccess 状态为 true
      })
      .catch((err) => {
        console.error('无法复制文本: ', err);
        setCopySuccess(false); // 复制失败时设置 copySuccess 状态为 false
      });
  };

  // 返回复制文本到剪贴板的函数和复制成功状态
  return { copyToClipboard, copySuccess };
};

export default useClipboard;
