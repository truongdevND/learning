import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  LinkedinOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Title, Text } = Typography;

const FooterComponent = () => {
  return (
    <Footer className="bg-gray-800 text-white p-0">
      <div className="container mx-auto px-6 pt-10 pb-6">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white">App Name</span>
              </div>
              <Text className="text-gray-300">
                Ứng dụng của chúng tôi giúp bạn quản lý công việc hiệu quả và tối ưu thời gian làm việc.
              </Text>
            </div>
            <div>
              <Space size="large">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500">
                  <FacebookOutlined style={{ fontSize: '24px' }} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400">
                  <TwitterOutlined style={{ fontSize: '24px' }} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-600">
                  <InstagramOutlined style={{ fontSize: '24px' }} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-700">
                  <LinkedinOutlined style={{ fontSize: '24px' }} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <GithubOutlined style={{ fontSize: '24px' }} />
                </a>
              </Space>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Title level={4} className="text-white mb-6">Sản phẩm</Title>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-300 hover:text-white">Tính năng</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white">Bảng giá</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link to="/roadmap" className="text-gray-300 hover:text-white">Lộ trình phát triển</Link></li>
            </ul>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Title level={4} className="text-white mb-6">Công ty</Title>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">Về chúng tôi</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white">Tuyển dụng</Link></li>
              <li><Link to="/press" className="text-gray-300 hover:text-white">Báo chí</Link></li>
            </ul>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Title level={4} className="text-white mb-6">Hỗ trợ</Title>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-300 hover:text-white">Trung tâm trợ giúp</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Điều khoản sử dụng</Link></li>
            </ul>
          </Col>
        </Row>
        
        <Divider className="bg-gray-700 mt-8 mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2025 App Name. Tất cả các quyền được bảo lưu.
          </div>
          <div className="text-gray-400">
            <Space split={<span className="text-gray-500 mx-2">|</span>}>
              <Link to="/privacy" className="text-gray-400 hover:text-white">Chính sách bảo mật</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">Điều khoản sử dụng</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white">Chính sách cookie</Link>
            </Space>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;