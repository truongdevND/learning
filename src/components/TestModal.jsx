import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload, Space, Checkbox, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, FileImageOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import useNotificationStore from '../stores/useNotificationStore';
import { useEffect } from 'react';

const { TextArea } = Input;

const TestModal = ({
  visible,
  type = 'create',
  form,
  loading = false,
  onCancel,
  onSubmit
}) => {
  const imgValue = form.getFieldValue('img');
  const [imgPreview, setImgPreview] = useState(imgValue ? `http://localhost:8080/api/media/${imgValue}` : null);
  const { showSuccess, showError } = useNotificationStore();
  useEffect(() => {
    console.log("imgValue",imgValue);

    if (imgValue) {
      setImgPreview(`http://localhost:8080/api/media/${imgValue}`);
    } else {
      setImgPreview(null);
    }
  }, [imgValue]);
  const handleImgUpload = async ({ file, onSuccess, onError }) => {
    const actualFile = file.originFileObj || file;
    const formData = new FormData();
    formData.append('img', actualFile);
    try {
      const res = await courseService.createMedia(formData);
      if (res) {
        form.setFieldsValue({ img: res });
        setImgPreview(`http://localhost:8080/api/media/${res}`);
        showSuccess('Tải ảnh lên thành công!');
        onSuccess && onSuccess(res, file);
      } else {
        showError('Tải ảnh thất bại!');
        onError && onError(new Error('Upload failed'));
      }
    } catch (err) {
      showError('Tải ảnh thất bại!');
      onError && onError(err);
    }
  };

  const handleDeleteImg = () => {
    form.setFieldsValue({ img: undefined });
    setImgPreview(null);
    showSuccess('Đã xóa ảnh');
  };

  return (
    <Modal
      title={type === 'create' ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {type === 'create' ? 'Thêm mới' : 'Cập nhật'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-4"
        initialValues={{ questionAnswers: [{ answer: '', isCollect: false }] }}
      >
        <Form.Item
          name="question"
          label="Nội dung câu hỏi"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
        >
          <TextArea rows={3} placeholder="Nhập nội dung câu hỏi" />
        </Form.Item>
        <Form.Item label="Ảnh minh hoạ (nếu có)">
          {!imgPreview ? (
            <Upload
              name="file"
              customRequest={handleImgUpload}
              showUploadList={false}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
            </Upload>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Button 
                  icon={<DeleteOutlined />} 
                  onClick={handleDeleteImg}
                  danger
                >
                  Xóa
                </Button>
                <Upload
                  name="file"
                  customRequest={handleImgUpload}
                  showUploadList={false}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<PlusOutlined />}>Thay đổi</Button>
                </Upload>
              </div>
              <div className="mt-3">
                <img
                  src={imgPreview}
                  alt="preview"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item name="img" style={{ display: 'none' }}><Input type="hidden" /></Form.Item>
        <Form.List name="questionAnswers" rules={[{ validator: async(_, answers) => {
          if (!answers || answers.length < 2) {
            return Promise.reject(new Error('Cần ít nhất 2 đáp án!'));
          }
          if (!answers.some(a => a && a.isCollect)) {
            return Promise.reject(new Error('Phải chọn ít nhất 1 đáp án đúng!'));
          }
        }}]}>
          {(fields, { add, remove }, { errors }) => (
            <div>
              <label className="font-medium">Danh sách đáp án</label>
              {fields.map((field, idx) => (
                <Row gutter={8} key={field.key} align="middle" className="mb-2">
                  <Col flex="auto">
                    <Form.Item
                      {...field}
                      name={[field.name, 'answer']}
                      fieldKey={[field.fieldKey, 'answer']}
                      rules={[{ required: true, message: 'Nhập đáp án!' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder={`Đáp án ${idx + 1}`} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name={[field.name, 'isCollect']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Đúng</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    {fields.length > 2 && (
                      <Button icon={<DeleteOutlined />} danger onClick={() => remove(field.name)} />
                    )}
                  </Col>
                </Row>
              ))}
              <Form.ErrorList errors={errors} />
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2">
                Thêm đáp án
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default TestModal; 