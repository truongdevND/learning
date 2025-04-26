import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { 
  HomeOutlined, 
  AppstoreOutlined, 
  TeamOutlined, 
  FileOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  MessageOutlined,
  ShoppingOutlined,
  MailOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';


const { Sider } = Layout;
const { SubMenu } = Menu;

const SidebarComponent = ({ collapsed, }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(['dashboard']);
  
  useEffect(() => {
    const pathname = location.pathname;
    const keyParts = pathname.split('/');
    const key = keyParts[1] || 'dashboard';
    setSelectedKeys([key]);
  }, [location]);

  return (
    <Sider 
      trigger={null}
      collapsible 
      collapsed={collapsed}
      width={256}
      className="overflow-auto h-screen fixed left-0 top-0 z-10  shadow-md"
      theme="light"
    >
      <div className="pt-4">
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={['sub1']}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/dashboard">Bảng điều khiển</Link>
          </Menu.Item>
          
          <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Ứng dụng">
            <Menu.Item key="calendar" icon={<CalendarOutlined />}>
              <Link to="/calendar">Lịch</Link>
            </Menu.Item>
            <Menu.Item key="email" icon={<MailOutlined />}>
              <Link to="/email">Email</Link>
            </Menu.Item>
            <Menu.Item key="chat" icon={<MessageOutlined />}>
              <Link to="/chat">Trò chuyện</Link>
            </Menu.Item>
          </SubMenu>
          
          <Menu.Item key="analytics" icon={<BarChartOutlined />}>
            <Link to="/analytics">Phân tích</Link>
          </Menu.Item>
          
          <Menu.Item key="products" icon={<ShoppingOutlined />}>
            <Link to="/products">Sản phẩm</Link>
          </Menu.Item>
          
          <Menu.Item key="customers" icon={<TeamOutlined />}>
            <Link to="/customers">Khách hàng</Link>
          </Menu.Item>
          
          <Menu.Item key="files" icon={<FileOutlined />}>
            <Link to="/files">Tệp</Link>
          </Menu.Item>
          
          <Menu.Divider />
          
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <Link to="/profile">Hồ sơ</Link>
          </Menu.Item>
          
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            <Link to="/settings">Cài đặt</Link>
          </Menu.Item>
        </Menu>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {!collapsed && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-blue-600 font-medium mb-2">Cần trợ giúp?</h3>
            <p className="text-gray-600 text-sm mb-3">Liên hệ với đội ngũ hỗ trợ của chúng tôi</p>
            <Link to="/support">
              <button className="bg-blue-600 text-white text-sm font-medium w-full py-2 rounded-md hover:bg-blue-700 transition-colors">
                Liên hệ hỗ trợ
              </button>
            </Link>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default SidebarComponent;