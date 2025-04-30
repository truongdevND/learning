import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload, Space, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, FilePdfOutlined, VideoCameraOutlined, LoadingOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import useNotificationStore from '../stores/useNotificationStore';
import { useEffect } from 'react';

const { TextArea } = Input;

// Kích thước giới hạn cho video: 2GB (bytes)
const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024;

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
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    console.log("imgValue", imgValue);

    if (imgValue) {
      setImgPreview(`http://localhost:8080/api/media/${imgValue}`);
    } else {
      setImgPreview(null);
    }
  }, [imgValue]);

  useEffect(() => {
    console.log("videoValue", videoValue);
    
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
    
    setUploadingImg(true);
    showSuccess('Đang tải ảnh/PDF lên, vui lòng đợi...');
    
    try {
      const res = await courseService.createMedia(formData);
      if (res) {
        form.setFieldsValue({ img: res });
        setImgPreview(`http://localhost:8080/api/media/${res}`);
        showSuccess('Tải ảnh/PDF lên thành công!');
        onSuccess && onSuccess(res, file);
      } else {
        showError('Tải ảnh/PDF thất bại!');
        onError && onError(new Error('Upload failed'));
      }
    } catch (err) {
      showError('Tải ảnh/PDF thất bại!');
      onError && onError(err);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleDeleteImg = () => {
    form.setFieldsValue({ img: undefined });
    setImgPreview(null);
    showSuccess('Đã xóa ảnh/PDF');
  };

  const handleVideoUpload = async ({ file, onSuccess, onError }) => {
    const actualFile = file.originFileObj || file;
    if (actualFile.size > MAX_VIDEO_SIZE) {
      showError('Video không được vượt quá 2GB!');
      onError && onError(new Error('File quá lớn'));
      return;
    }
    
    const formData = new FormData();
    formData.append('img', actualFile); 
    
    setUploadingVideo(true);
    showSuccess('Đang tải video lên, vui lòng đợi...');
    
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
    } finally {
      setUploadingVideo(false);
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
            <Spin spinning={uploadingImg} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
              <Upload
                name="file"
                customRequest={handleImgUpload}
                showUploadList={false}
                accept="image/*,.pdf"
                maxCount={1}
                disabled={uploadingImg}
              >
                <Button icon={<PlusOutlined />} disabled={uploadingImg}>
                  {uploadingImg ? 'Đang tải lên...' : 'Chọn ảnh hoặc PDF'}
                </Button>
              </Upload>
            </Spin>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Button 
                  icon={<DeleteOutlined />} 
                  onClick={handleDeleteImg}
                  danger
                  disabled={uploadingImg}
                >
                  Xóa
                </Button>
                <Spin spinning={uploadingImg} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                  <Upload
                    name="file"
                    customRequest={handleImgUpload}
                    showUploadList={false}
                    accept="image/*,.pdf"
                    maxCount={1}
                    disabled={uploadingImg}
                  >
                    <Button icon={<PlusOutlined />} disabled={uploadingImg}>
                      {uploadingImg ? 'Đang tải lên...' : 'Thay đổi'}
                    </Button>
                  </Upload>
                </Spin>
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
            <Spin spinning={uploadingVideo} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
              <Upload
                name="file"
                customRequest={handleVideoUpload}
                showUploadList={false}
                accept="video/*"
                maxCount={1}
                disabled={uploadingVideo}
                beforeUpload={file => {
                  if (file.size > MAX_VIDEO_SIZE) {
                    showError('Video không được vượt quá 2GB!');
                    return Upload.LIST_IGNORE;
                  }
                  return true;
                }}
              >
                <Button icon={<PlusOutlined />} disabled={uploadingVideo}>
                  {uploadingVideo ? 'Đang tải lên...' : 'Chọn video'}
                </Button>
              </Upload>
            </Spin>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Button 
                  icon={<DeleteOutlined />} 
                  onClick={handleDeleteVideo}
                  danger
                  disabled={uploadingVideo}
                >
                  Xóa
                </Button>
                <Spin spinning={uploadingVideo} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                  <Upload
                    name="file"
                    customRequest={handleVideoUpload}
                    showUploadList={false}
                    accept="video/*"
                    maxCount={1}
                    disabled={uploadingVideo}
                    beforeUpload={file => {
                      if (file.size > MAX_VIDEO_SIZE) {
                        showError('Video không được vượt quá 2GB!');
                        return Upload.LIST_IGNORE;
                      }
                      return true;
                    }}
                  >
                    <Button icon={<PlusOutlined />} disabled={uploadingVideo}>
                      {uploadingVideo ? 'Đang tải lên...' : 'Thay đổi'}
                    </Button>
                  </Upload>
                </Spin>
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