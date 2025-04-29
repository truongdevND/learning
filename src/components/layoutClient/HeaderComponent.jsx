import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Input, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';

const { Search } = Input;

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleLogin = () => {
    navigate("/login");                 
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleSearch = async (value) => {
    setSearchLoading(true);
    try {
      const res = await courseService.getCourses({ key: value, page: 0, pageSize: 5 });
      setSearchResults(res.data?.courses || []);
      setShowDropdown(true);
    } catch {
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResultClick = (id) => {
    setShowDropdown(false);
    setSearchResults([]);
    setSearchValue("");
    navigate(`/course/${id}`);
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
           
            <div className="relative">
              <Search
                placeholder="Tìm kiếm..."
                onSearch={handleSearch}
                loading={searchLoading}
                style={{ width: '400px' }}
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                onFocus={() => { if (searchResults.length > 0 || searchValue) setShowDropdown(true); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {showDropdown && (
                <div className="absolute bg-white shadow-lg rounded-lg w-[400px] z-50 max-h-72 overflow-auto border border-gray-200 mt-1">
                  {searchLoading ? (
                    <div className="flex items-center justify-center p-4 text-blue-500">
                      Đang tìm kiếm...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(course => (
                      <div
                        key={course.id}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                        onMouseDown={() => handleResultClick(course.id)}
                      >
                        <img
                          src={`http://localhost:8080/api/media/${course.img}`}
                          alt={course.course_name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 truncate">{course.course_name}</div>
                          <div className="text-xs text-gray-500 truncate">{course.description}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-gray-400 select-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 7a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Không có dữ liệu</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
  {user ? (
    <div className="flex items-center gap-4">
      <Avatar icon={<UserOutlined />} size={36} />
      <span className="hidden md:inline-block font-medium text-gray-800">
        {user.email}
      </span>
      <Button
        type="default"
        danger
        onClick={handleLogout}
        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md px-4 py-1"
      >
        Đăng xuất
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Button
        type="primary"
        onClick={handleLogin}
        className="rounded-md px-5 py-1.5 font-semibold shadow"
      >
        Đăng nhập
      </Button>
      <Button
        type="default"
        onClick={handleRegister}
        className="rounded-md px-5 py-1.5 font-semibold border border-blue-500 text-blue-600 hover:bg-blue-50"
      >
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