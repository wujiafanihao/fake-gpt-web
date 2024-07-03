// Register.tsx
import React, { useState } from 'react';
import ThemeToggle from '../handle/ThemeToggle';
import "../../styles/Auth.css"

interface RegisterProps {
  onRegister: () => void;
  onLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister,onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      // 发送注册请求到后端
      const response = await fetch('http://127.0.0.1:8088/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      // 解析响应
      const data = await response.json();

      // 注册成功
      if (response.ok) {
        onRegister();
      } else {
        // 处理注册失败
        setErrorMessage(data.detail);
        console.log('Registration failed. Response:', data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <ThemeToggle /> 
      </div>
      <h2>Create your account</h2>
      <input type="text" placeholder="Username (email)" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button className='login-box' onClick={handleRegister}>Continue</button>
      <div className="footer">
        Already have an account?
        <a href="#" onClick={onLogin}>Login</a>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Register;
