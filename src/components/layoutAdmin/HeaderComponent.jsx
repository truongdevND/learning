import React from 'react';
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


const HeaderComponent = ({ toggleSidebar }) => {

  const profileMenu = (
    <Menu>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <Link to="/logout">Đăng xuất</Link>
      </Menu.Item>
    </Menu>
  );

  

  return (
    <Header  style={{ backgroundColor: "#ffff" }} className="bg-white p-0 flex items-center justify-between shadow-md z-10">
      <div className="flex items-center">
       
        <div className="mr-[50px]">
          <Link to="/" className="flex items-center">
           
            <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">
          Admin LTE 
            </span>
          </Link>
        </div>
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          onClick={toggleSidebar}
          className="ml-2 md:ml-6"
        />
        
      </div>
      
      <div className="flex items-center">
     
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