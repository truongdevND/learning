
import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from '../components/layoutClient/HeaderComponent';
import FooterComponent from '../components/layoutClient/FooterComponent'; 


const { Content } = Layout;

const DefaultLayoutClient = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent toggleSidebar={toggleSidebar} />
      
      <Layout>
       
        
        <Layout>
          <Content >
            {children}
          </Content>
          
         
        </Layout>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default DefaultLayoutClient;