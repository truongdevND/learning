import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; 
import authService from '../../services/authService';
import useNotificationStore from '../../stores/useNotificationStore';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { showSuccess, showError } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    if (pendingEmail) {
      setEmailVerificationSent(true);
      form.setFieldsValue({ email: pendingEmail });
    }
  }, []);

  const onFinishRegister = async (values) => {
    setLoading(true);
    try {
      const { confirm: _, agreement: __, ...cleanValues } = values;
      const response = await authService.register(cleanValues);
      if (response) {
        localStorage.setItem('pendingVerificationEmail', cleanValues.email);
        setEmailVerificationSent(true);
        showSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
      }
    } catch (e) {
      showError('Đăng ký thất bại! Vui lòng thử lại.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyEmail = async(values) => {
    setVerificationLoading(true);
    try {
      const pendingEmail = localStorage.getItem('pendingVerificationEmail');
      const response = await authService.verifyEmail({
        email: pendingEmail,
        otp: values.verificationCode
      });
      if (response) {
        localStorage.removeItem('pendingVerificationEmail');
        showSuccess('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
        form.resetFields();
        navigate("/login");
      }
    } catch(e) {
      showError('Mã xác thực không đúng hoặc đã hết hạn!');
      console.error(e);
    } finally {
      setVerificationLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const resetForm = () => {
    localStorage.removeItem('pendingVerificationEmail');
    setEmailVerificationSent(false);
    form.resetFields();
  }

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
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Đăng ký</h1>
            <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={emailVerificationSent ? onVerifyEmail : onFinishRegister}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            {!emailVerificationSent ? (
              <>
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
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                    {
                      pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:";<>,.?~\\/-])/,
                      message: 'Mật khẩu phải có ít nhất 1 chữ hoa và 1 ký tự đặc biệt!'
                    }
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
              </>
            ) : (
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Chúng tôi đã gửi mã xác thực tới email của bạn. Vui lòng kiểm tra hộp thư và nhập mã xác thực bên dưới.
                </p>
                <Form.Item
                  name="verificationCode"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã xác thực!' },
                    { len: 6, message: 'Mã xác thực phải có 6 ký tự!' }
                  ]}
                >
                  <Input 
                    placeholder="Nhập mã xác thực" 
                    size="large"
                    maxLength={6}
                  />
                </Form.Item>
              </div>
            )}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full" 
                size="large"
                loading={loading || verificationLoading}
                style={{ background: '#1890ff' }}
              >
                {emailVerificationSent ? 'Xác thực' : 'Đăng ký'}
              </Button>
            </Form.Item>

            {emailVerificationSent && (
              <div className="text-center">
                <Button type="link" onClick={resetForm}>
                  Quay lại
                </Button>
              </div>
            )}

            {!emailVerificationSent && (
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Đăng nhập
                  </Link>
                </p>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;