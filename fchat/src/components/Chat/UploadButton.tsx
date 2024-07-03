import React, { useRef, ChangeEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faFilePdf, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/index.css";
import ClipLoader from 'react-spinners/ClipLoader';

// 定义上传按钮组件的属性类型
interface UploadButtonProps {
  onFileUpload: (file: File) => void; // 文件上传回调函数
}

// 根据文件名获取文件图标
const getFileIcon = (fileName: string) => {
  if (fileName.toLowerCase().endsWith(".pdf")) {
    return faFilePdf; // 如果是PDF文件，返回PDF图标
  }
  return faPaperclip; // 否则返回普通附件图标
};

// 上传按钮组件
const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null); // 文件输入框的引用
  const [uploadProgress, setUploadProgress] = useState(0); // 上传进度状态
  const [filePreview, setFilePreview] = useState<{
    name: string;
    icon: any;
  } | null>(null); // 文件预览状态
  const [isUploading, setIsUploading] = useState(false); // 是否正在上传状态
  const uploadXHR = useRef<XMLHttpRequest | null>(null); // 上传的 XMLHttpRequest 对象引用

  // 处理文件改变事件
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      // 设置文件预览信息
      setFilePreview({
        name: selectedFile.name,
        icon: getFileIcon(selectedFile.name),
      });
      // 上传文件
      uploadFile(selectedFile);
    }
  };

  // 上传文件
  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // 将文件添加到 FormData 中
  
    const xhr = new XMLHttpRequest(); // 创建 XMLHttpRequest 对象
    uploadXHR.current = xhr; // 保存引用
    setIsUploading(true); // 设置正在上传状态为 true
  
    xhr.open("POST", "http://127.0.0.1:8088/upload", true); // 打开 POST 请求
  
    // 监听上传进度事件
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress); // 更新上传进度
      }
    };
  
    // 监听上传完成事件
    xhr.onload = () => {
      if (xhr.status === 200) {
        // 如果上传成功
        setUploadProgress(0); // 重置上传进度
        setFilePreview(null); // 清空文件预览
        setIsUploading(false); // 设置上传状态为 false
        uploadXHR.current = null; // 清空 XMLHttpRequest 引用
        
        // 文件上传成功后调用 onFileUpload 回调函数
        onFileUpload(file);
      } else {
        // 如果上传失败
        console.error("文件上传失败");
        setIsUploading(false); // 设置上传状态为 false
        uploadXHR.current = null; // 清空 XMLHttpRequest 引用
      }
    };
  
    // 发送 FormData
    xhr.send(formData);
  };

  // 取消上传
  const cancelUpload = () => {
    if (uploadXHR.current && isUploading) {
      uploadXHR.current.abort(); // 中止上传
      setIsUploading(false); // 设置上传状态为 false
      setUploadProgress(0); // 重置上传进度
      setFilePreview(null); // 清空文件预览
      uploadXHR.current = null; // 清空 XMLHttpRequest 引用
    }
  };

  return (
    <>
      {/* 如果有文件预览，则显示文件预览 */}
      {filePreview && (
        <div className="file-preview">
          <FontAwesomeIcon
            icon={filePreview.icon}
            className="file-preview-icon"
          />{" "}
          {filePreview.name} {/* 显示文件名 */}
          {/* 如果正在上传，则显示上传加载器 */}
          {isUploading && (
            <ClipLoader
              color="#36d7b7"
              loading={isUploading}
              size={24}
            />
          )}
          <button onClick={cancelUpload} className="cancel-upload-button">
            <FontAwesomeIcon icon={faTimes} /> {/* 取消上传按钮 */}
          </button>
        </div>
      )}
      {/* 文件上传按钮 */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="upload-button"
      >
        <FontAwesomeIcon icon={faPaperclip} /> {/* 上传图标 */}
      </button>
      {/* 文件输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }} // 隐藏输入框
        onChange={handleFileChange} // 处理文件改变事件
      />
    </>
  );
};

export default UploadButton;
