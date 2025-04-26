import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishLogin = (values) => {
    setLoading(true);
    // Giả lập đăng nhập API
    setTimeout(() => {
      console.log('Login values:', values);
      message.success('Đăng nhập thành công!');
      setLoading(false);
    }, 1500);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-gray-500 p-4">
      <div className="flex w-full max-w-7xl h-[600px] overflow-hidden bg-white rounded-xl shadow-2xl">
        <div className="hidden md:block md:w-2/2 relative">
          <img 
            src="https://media.istockphoto.com/id/1366428092/vi/anh/h%E1%BB%99i-th%E1%BA%A3o-tr%C3%AAn-web-k%E1%BB%B9-n%C4%83ng-e-learning-k%E1%BB%B9-n%C4%83ng-kinh-doanh-kh%C3%A1i-ni%E1%BB%87m-c%C3%B4ng-ngh%E1%BB%87-internet-%C4%91%C3%A0o-t%E1%BA%A1o-k%E1%BB%B9.jpg?s=612x612&w=0&k=20&c=RVmcoOZ8WkU72SjVMw9NFRDyWyqF6uOGB3-BtH1g38Q=" 
            alt="Login illustration" 
            className="absolute inset-0 h-full w-full "
          />
         
        </div>
      
        <div className="w-full md:w-1/2 p-9">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Đăng nhập</h1>
            <p className="text-gray-600 mt-2">Đăng nhập vào tài khoản của bạn</p>
          </div>

          <Form
            form={form}
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinishLogin}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email của bạn!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="site-form-item-icon" />} 
                placeholder="Email" 
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <a className="text-blue-600 hover:text-blue-800" href="#">
                  Quên mật khẩu?
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full" 
                size="large"
                loading={loading}
                style={{ background: '#1890ff' }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;