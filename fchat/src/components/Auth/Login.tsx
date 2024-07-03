// Login.tsx
import React, { useState } from 'react';
import ThemeToggle from '../handle/ThemeToggle';
import "../../styles/Auth.css"

interface LoginProps {
  onLogin: () => void;
  onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // 发送登录请求到后端（以JSON格式）
      const response = await fetch('http://127.0.0.1:8088/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      // 解析响应
      const data = await response.json();
  
      // 登录成功
      if (response.ok) {
        onLogin();
      } else {
        // 处理登录失败
        setErrorMessage(data.detail);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className='container'>
      <div className='header'>
      <ThemeToggle /> 
      </div>
      <h2>Welcome back</h2>
      <input type="text" placeholder="Email address" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className='login-box' onClick={handleLogin}>Continue</button>
      <div className="footer">
        Don't have an account?
        <a href="#" onClick={onRegisterClick}>Sign up</a>
      </div>   
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
