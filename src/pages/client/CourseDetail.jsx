import React, { useState, useEffect, useRef } from 'react';
import { Card, Collapse, Button, Space, Divider, Avatar, Spin, message, Progress, Table, Tag } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  PlayCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import testService from '../../services/testService';
import useNotificationStore from '../../stores/useNotificationStore';

const { Panel } = Collapse;

const CourseDetail = () => {
  const [activeLesson, setActiveLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const lessonContentRef = useRef(null);
  const { showError } = useNotificationStore();

  useEffect(() => {
    fetchDataCourseDetail(id);
    const completed = JSON.parse(localStorage.getItem(`completedLessons_${id}`) || '[]');
    setCompletedLessons(completed);
  }, [id]);

  const fetchDataCourseDetail = async (id) => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(id);
      const { course, lessons } = response.data;
      setCourse(course);
      setLessons(lessons);
    } catch (e) {
      showError('Failed to fetch course details');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaData = async (link) => {
    try {
      const response = await courseService.getMedia(link);
      return response; 
    } catch (error) {
      console.error('Failed to fetch media:', error);
      return null;
    }
  };
  const createTestLesson = async (lesson) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const param = {
        id: lesson.id,
        user_id: user.user_id
      };
      const resp = await testService.createTest(param);
      
      if (resp.data && resp.data.test_id) {
        navigate(`/test/${resp.data.test_id}`);
      } else {
        showError('Failed to create test');
      }
    } catch (e) {
      showError('Failed to create test');
      console.error(e);
    }
  };

  const handleLessonClick = async (lesson) => {
    try {
      const videoUrl = await fetchMediaData(lesson.lesson_video);
      const imageUrl = await fetchMediaData(lesson.img);
      setActiveLesson({
        ...lesson,
        lesson_video: videoUrl,
        img: imageUrl
      });
      setTimeout(() => {
        if (lessonContentRef.current) {
          lessonContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch {
      showError('Failed to load lesson media');
    }
  };

  const handleTestClick = (lesson) => {
    createTestLesson(lesson)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Loading course..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-600">Course not found</h2>
        <p className="mt-2">The course you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Course Image and Basic Info */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img 
                              src={`http://localhost:8080/api/media/${course.img}`}

              alt={course.course_name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{course.course_name}</h1>
              <div className="flex items-center space-x-4 text-white">
                <span>Updated: {new Date(course.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-gray-500 mr-2" />
                  <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FileTextOutlined className="text-gray-500 mr-2" />
                  <span>{lessons.length} bài học</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Course Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Giới thiệu khóa học</h2>
        <p className="text-gray-700 mb-4">{course.description}</p>
      </div>

      {/* Lessons List */}
      <div className="mb-8 ">
        <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
        <Table
          columns={[
            {
              title: 'STT',
              dataIndex: 'index',
              key: 'index',
              width: 60,
              render: (_, __, idx) => idx + 1,
            },
            {
              title: 'Tên bài học',
              dataIndex: 'lesson_name',
              key: 'lesson_name',
              render: (text) => (
                <span className="font-semibold">{text}</span>
              ),
            },
            {
              title: 'Mô tả',
              dataIndex: 'description',
              key: 'description',
              ellipsis: true,
            },
            {
              title: 'Trạng thái',
              key: 'status',
              width: 120,
              render: (_, record) => (
                completedLessons.includes(record.id) ? (
                  <Tag color="green">Đã hoàn thành</Tag>
                ) : (
                  <Tag color="blue">Chưa hoàn thành</Tag>
                )
              ),
            },
            {
              title: 'Action',
              key: 'action',
              width: 120,
              render: (_, record) => (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleLessonClick(record)}
                >
                  Xem bài học
                </Button>
              ),
            },
          ]}
          dataSource={lessons}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Không có bài học nào.' }}
          className="bg-white rounded shadow w-full"
        />
      </div>

      {/* Lesson Content (when a lesson is selected) */}
      {activeLesson && (
        <div ref={lessonContentRef} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">{activeLesson.lesson_name}</h3>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            {activeLesson.lesson_video ? (
              <video
                src={activeLesson.lesson_video}
                className="w-full h-full rounded-lg"
                controls
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">No video available</p>
              </div>
            )}
          </div>
          <p className="text-gray-700 mb-6">{activeLesson.description}</p>
          
          <div className="flex justify-end">
            <Button 
              type="primary" 
              icon={<FileTextOutlined />}
              onClick={() => handleTestClick(activeLesson)}
              className="mt-4"
            >
              Làm bài kiểm tra
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
