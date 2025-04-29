import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag, Spin, message } from 'antd';
import userService from '../../services/userService';

const { Title, Paragraph } = Typography;

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loadingTracking, setLoadingTracking] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await userService.getAllUser();
      setUsers(res.data || []);
    } catch {
      message.error('Không thể tải danh sách người dùng!');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTracking = async (user) => {
    setSelectedUser(user);
    setLoadingTracking(true);
    try {
      const res = await userService.getTrackingUser({ user_id: user.id });
      setTracking(res.data || []);
    } catch {
      message.error('Không thể tải thông tin bài thi của người dùng!');
      setTracking([]);
    } finally {
      setLoadingTracking(false);
    }
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role_course', key: 'role_course',
      render: (role) => role === 1 ? <Tag color="blue">Admin</Tag> : <Tag color="green">User</Tag>
    },
  ];

  const trackingColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên bài học', dataIndex: ['lesson', 'lesson_name'], key: 'lesson_name',
      render: (_, record) => record.lesson ? record.lesson.lesson_name : '-' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status) => {
        if (status === 0) return <Tag color="processing">Doing</Tag>;
        if (status === 1) return <Tag color="success">Pass</Tag>;
        if (status === 2) return <Tag color="error">Fail</Tag>;
        return '-';
      }
    },
    { title: 'Điểm', dataIndex: 'score', key: 'score' },
    { title: 'Thời gian (phút)', dataIndex: 'time', key: 'time' },
    { title: 'Bắt đầu', dataIndex: 'created_at', key: 'created_at',
      render: (text) => text ? new Date(text).toLocaleString() : '-' },
    { title: 'Kết thúc', dataIndex: 'finished_at', key: 'finished_at',
      render: (text) => text ? new Date(text).toLocaleString() : '-' },
  ];

  return (
    <div className="p-6">
      <Title level={2}>Quản lý người dùng</Title>
      <Table
        columns={userColumns}
        dataSource={users}
        loading={loadingUsers}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => fetchTracking(record),
          className: 'cursor-pointer',
        })}
        rowClassName={(record) => selectedUser && record.id === selectedUser.id ? 'bg-blue-50' : ''}
        className="bg-white rounded shadow mb-8"
        pagination={false}
      />

      {selectedUser && (
        <Card
          title={<span>Thông tin bài thi của <b>{selectedUser.email}</b></span>}
          className="mt-8 shadow-md"
        >
          {loadingTracking ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={trackingColumns}
              dataSource={tracking}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'Không có bài thi nào.' }}
              className="bg-white rounded shadow"
            />
          )}
        </Card>
      )}
    </div>
  );
}

export default UserManager;
