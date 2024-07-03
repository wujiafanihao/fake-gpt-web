import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入FontAwesome图标组件
import { faArrowUp, faPowerOff, faPaperclip } from '@fortawesome/free-solid-svg-icons'; // 导入FontAwesome图标
import UploadButton from './UploadButton'; // 导入上传按钮组件
import '../../styles/index.css'; // 引入全局样式表

// 定义组件 Props 的类型
interface Props {
  sendMessage: (message: { text: string; isFormatted: boolean, file?: File }) => void; // 发送消息的函数
  abortReply: () => void; // 放弃回复的函数
  isReplying: boolean; // 是否正在回复的标志
}

// 消息输入组件
const MessageInput: React.FC<Props> = ({ sendMessage, abortReply, isReplying }) => {
  const [inputValue, setInputValue] = useState(''); // 输入框的值
  const [isFormatted, setIsFormatted] = useState(false); // 是否格式化的标志
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 选中的文件
  const inputRef = useRef<HTMLTextAreaElement>(null); // 输入框的引用

  // 自适应文本框高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '10px'; // 先设置一个较小的高度
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // 然后根据内容重新设置高度
    }
  }, [inputValue]); // 监听 inputValue 的变化

  // 处理文件上传事件
  const onFileUpload = (file: File) => {
    setSelectedFile(file); // 更新选中的文件状态
  };

  // 处理输入框值变化事件
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value); // 更新输入框的值
    setIsFormatted(e.target.value.includes('\\n')); // 检查输入的消息是否包含格式化字符
  };

  // 处理提交事件
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止默认表单提交行为
    // 检查是否有文本内容
    if (inputValue.trim() !== '') {
      sendMessage({
        text: inputValue.trim(), // 去除文本前后的空格
        isFormatted,
      });
      setInputValue(''); // 清空输入框的值
      setIsFormatted(false); // 重置格式化标志
    }
  };

  // 处理键盘按下事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认换行行为
      handleSubmit(e); // 提交消息
    } else if (e.key === 'Enter' && e.shiftKey) {
      setInputValue(prevValue => prevValue + '\n'); // 在输入框中添加换行符
    }
  };

  // 处理放弃回复事件
  const handleAbort = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 阻止默认点击行为
    abortReply(); // 调用放弃回复的函数
  };

  // 渲染消息输入表单
  return (
    <form className="message-input" onSubmit={handleSubmit}>
      {/* 如果有选中的文件，则显示文件预览 */}
      {selectedFile && (
        <div className="file-preview">
          <FontAwesomeIcon icon={faPaperclip} /> {selectedFile.name} {/* 显示选中文件的名称 */}
          {/* 这里可以根据需要添加更多信息或操作，比如文件大小，删除预览等 */}
        </div>
      )}
      <UploadButton onFileUpload={onFileUpload} /> {/* 显示文件上传按钮 */}
      <textarea
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message Ollama..." // 输入框的占位文本
        ref={inputRef} // 设置输入框的引用
        disabled={isReplying} // 如果正在回复，则禁用输入框
      />
      {/* 如果正在回复，则显示放弃回复按钮，否则显示发送按钮 */}
      {isReplying ? (
        <button type="button" className="sent_button" onClick={handleAbort}>
          <FontAwesomeIcon icon={faPowerOff} /> {/* 显示放弃回复图标 */}
        </button>
      ) : (
        <button className="sent_button" type="submit">
          <FontAwesomeIcon icon={faArrowUp} /> {/* 显示发送图标 */}
        </button>
      )}
    </form>
  );
};

export default MessageInput; // 导出消息输入组件
