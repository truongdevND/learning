import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import { Link } from 'react-router-dom'; // Giả sử bạn đang sử dụng React Router

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const onFinishRegister = (values) => {
    setLoading(true);
    // Giả lập đăng ký API và gửi email xác thực
    setTimeout(() => {
      console.log('Register values:', values);
      setEmailVerificationSent(true);
      setLoading(false);
    }, 1500);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const resetForm = () => {
    setEmailVerificationSent(false);
    form.resetFields();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-gray-500 p-4">
      <div className="flex w-full max-w-5xl h-[600px] overflow-hidden bg-white rounded-xl shadow-2xl">
        <div className="hidden md:block md:w-2/2 relative">
        <img 
            src="https://paris-u.edu.vn/wp-content/uploads/2023/02/Article-COVER.png" 
            alt="Login illustration" 
            className="absolute inset-0 h-full w-full object-cover"
          />
         
        </div>
        
        <div className="w-full md:w-1/2 p-9">
          {emailVerificationSent ? (
            <Result
              status="success"
              title="Đăng ký thành công!"
              subTitle="Chúng tôi đã gửi email xác thực tới địa chỉ email của bạn. Vui lòng kiểm tra hộp thư và xác nhận tài khoản của bạn."
              extra={[
                <Button 
                  type="primary" 
                  key="console"
                  onClick={resetForm}
                  style={{ background: '#1890ff' }}
                >
                  Quay lại
                </Button>,
                <Link to="/login" key="login">
                  <Button type="default">
                    Đến trang đăng nhập
                  </Button>
                </Link>
              ]}
            />
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Đăng ký</h1>
                <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
              </div>

              <Form
                form={form}
                name="register"
                onFinish={onFinishRegister}
                onFinishFailed={onFinishFailed}
                layout="vertical"
              >
                <Form.Item
                  name="fullname"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên của bạn!' }]}
                >
                  <Input 
                    prefix={<UserOutlined className="site-form-item-icon" />} 
                    placeholder="Họ và tên" 
                    size="large"
                  />
                </Form.Item>
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
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Mật khẩu"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Hai mật khẩu bạn nhập không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Xác nhận mật khẩu"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với các điều khoản')),
                    },
                  ]}
                >
                  <Checkbox>
                    Tôi đã đọc và đồng ý với <a href="#">điều khoản dịch vụ</a>
                  </Checkbox>
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
                    Đăng ký
                  </Button>
                </Form.Item>

                <div className="text-center mt-4">
                  <p className="text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;