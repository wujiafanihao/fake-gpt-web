import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RiSunFill, RiMoonFill } from 'react-icons/ri'; // 导入日/夜模式图标

// 使用styled-components创建样式化按钮
const StyledButton = styled.button`
  cursor: pointer; // 设置鼠标样式为手型
  transition: background-color 0.3s ease; // 设置过渡效果，使背景色变化平滑
`;

// 使用styled-components创建样式化图标容器
const StyledIcon = styled.div`
  transition: color 0.3s ease; // 设置过渡效果，使图标颜色变化平滑
`;

// 创建主题切换组件
const ThemeToggle: React.FC = () => {
  // 定义状态来表示当前是否为暗黑模式
  const [darkMode, setDarkMode] = useState(false);

  // 组件加载时进行初始化
  useEffect(() => {
    const bodyClass = document.body.classList; // 获取body元素的classList
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); // 创建一个媒体查询来检查用户是否使用暗黑模式

    // 如果用户已经设置了暗黑模式，则将body元素添加dark-mode类，并更新状态
    if (darkModeMediaQuery.matches) {
      bodyClass.add('dark-mode');
      setDarkMode(true);
    } else {
      bodyClass.remove('dark-mode'); // 否则移除dark-mode类
    }

    // 定义媒体查询的变化事件处理函数
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches); // 更新状态为当前媒体查询的匹配结果
      if (e.matches) {
        bodyClass.add('dark-mode'); // 如果是暗黑模式，则添加dark-mode类
      } else {
        bodyClass.remove('dark-mode'); // 否则移除dark-mode类
      }
    };

    // 监听媒体查询的变化事件
    darkModeMediaQuery.addEventListener('change', handleChange);

    // 组件卸载时执行清理工作
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange); // 移除事件监听器
      bodyClass.remove('dark-mode'); // 移除dark-mode类
    };
  }, []);

  // 处理切换主题的函数
  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // 切换暗黑模式状态
    const bodyClass = document.body.classList; // 获取body元素的classList
    // 根据当前状态来添加或移除dark-mode类
    if (!darkMode) {
      bodyClass.add('dark-mode'); // 如果当前不是暗黑模式，则添加dark-mode类
    } else {
      bodyClass.remove('dark-mode'); // 如果当前是暗黑模式，则移除dark-mode类
    }
  };

  // 渲染主题切换按钮
  return (
    <StyledButton className="switch" onClick={toggleDarkMode}>
      <StyledIcon>
        {darkMode ? <RiSunFill /> : <RiMoonFill />} {/* 根据当前暗黑模式状态选择显示日/夜模式图标 */}
      </StyledIcon>
    </StyledButton>
  );
};

export default ThemeToggle; // 导出主题切换组件
