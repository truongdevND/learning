import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Input, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setUser(null); 
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">Thông tin tài khoản</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={handleLogout}>Đăng xuất</Menu.Item>
    </Menu>
  );

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <header className="w-full bg-white h-[80px] flex items-center justify-center shadow-md py-4 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-6">
              <a href="/" className="text-2xl font-bold text-blue-600">
                Hệ thống đào tạo
              </a>
            </div>
            <div className="">
              <Search
                placeholder="Tìm kiếm..."
                onSearch={(value) => console.log(value)}
                style={{ width: '400px' }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className="flex items-center cursor-pointer">
                  <Avatar icon={<UserOutlined />} />
                  <span className="ml-2 hidden md:inline-block">
                    {user.email} 
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-4 space-x-2">
                <Button type="primary" onClick={handleLogin}>
                  Đăng nhập
                </Button>
                <Button onClick={handleRegister}>
                  Đăng ký
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;