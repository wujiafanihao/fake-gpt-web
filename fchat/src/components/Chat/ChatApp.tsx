import React, { ReactNode, useState } from 'react';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import '../../styles/index.css';
import Header from './Header';
import useChatBot from '../../hook/useChatBot';
import defaultAvatar from '../../assets/user2.png';
import Sidebar from './Sidebar';
import SettingModal from './SettingModal'; // 导入设置模态框组件

interface Props {
  children?: ReactNode;
  onLogout: () => void;
}

const ChatApp: React.FC<Props> = ({ children, onLogout }) => {
  const { messages, sendMessage, isReplying, abortReply } = useChatBot();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string>(defaultAvatar);
  const [userName, setUserName] = useState<string>('Azyasaxi');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSettingsPageOpen, setIsSettingsPageOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessageToChatWindow = (message: { role: string; content: string }) => {
    const formattedMessage = { text: message.content, isFormatted: false, avatar: userAvatar };
    sendMessage(formattedMessage);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleSettingsPage = () => {
    setIsSettingsPageOpen(!isSettingsPageOpen);
  };

  const handleLogout = () => {
    console.log('正在注销...');
    setUserAvatar(defaultAvatar);
    setUserName('Azyasaxi');
    onLogout();
  };

  const handleUpdateName = (newName: string) => {
    setUserName(newName);
  };

  return (
    <div className="chat-app">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        userAvatar={userAvatar}
        userName={userName}
        toggleSidebar={toggleSidebar}
        toggleSettingsMenu={toggleSettingsMenu}
        handleLogout={handleLogout}
        isSettingsOpen={isSettingsOpen}
        handleUpdateName={handleUpdateName}
      />
      <div className={`content ${isSidebarOpen ? '' : 'content-closed'}`}>
        <div className="heading">
          <Header />
        </div>
        {children}
        <ChatWindow messages={messages} sendMessage={sendMessageToChatWindow} userAvatar={userAvatar} userName={userName} />
        <MessageInput sendMessage={sendMessage} isReplying={isReplying} abortReply={abortReply} />
      </div>
      <div className="input-text">Ollama can make mistakes. Consider checking important information.</div>
      {isSettingsPageOpen && (
        <SettingModal
        onClose={toggleSettingsPage}
        initialName={userName}
        onUpdateName={handleUpdateName}
        />
      )}
    </div>
  );
};

export default ChatApp;