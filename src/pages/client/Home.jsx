import React, { useState, useEffect } from 'react';
import { Card, Select, Tag, Space, Rate, Empty, Spin, Tabs, Button } from 'antd';
import { ClockCircleOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined as ClockIcon } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import courseService from '../../services/courseService';
import useNotificationStore from '../../stores/useNotificationStore';
import { message } from 'antd';
import userService from '../../services/userService';
import authService from '../../services/authService';

const { Option } = Select;
const { TabPane } = Tabs;

const Home = () => {
  const [filter, setFilter] = useState('all');
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [keySearch, setKeySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const { setMessageApi } = useNotificationStore();

  useEffect(() => {
    setMessageApi(messageApi);
    const user = authService.getCurrentUser();
    setIsLoggedIn(!!user);
    if (user) {
      fetchTrackingData(user.user_id);
    }
  }, [messageApi, setMessageApi]);

  const fetchTrackingData = async (userId) => {
    try {
      const response = await userService.getTrackingUser({ user_id: userId });
      if (response.data) {
        setTrackingData(response.data);
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  const fetchDataCourse = async () => {
    try {
      setLoading(true);
      const filter = {
        page: currentPage,
        pageSize: 10,
        key: keySearch
      };
      const response = await courseService.getCourses(filter);
      setCourses(response.data.courses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCourse();
  }, [currentPage, keySearch]);

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'data', label: 'Data Science' },
    { value: 'devops', label: 'DevOps' }
  ];

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => course.category === filter);

  const completedTests = trackingData.filter(item => item.status === 1 && (item.lesson_test || item.course_test));
  const inProgressTests = trackingData.filter(item => item.status === 0 && (item.lesson_test || item.course_test));

  const handleTestClick = (item) => {
    if (item.status === 0) {
      if (item.lesson_test) {
        navigate(`/course/${item.course?.id}/lesson/${item.lesson?.id}/test/${item.object_id}`);
      } else if (item.course_test) {
        navigate(`/course/${item.course?.id}/test/${item.object_id}`);
      }
    }
  };

  const renderTrackingItem = (item) => {
    const isCourse = item.course_test;
    const title = isCourse ? item.course?.course_name : item.lesson?.lesson_name;
    const description = isCourse ? item.course?.description : item.lesson?.description;
    const score = item.score ? `${item.score.toFixed(2)}/100` : 'Chưa có điểm';

    return (
      <Card key={item.id} className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <div className="mt-2">
              <Tag color={item.status === 1 ? 'success' : 'processing'}>
                {item.status === 1 ? 'Đã hoàn thành' : 'Đang thi'}
              </Tag>
              {item.status === 1 && (
                <Tag color="blue" className="ml-2">
                  Điểm: {score}
                </Tag>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-500 text-sm mb-2">
              <ClockIcon className="mr-1" />
              {new Date(item.created_at).toLocaleDateString()}
            </div>
            {item.status === 0 && (
              <Button 
                type="primary" 
                onClick={() => handleTestClick(item)}
              >
                Tiếp tục thi
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      {contextHolder}
      <div className="mb-8">
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={setFilter}
        >
          {categories.map(category => (
            <Option key={category.value} value={category.value}>
              {category.label}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading courses..." />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <div 
              key={course.id}
              className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div onClick={() => navigate(`/course/${course.id}`)} className="relative cursor-pointer overflow-hidden">
                <img  
                  src={course.img || 'https://files.fullstack.edu.vn/f8-prod/courses/7.png'}
                  alt={course.course_name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>

              <div className="p-4">
                <h3 onClick={() => navigate(`/course/${course.id}`)} className="text-lg cursor-pointer font-semibold text-gray-800 mb-2 truncate">
                  {course.course_name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <Space>
                    <ClockCircleOutlined />
                    <span>Updated: {new Date(course.updated_at).toLocaleDateString()}</span>
                  </Space>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <Empty 
            description={
              <span className="text-gray-500">
                No courses found. Try adjusting your filters or search criteria.
              </span>
            }
          />
        </div>
      )}

      {isLoggedIn && (
        <div className="mt-8">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Bài thi đang làm" key="1">
              {inProgressTests.length > 0 ? (
                inProgressTests.map(renderTrackingItem)
              ) : (
                <Empty description="Bạn chưa có bài thi nào đang làm" />
              )}
            </TabPane>
            <TabPane tab="Bài thi đã hoàn thành" key="2">
              {completedTests.length > 0 ? (
                completedTests.map(renderTrackingItem)
              ) : (
                <Empty description="Bạn chưa hoàn thành bài thi nào" />
              )}
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Home;