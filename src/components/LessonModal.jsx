import React from 'react';
import { Modal, Button, Form, Input } from 'antd';

const { TextArea } = Input;

const LessonModal = ({
  visible,
  type = 'create',
  form,
  loading = false,
  onCancel,
  onSubmit
}) => (
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
    </Form>
  </Modal>
);

export default LessonModal; 