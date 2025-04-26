import React, { useState } from 'react';
import { Menu, Button, Dropdown, Input, Badge, Avatar } from 'antd';
import { 
  MenuOutlined, 
  SearchOutlined, 
  BellOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  DownOutlined
} from '@ant-design/icons';

const { Search } = Input;

const Header = () => {
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="1">Trang chủ</Menu.Item>
      <Menu.Item key="2">Sản phẩm</Menu.Item>
      <Menu.Item key="3">Dịch vụ</Menu.Item>
      <Menu.Item key="4">Giới thiệu</Menu.Item>
      <Menu.Item key="5">Liên hệ</Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="1">Thông tin tài khoản</Menu.Item>
      <Menu.Item key="2">Đơn hàng của tôi</Menu.Item>
      <Menu.Item key="3">Cài đặt</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4">Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <header className="w-full bg-white shadow-md py-4 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-6">
              <a href="/" className="text-2xl font-bold text-blue-600">MyWebsite</a>
            </div>
            <div className="hidden md:block">
              <nav className="flex space-x-6">
                <a href="/" className="text-gray-800 hover:text-blue-600 font-medium">Trang chủ</a>
                <a href="/products" className="text-gray-800 hover:text-blue-600 font-medium">Sản phẩm</a>
                <a href="/services" className="text-gray-800 hover:text-blue-600 font-medium">Dịch vụ</a>
                <a href="/about" className="text-gray-800 hover:text-blue-600 font-medium">Giới thiệu</a>
                <a href="/contact" className="text-gray-800 hover:text-blue-600 font-medium">Liên hệ</a>
              </nav>
            </div>
            <div className="md:hidden">
              <Dropdown overlay={menu} trigger={['click']}>
                <Button type="text" icon={<MenuOutlined />} onClick={() => setVisible(!visible)} />
              </Dropdown>
            </div>
          </div>

          {/* Search, notifications, cart, user */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <Search
                placeholder="Tìm kiếm..."
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
              />
            </div>                                     
            <div className="sm:hidden flex gap-4">
              <Button type="text" icon={<SearchOutlined />} />
            </div>
            <Badge className='mr-4' count={5} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
        
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div className="flex items-center cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span className="ml-2 hidden md:inline-block">Người dùng</span>
                <DownOutlined className="ml-1" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;