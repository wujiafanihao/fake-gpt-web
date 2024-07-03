import React, { useState, useEffect } from 'react';
import ChatApp from './components/Chat/ChatApp'; // 导入聊天应用组件
import { BrowserRouter as Router } from 'react-router-dom'; // 导入路由相关组件
import Login from './components/Auth/Login'; // 导入登录组件
import Register from './components/Auth/Register'; // 导入注册组件
import './App.css';

// 定义页面枚举，用于表示不同的页面状态
enum Page {
  LOADING, // 加载页面
  LOGIN, // 登录页面
  REGISTER, // 注册页面
  CHAT // 聊天页面
}

function App() {
  const [page, setPage] = useState<Page>(Page.LOADING); // 使用useState定义页面状态，默认为加载页面

  // 组件加载时，检查localStorage中是否存储了当前页面状态
  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setPage(parseInt(savedPage)); // 设置当前页面为localStorage中存储的页面状态
    } else {
      setPage(Page.LOGIN); // 如果没有存储过页面状态，默认为登录页面
    }
  }, []);

  // 处理用户登录事件
  const handleLogin = () => {
    setPage(Page.LOADING); // 设置当前页面为加载页面
    setTimeout(() => {
      setPage(Page.CHAT); // 设置当前页面为聊天页面
      localStorage.setItem('currentPage', Page.CHAT.toString()); // 将当前页面状态存储到localStorage中
    }, 2000); // 延迟2秒钟
  };

  // 处理用户注册事件
  const handleRegister = () => {
    setPage(Page.LOADING); // 设置当前页面为加载页面
    setTimeout(() => {
      setPage(Page.REGISTER); // 设置当前页面为注册页面
      localStorage.setItem('currentPage', Page.REGISTER.toString()); // 将当前页面状态存储到localStorage中
    }, 2000); // 延迟2秒钟
  };

  // 处理用户注册成功事件
  const handleRegisterSuccess = () => {
    setPage(Page.LOADING); // 设置当前页面为加载页面
    setTimeout(() => {
      setPage(Page.LOGIN); // 设置当前页面为登录页面
      localStorage.setItem('currentPage', Page.LOGIN.toString()); // 将当前页面状态存储到localStorage中
    }, 2000); // 延迟2秒钟
  };

  // 处理用户注销事件
  const handleChatApp = () => {
    setPage(Page.LOADING); // 设置当前页面为加载页面
    setTimeout(() => {
      setPage(Page.LOGIN); // 设置当前页面为登录页面
      localStorage.setItem('currentPage', Page.LOGIN.toString()); // 将当前页面状态存储到localStorage中
    }, 2000); // 延迟2秒钟
  };

  // 渲染页面
  return (
    <div className="App">
      <Router>
        {/* 根据当前页面状态显示不同的组件 */}
        {page === Page.LOADING && <div className='loading-container'>Loading...</div>} {/* 加载页面 */}
        {page === Page.LOGIN && <Login onLogin={handleLogin} onRegisterClick={handleRegister} />} {/* 登录页面 */}
        {page === Page.REGISTER && <Register onRegister={handleRegisterSuccess} onLogin={handleRegisterSuccess} />} {/* 注册页面 */}
        {page === Page.CHAT && <ChatApp onLogout={handleChatApp} />} {/* 聊天页面 */}
      </Router>
    </div>
  );
}

export default App;
