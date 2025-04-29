import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Upload, Space, Tooltip, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import useNotificationStore from '../stores/useNotificationStore';

const { TextArea } = Input;

const CourseModal = ({
  visible,
  type = 'create',
  form,
  loading = false,
  onCancel,
  onSubmit,
 
}) => {
  const mediaValue = form.getFieldValue('media');
  const [imagePreview, setImagePreview] = useState(mediaValue ? `http://localhost:8080/api/media/${mediaValue}` : null);
  const { showSuccess, showError } = useNotificationStore();

  useEffect(() => {
    if (mediaValue) {
      setImagePreview(`http://localhost:8080/api/media/${mediaValue}`);
    } else {
      setImagePreview(null);
    }
  }, [mediaValue]);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const actualFile = file.originFileObj || file;
    
    const formData = new FormData();
    formData.append('img', actualFile);
    
    try {
      const res = await courseService.createMedia(formData);
      console.log(res);
      
      if (res) {
        form.setFieldsValue({ media: res });
        setImagePreview(`http://localhost:8080/api/media/${res}`);
        showSuccess('Tải ảnh lên thành công!');
        
        onSuccess && onSuccess(res, file);
      } else {
        showError('Tải ảnh thất bại!');
        onError && onError(new Error('Upload failed'));
      }
    } catch (err) {
      console.error('Chi tiết lỗi:', err);
      showError('Tải ảnh thất bại!');
      onError && onError(err);
    }
  };

  const handleDeleteImage = () => {
    form.setFieldsValue({ media: undefined });
    setImagePreview(null);
    showSuccess('Đã xóa ảnh');
  };

  return (
    <Modal
      title={type === 'create' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
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
          {type === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-4"
      >
        <Form.Item
          name="course_name"
          label="Tên khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học!' }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả khóa học" />
        </Form.Item>
        <Form.Item
          label="Ảnh khóa học"
          required
        >
          {!imagePreview ? (
            <Upload
              name="file"
              customRequest={handleUpload}
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
                  onClick={handleDeleteImage}
                  danger
                >
                  Xóa ảnh
                </Button>
                <Upload
                  name="file"
                  customRequest={handleUpload}
                  showUploadList={false}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<PlusOutlined />}>Thay đổi ảnh</Button>
                </Upload>
              </div>
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item
          name="media"
          style={{ display: 'none' }}
          rules={[{ required: true, message: 'Vui lòng tải lên ảnh!' }]}
        >
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseModal;