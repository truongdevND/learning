// Footer.jsx
import React from 'react';
import { Button, Input, Divider } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto">

   
        
        {/* Bottom Section */}
        <Divider className="bg-gray-700 m-0" />
        <div className="px-4 lg:px-6 py-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} BrandName. Tất cả các quyền được bảo lưu.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-500 hover:text-gray-300 mx-2">Chính sách bảo mật</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 mx-2">Điều khoản sử dụng</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 mx-2">Chính sách cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;