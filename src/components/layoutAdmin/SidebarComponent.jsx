import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined,
  ReadOutlined,
  BookOutlined,
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
      className="overflow-auto fixed left-0 top-0 z-10 "
      theme="light"
    >
     
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={['sub1']}
        style={{ borderRight: 0, background:'transparent', display:'flex',flexDirection:'column', gap:'8px', fontWeight:500, marginTop:"20px"}}
      >
        <Menu.Item key="dashboard" icon={<HomeOutlined style={{fontSize:22}} />} style={{height:'80px', borderRadius:10, margin:'0 8px'}} className="hover:bg-blue-100/60 transition-all">
          <Link to="/admin">Bảng điều khiển</Link>
        </Menu.Item>
        <Menu.Item key="user" icon={<UserOutlined style={{fontSize:22}} />} style={{height:'80px', borderRadius:10, margin:'0 8px'}} className="hover:bg-blue-100/60 transition-all">
          <Link to="/admin/user">Quản lý tài khoản</Link>
        </Menu.Item>
        <Menu.Item key="course" icon={<BookOutlined style={{fontSize:22}} />} style={{height:'80px', borderRadius:10, margin:'0 8px'}} className="hover:bg-blue-100/60 transition-all">
          <Link to="/admin/course">Quản lý khóa học</Link>
        </Menu.Item>
        <Menu.Item key="customers" icon={<ReadOutlined style={{fontSize:22}} />} style={{height:'80px', borderRadius:10, margin:'0 8px'}} className="hover:bg-blue-100/60 transition-all">
          <Link to="/admin/lession">Quản lý Bài bài học</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;