import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../styles/SettingModal.css';

interface SettingModalProps {
  onClose: () => void;
  initialName: string;
  onUpdateName: (newName: string) => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ onClose, initialName, onUpdateName }) => {
  const [newName, setNewName] = useState<string>(initialName);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleSave = () => {
    onUpdateName(newName);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          {/* 设置名称输入框 */}
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={newName} onChange={handleChangeName} />
          </div>
          {/* 保存和关闭按钮 */}
          <div className="button-group">
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;