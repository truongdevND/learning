import React from 'react';
import { Layout, Space } from 'antd';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined, CopyrightOutlined } from '@ant-design/icons';

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer className="bg-white gpy-12 text-black">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Về Chúng Tôi</h3>
          <p className="text-sm">Chúng tôi là một đội ngũ đam mê, luôn nỗ lực để mang đến những sản phẩm và dịch vụ tốt nhất cho khách hàng.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Liên Hệ</h3>
          <p className="text-sm"><EnvironmentOutlined className="mr-2" /> Số nhà, Đường phố, Quận/Huyện, Thành phố.</p>
          <p className="text-sm"><MailOutlined className="mr-2" /> email@example.com</p>
          <p className="text-sm"><PhoneOutlined className="mr-2" /> 0123456789</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Dịch Vụ</h3>
          <ul className="text-sm">
            <li>Dịch vụ A</li>
            <li>Dịch vụ B</li>
            <li>Dịch vụ C</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Mạng Xã Hội</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-black hover:text-black"><svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.67-1.65 1.13-2.66 1.33a7.74 7.74 0 0 0 3.35-4.1c-1.61.96-3.4 1.66-5.34 2a7.59 7.59 0 0 0-12.87 6.8c1.69.2 3.39-.2 4.79-1.29a7.53 7.53 0 0 0 6.59-2.2c-.22.7-.34 1.4-.34 2.2a7.59 7.59 0 0 0 1.36 4.8c-.6.2-1.2.3-1.8.3a7.6 7.6 0 0 0-7.1 5.2c1.2 1 2.5 1.5 4 1.5a7.59 7.59 0 0 0 12.99-6.8c.16-.2.3-.4.4-.6a7.64 7.64 0 0 0 2.16-2.1z"/></svg></a>
            <a href="#" className="text-black hover:text-black"><svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zm-3 0h-3v-3h3v3zm-5 0h-3v-3h3v3zm-5 0h-3v-3h3v3z"/></svg></a>
            {/* Thêm các mạng xã hội khác nếu cần */}
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 text-center text-gray-400 text-xs">
        <CopyrightOutlined className="mr-1" /> Bản quyền © {new Date().getFullYear()} <span className="font-semibold">Công Ty Tuyệt Vời</span>. Tất cả các quyền được bảo lưu.
      </div>
    </Footer>
  );
};

export default FooterComponent;