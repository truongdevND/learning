import React from 'react';
import { Layout, Menu, Space } from 'antd';
import { HomeOutlined, InfoCircleOutlined, BulbOutlined, PhoneOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HeaderComponent = () => {
  return (
    <Header style={{backgroundColor: '#fff'}} className="bg-white  shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-16 text-black">
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-2 fill-current text-yellow-400" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 7.5-18-7.5 18-6.79-3L12 2z"/>
          </svg>
          <span className="text-xl font-semibold">abgdhsagdhashdasgh</span>
        </div>
        <Menu mode="horizontal" className="bg-transparent text-black" selectedKeys={[]}>
          <Menu.Item key="home" icon={<HomeOutlined />}>Trang chủ</Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>Giới thiệu</Menu.Item>
          <Menu.Item key="services" icon={<BulbOutlined />}>Dịch vụ</Menu.Item>
          <Menu.Item key="contact" icon={<PhoneOutlined />}>Liên hệ</Menu.Item>
        </Menu>
      </div>
    </Header>
  );
};

export default HeaderComponent;