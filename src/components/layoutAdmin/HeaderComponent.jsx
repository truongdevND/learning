import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Badge, Input } from 'antd';
import { 
  MenuOutlined, 
  SearchOutlined, 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined, 
  QuestionCircleOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = ({ toggleSidebar }) => {
  const [searchVisible, setSearchVisible] = useState(false);

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Hồ sơ cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Cài đặt</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <Link to="/logout">Đăng xuất</Link>
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu className="w-64">
      <Menu.Item key="notification1">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>A</Avatar>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin đã phê duyệt bài viết của bạn</p>
            <p className="text-xs text-gray-500">2 phút trước</p>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="notification2">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Avatar size="small" style={{ backgroundColor: '#52c41a' }}>S</Avatar>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Bạn có một tin nhắn mới</p>
            <p className="text-xs text-gray-500">1 giờ trước</p>
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="viewAll">
        <Link to="/notifications" className="text-blue-600 text-center block">
          Xem tất cả thông báo
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header  style={{ backgroundColor: "#ffff" }} className="bg-white p-0 flex items-center justify-between shadow-md z-10">
      <div className="flex items-center">
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          onClick={toggleSidebar}
          className="ml-2 md:ml-6"
        />
        
        <div className="ml-4 md:ml-8">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">
              App Name
            </span>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center">
        {searchVisible ? (
          <Search
            placeholder="Tìm kiếm..."
            onSearch={value => console.log(value)}
            className="w-36 md:w-64"
            onBlur={() => setSearchVisible(false)}
            autoFocus
          />
        ) : (
          <Button 
            type="text" 
            icon={<SearchOutlined />} 
            onClick={() => setSearchVisible(true)}
            className="mr-2"
          />
        )}
        
        <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
          <Button type="text" className="mr-2 md:mr-4">
            <Badge count={2}>
              <BellOutlined style={{ fontSize: '20px' }} />
            </Badge>
          </Button>
        </Dropdown>
        
        <Button 
          type="text" 
          icon={<QuestionCircleOutlined />} 
          className="mr-2 md:mr-4"
        />
        
        <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
          <div className="flex items-center cursor-pointer mr-4 md:mr-8">
            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
            <span className="ml-2 hidden md:block">Nguyen Van A</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;