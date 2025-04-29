import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, message } from 'antd';
import userService from '../../services/userService';
import courseService from '../../services/courseService';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

function Home() {
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);
  const [testCount, setTestCount] = useState(0);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Lấy tổng số user
      const userRes = await userService.getAllUser();
      setUserCount(userRes.data ? userRes.data.length : 0);

      // Lấy tổng số khóa học
      const courseRes = await courseService.getCourses({ page: 0, pageSize: 1000 });
      setCourseCount(courseRes.data && courseRes.data.courses ? courseRes.data.courses.length : 0);

      // Lấy tổng số bài học
      const lessonRes = await courseService.getLession({ page: 0, pageSize: 1000 });
      setLessonCount(lessonRes.data && lessonRes.data.lesson_list ? lessonRes.data.lesson_list.length : 0);

      // Đếm tổng số bài thi từ tất cả user (gộp lại)
      let totalTest = 0;
      if (userRes.data && Array.isArray(userRes.data)) {
        for (const user of userRes.data) {
          if (user.tracking && Array.isArray(user.tracking)) {
            totalTest += user.tracking.length;
          }
        }
      }
      setTestCount(totalTest);
    } catch {
      message.error('Không thể tải dữ liệu thống kê!');
    } finally {
      setLoading(false);
    }
  };

  // Dữ liệu cho PieChart
  const pieData = [
    { name: 'Người dùng', value: userCount },
    { name: 'Khóa học', value: courseCount },
    { name: 'Bài học', value: lessonCount },
    { name: 'Bài thi', value: testCount },
  ];
  const COLORS = ['#1890ff', '#52c41a', '#722ed1', '#f5222d'];

  // Dữ liệu cho BarChart
  const barData = [
    {
      name: 'Thống kê',
      'Người dùng': userCount,
      'Khóa học': courseCount,
      'Bài học': lessonCount,
      'Bài thi': testCount,
    },
  ];

  return (
    <div className="p-8">
      <Title level={2} className="mb-8">Thống kê tổng quan hệ thống</Title>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-lg" bordered={false}>
              <Title level={4}>Tổng số người dùng</Title>
              <div className="text-3xl font-bold text-blue-600">{userCount}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-lg" bordered={false}>
              <Title level={4}>Tổng số khóa học</Title>
              <div className="text-3xl font-bold text-green-600">{courseCount}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-lg" bordered={false}>
              <Title level={4}>Tổng số bài học</Title>
              <div className="text-3xl font-bold text-purple-600">{lessonCount}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-lg" bordered={false}>
              <Title level={4}>Tổng số bài thi</Title>
              <div className="text-3xl font-bold text-red-600">{testCount}</div>
            </Card>
          </Col>
        </Row>
        {/* Biểu đồ Pie và Bar */}
        <Row gutter={[24, 24]} className="mt-10">
          <Col xs={24} md={12}>
            <Card className="shadow-lg" bordered={false}>
              <Title level={4} className="mb-4">Tỷ lệ các loại thống kê</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="shadow-lg" bordered={false}>
              <Title level={4} className="mb-4">Biểu đồ số lượng</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="Người dùng" fill="#1890ff" />
                  <Bar dataKey="Khóa học" fill="#52c41a" />
                  <Bar dataKey="Bài học" fill="#722ed1" />
                  <Bar dataKey="Bài thi" fill="#f5222d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        </>
      )}
    </div>
  );
}

export default Home;
