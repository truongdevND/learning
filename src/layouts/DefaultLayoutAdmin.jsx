
import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from '../components/layoutAdmin/HeaderComponent';
import SidebarComponent from '../components/layoutAdmin/SidebarComponent';


const { Content } = Layout;

const DefaultLayoutAdmin = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent toggleSidebar={toggleSidebar} />
      
      <Layout>
        <SidebarComponent collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
        
        <Layout>
          <Content  className='p-4'>
            {children}
          </Content>
          
         
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DefaultLayoutAdmin;