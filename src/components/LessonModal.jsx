import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, FilePdfOutlined, VideoCameraOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import useNotificationStore from '../stores/useNotificationStore';
import { useEffect } from 'react';

const { TextArea } = Input;

const LessonModal = ({
  visible,
  type = 'create',
  form,
  loading = false,
  onCancel,
  onSubmit
}) => {
  const imgValue = form.getFieldValue('img');
  const videoValue = form.getFieldValue('lesson_video');
  const [imgPreview, setImgPreview] = useState();
  const [videoPreview, setVideoPreview] = useState();
  const { showSuccess, showError } = useNotificationStore();
  useEffect(() => {
    console.log("imgValue",imgValue);

    if (imgValue) {
      setImgPreview(`http://localhost:8080/api/media/${imgValue}`);
    } else {
      setImgPreview(null);
    }
  }, [imgValue]);

  useEffect(() => {
    console.log("videoValue",videoValue);
    
    if (videoValue) {
      setVideoPreview(`http://localhost:8080/api/media/${videoValue}`);

    } else {
      setVideoPreview(null);
    }
  }, [videoValue]);

  useEffect(() => {
    if (visible && type === 'create') {
      form.resetFields();
      setImgPreview(null);
      setVideoPreview(null);
    }
  }, [visible, type, form]);

  const handleImgUpload = async ({ file, onSuccess, onError }) => {
    const actualFile = file.originFileObj || file;
    const formData = new FormData();
    formData.append('img', actualFile);
    try {
      const res = await courseService.createMedia(formData);
      if (res) {
        form.setFieldsValue({ img: res });
        setImgPreview(`http://localhost:8080/api/media/${res}`);
        showSuccess('Tải ảnh/pdf lên thành công!');
        onSuccess && onSuccess(res, file);
      } else {
        showError('Tải ảnh/pdf thất bại!');
        onError && onError(new Error('Upload failed'));
      }
    } catch (err) {
      showError('Tải ảnh/pdf thất bại!');
      onError && onError(err);
    }
  };

  const handleDeleteImg = () => {
    form.setFieldsValue({ img: undefined });
    setImgPreview(null);
    showSuccess('Đã xóa ảnh/pdf');
  };

  const handleVideoUpload = async ({ file, onSuccess, onError }) => {
    const actualFile = file.originFileObj || file;
    if (actualFile.size > 524288000) {
      showError('Video không được vượt quá 500MB!');
      onError && onError(new Error('File quá lớn'));
      return;
    }
    const formData = new FormData();
    formData.append('img', actualFile); 
    try {
      const res = await courseService.createMedia(formData);
      if (res) {
        form.setFieldsValue({ video: res });
        setVideoPreview(`http://localhost:8080/api/media/${res}`);
        showSuccess('Tải video lên thành công!');
        onSuccess && onSuccess(res, file);
      } else {
        showError('Tải video thất bại!');
        onError && onError(new Error('Upload failed'));
      }
    } catch (err) {
      showError('Tải video thất bại!');
      onError && onError(err);
    }
  };

  const handleDeleteVideo = () => {
    form.setFieldsValue({ video: undefined });
    setVideoPreview(null);
    showSuccess('Đã xóa video');
  };

  return (
    <Modal
      title={type === 'create' ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}
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
      >
        <Form.Item
          name="lesson_name"
          label="Tên bài học"
          rules={[{ required: true, message: 'Vui lòng nhập tên bài học!' }]}
        >
          <Input placeholder="Nhập tên bài học" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả bài học!' }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả bài học" />
        </Form.Item>
        <Form.Item label="Ảnh hoặc PDF">
          {!imgPreview ? (
            <Upload
              name="file"
              customRequest={handleImgUpload}
              showUploadList={false}
              accept="image/*,.pdf"
              maxCount={1}
            >
              <Button icon={<PlusOutlined />}>Chọn ảnh hoặc PDF</Button>
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
                  accept="image/*,.pdf"
                  maxCount={1}
                >
                  <Button icon={<PlusOutlined />}>Thay đổi</Button>
                </Upload>
              </div>
              <div className="mt-3">
                {imgValue && imgValue.endsWith('.pdf') ? (
                  <a href={imgPreview} target="_blank" rel="noopener noreferrer">
                    <FilePdfOutlined style={{ fontSize: 32, color: 'red' }} /> Xem PDF
                  </a>
                ) : (
                  <img
                    src={imgPreview}
                    alt="preview"
                    className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item name="img" style={{ display: 'none' }}>
        </Form.Item>
        <Form.Item label="Video">
          {!videoPreview ? (
            <Upload
              name="file"
              customRequest={handleVideoUpload}
              showUploadList={false}
              accept="video/*"
              maxCount={1}
              beforeUpload={file => {
                if (file.size > 524288000) {
                  showError('Video không được vượt quá 500MB!');
                  return Upload.LIST_IGNORE;
                }
                return true;
              }}
            >
              <Button icon={<PlusOutlined />}>Chọn video</Button>
            </Upload>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Button 
                  icon={<DeleteOutlined />} 
                  onClick={handleDeleteVideo}
                  danger
                >
                  Xóa
                </Button>
                <Upload
                  name="file"
                  customRequest={handleVideoUpload}
                  showUploadList={false}
                  accept="video/*"
                  maxCount={1}
                >
                  <Button icon={<PlusOutlined />}>Thay đổi</Button>
                </Upload>
              </div>
              <div className="mt-3">
                <video width="200" height="120" controls src={videoPreview} />
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item name="video" style={{ display: 'none' }}>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LessonModal; 