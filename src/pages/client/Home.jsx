import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Empty, Spin, Tabs, Button, Typography } from 'antd';
import { ClockCircleOutlined, ClockCircleOutlined as ClockIcon } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import courseService from '../../services/courseService';
import useNotificationStore from '../../stores/useNotificationStore';
import { message } from 'antd';
import userService from '../../services/userService';
import authService from '../../services/authService';
import testService from '../../services/testService';

const { Title } = Typography;
const { TabPane } = Tabs;

const Home = () => {
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
        const processedData = await Promise.all(response.data.map(async (item) => {
          if (item.status === 0 && (item.id )) {
            const now = new Date();
            const finishedAt = new Date(item.finished_at);
            
            if (now > finishedAt) {
              try {
                const param = {
                  id: item.id,
                  user_id: userId,
                  score: 0
                };
                console.log(item.finished_at);
                
                await testService.submitTest(param);
                return {
                  ...item,
                  status: 2, 
                  score: 0
                };
              } catch (error) {
                console.error('Error updating expired test score:', error);
                return item;
              }
            }
          }
          return item;
        }));
        
        setTrackingData(processedData);
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

  const inProgressTests = trackingData.filter(item => item.status === 0 && (item.lesson_test || item.course_test));
  const completedTests = trackingData.filter(item => (item.status === 1 || item.status === 2) && (item.lesson_test || item.course_test));

  const handleTestClick = (item) => {
    if (item.status === 0) {
     
        navigate(`/test/${item.id}`);
      
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 0:
        return <Tag color="processing">Đang thi</Tag>;
      case 1:
        return <Tag color="success">Đã hoàn thành (Pass)</Tag>;
      case 2:
        return <Tag color="error">Đã hoàn thành (Fail)</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  const renderTestItem = (item) => {
    const isCourseTest = item.course_test;
    const title = isCourseTest ? item.course?.course_name : item.lesson?.lesson_name;
    const description = isCourseTest ? item.course?.description : item.lesson?.description;
    const score = item.score !== null ? `${item.score.toFixed(2)}/100` : 'Chưa có điểm';
    const now = new Date();
    const finishedAt = new Date(item.finished_at);
    const isExpired = now > finishedAt;

    return (
      <Card key={item.id} className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <div className="mt-2">
              {getStatusTag(item.status, item.score)}
              {item.status !== 0 && (
                <Tag color="blue" className="ml-2">
                  Điểm: {score}
                </Tag>
              )}
              {isExpired && item.status === 0 && (
                <Tag color="error" className="ml-2">
                  Đã hết thời gian
                </Tag>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <div>Bắt đầu: {new Date(item.created_at).toLocaleString('vi-VN', { hour12: false })}</div>
              <div>Kết thúc: {new Date(item.finished_at).toLocaleString('vi-VN', { hour12: false })}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-gray-500 text-sm mb-2">
              <ClockIcon className="mr-1" />
              {new Date(item.created_at).toLocaleDateString()}
            </div>
            {item.status === 0 && !isExpired && (
              <Button type="primary" onClick={() => handleTestClick(item)}>
                Tiếp tục thi
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container">
      {contextHolder}
      
      <div className="mb-8">
        <Title level={2}>Khóa học</Title>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading courses..." />
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => (
            <div 
              key={course.id}
              className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div onClick={() => navigate(`/course/${course.id}`)} className="relative cursor-pointer overflow-hidden">
                <img  
                  src={`http://localhost:8080/api/media/${course.img}`}
                 
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
        <div className="mt-8 ">
          <Title level={2} className="mt-8">Bài thi của tôi</Title>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="Bài thi đang làm" key="1" className='h-[700px] overflow-auto'>
              {inProgressTests.length > 0 ? (
                inProgressTests.map(renderTestItem)
              ) : (
                <Empty description="Bạn chưa có bài thi nào đang làm" />
              )}
            </TabPane>
            <TabPane tab="Bài thi đã hoàn thành" key="2" className='h-[700px] overflow-auto' >
              {completedTests.length > 0 ? (
                completedTests.map(renderTestItem)
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