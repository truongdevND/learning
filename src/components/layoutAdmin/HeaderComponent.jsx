import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { 
  AppstoreOutlined, 
  PoweroffOutlined, 
  UserSwitchOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useNotificationStore from '../../stores/useNotificationStore';

const { Header } = Layout;

const HeaderComponent = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const { showSuccess } = useNotificationStore();
  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user')) ;
    setUserData(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showSuccess('Đăng xuất thành công!');
    navigate('/login');
  };

  const profileMenu = (
    <Menu>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<PoweroffOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: 'linear-gradient(90deg, #4f8cff 0%, #3358e0 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: 0,
        height: 64,
        zIndex: 20
      }}
      className="flex items-center justify-between px-6"
    >
      <div className="flex items-center ml-[50px] gap-7">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">Admin LTE</span>
        </Link>
        <Button 
          type="text" 
          icon={<AppstoreOutlined style={{fontSize:22, color:'#fff'}} />} 
          onClick={toggleSidebar}
          className="ml-2 hover:bg-blue-100/30"
          style={{borderRadius:8}}
        />
      </div>
      <div className="flex items-center mr-8">
        <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
          <div className="flex items-center cursor-pointer gap-2 hover:bg-blue-100/30 px-3 py-1 rounded-lg transition-all">
            <Avatar style={{ background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)', color: '#fff', fontWeight:600 }} size={40} icon={<UserSwitchOutlined />} />
            <span className="hidden md:block">
              <div className="text-xs text-white font-semibold text-right">{userData?.role || 'Admin'}</div>
            </span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;