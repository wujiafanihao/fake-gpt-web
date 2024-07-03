import React from 'react';
import ThemeToggle from '../handle/ThemeToggle'; // Import the ThemeToggle component

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>WuOllama</h1>
      <ThemeToggle /> {/* Use the ThemeToggle component */}
    </header>
  );
};

export default Header;
