import React,{useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import SettingModal from './SettingModal';

interface SidebarProps {
  isSidebarOpen: boolean; // 侧边栏是否打开的状态
  userAvatar: string; // 用户头像路径
  userName: string; // 用户名
  toggleSidebar: () => void; // 切换侧边栏显示状态的函数
  toggleSettingsMenu: () => void; // 切换设置菜单显示状态的函数
  handleLogout: () => void; // 处理注销登录的函数
  isSettingsOpen: boolean; // 设置菜单是否打开的状态
  handleUpdateName: (newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    userAvatar,
    userName, 
    toggleSidebar,
    toggleSettingsMenu,
    handleLogout,
    isSettingsOpen,
    handleUpdateName,
}) => {
  const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false);
  // 切换设置页面显示状态的函数
  const toggleSettingsPage = () => {
    toggleSettingsMenu();
    setIsSettingModalOpen(!isSettingModalOpen); // 切换模态框显示状态
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
      {/* 侧边栏切换按钮 */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
      </button>
      <div className='sidebar_heade'>
        {/* 新聊天按钮 */}
        <button className='new-chat'>
          <p className='new_chat'>new chat</p>
        </button>
        <div className="user-info">
          {/* 用户信息 */}
          <button className="user-avatar-button" onClick={toggleSettingsMenu}>
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />
            <p className="user-name">{userName ? userName : userName }</p>
          </button>
          {/* 设置菜单 */}
          {isSettingsOpen && (
            <div className="settings-menu">
              {/* 注销按钮 */}
              <button className="settings-item" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> 
                <p className='setting-name'>Logout</p>
              </button>
              {/* 设置按钮 */}
              <button className="settings-item" onClick={toggleSettingsPage}>
                <FontAwesomeIcon icon={faCog} /> 
                <p className='setting-name'>Settings</p>
              </button>
            </div>
          )}
        </div>
      </div>
      {isSettingModalOpen && <SettingModal 
      onClose={toggleSettingsPage}
      initialName={userName}
      onUpdateName={handleUpdateName}
       />}
    </div>
  );
};

export default Sidebar;
