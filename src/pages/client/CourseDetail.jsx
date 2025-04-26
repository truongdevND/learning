import React, { useState } from 'react';
import { Card, Collapse, Rate, Tag, Button, Space, Divider, Avatar } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  PlayCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  StarOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;

const CourseDetail = () => {
  const [activeLesson, setActiveLesson] = useState(null);

  // Dummy data for course
  const course = {
    id: 1,
    title: 'Lập trình ReactJS từ cơ bản đến nâng cao',
    image: 'https://picsum.photos/800/400',
    description: 'Khóa học ReactJS toàn diện từ cơ bản đến nâng cao, giúp bạn trở thành một React Developer chuyên nghiệp. Học cách xây dựng các ứng dụng web hiện đại với React, Redux, và các công nghệ liên quan.',
    instructor: {
      name: 'Nguyễn Văn A',
      avatar: 'https://picsum.photos/100/100',
      rating: 4.8,
      students: 10000
    },
    duration: '12 giờ',
    students: 1200,
    rating: 4.5,
    price: '1.200.000đ',
    category: 'web',
    tags: ['React', 'JavaScript', 'Frontend'],
    lessons: [
      {
        id: 1,
        title: 'Giới thiệu về ReactJS',
        duration: '45 phút',
        completed: true,
        content: 'Tìm hiểu về ReactJS, lịch sử phát triển và các khái niệm cơ bản.',
        videoUrl: 'https://example.com/video1'
      },
      {
        id: 2,
        title: 'Cài đặt môi trường và Hello World',
        duration: '30 phút',
        completed: true,
        content: 'Hướng dẫn cài đặt Node.js, npm và tạo ứng dụng React đầu tiên.',
        videoUrl: 'https://example.com/video2'
      },
      {
        id: 3,
        title: 'Components và Props',
        duration: '60 phút',
        completed: false,
        content: 'Tìm hiểu về Components, cách tạo và sử dụng Props trong React.',
        videoUrl: 'https://example.com/video3'
      },
      {
        id: 4,
        title: 'State và Lifecycle',
        duration: '45 phút',
        completed: false,
        content: 'Quản lý state và lifecycle methods trong React components.',
        videoUrl: 'https://example.com/video4'
      },
      {
        id: 5,
        title: 'Hooks trong React',
        duration: '90 phút',
        completed: false,
        content: 'Tìm hiểu về React Hooks: useState, useEffect, useContext, và custom hooks.',
        videoUrl: 'https://example.com/video5'
      }
    ]
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
  };

  return (
    <div className="">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Course Image and Basic Info */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <div className="flex items-center space-x-4 text-white">
                <Rate disabled defaultValue={course.rating} allowHalf />
                <span>({course.rating})</span>
                <span>{course.students} học viên</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                <Button type="primary" size="large">Đăng ký học</Button>
              </div>
              
              <Divider />
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-gray-500 mr-2" />
                  <span>Thời lượng: {course.duration}</span>
                </div>
                <div className="flex items-center">
                  <FileTextOutlined className="text-gray-500 mr-2" />
                  <span>{course.lessons.length} bài học</span>
                </div>
                <div className="flex items-center">
                  <StarOutlined className="text-gray-500 mr-2" />
                  <span>Trình độ: Trung cấp</span>
                </div>
              </div>

              <Divider />

              <div className="flex items-center space-x-4">
                <Avatar size={64} src={course.instructor.avatar} />
                <div>
                  <h3 className="font-semibold">{course.instructor.name}</h3>
                  <div className="flex items-center">
                    <Rate disabled defaultValue={course.instructor.rating} allowHalf size="small" />
                    <span className="ml-2 text-sm text-gray-600">
                      ({course.instructor.students} học viên)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Course Description and Tags */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Giới thiệu khóa học</h2>
        <p className="text-gray-700 mb-4">{course.description}</p>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag, index) => (
            <Tag key={index} color="blue">{tag}</Tag>
          ))}
        </div>
      </div>

      {/* Lessons List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
        <Collapse accordion>
          {course.lessons.map((lesson) => (
            <Panel
              key={lesson.id}
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {lesson.completed ? (
                      <CheckCircleOutlined className="text-green-500 mr-2" />
                    ) : (
                      <PlayCircleOutlined className="text-blue-500 mr-2" />
                    )}
                    <span>{lesson.title}</span>
                  </div>
                  <span className="text-gray-500">{lesson.duration}</span>
                </div>
              }
            >
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-4">{lesson.content}</p>
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleLessonClick(lesson)}
                >
                  Xem bài học
                </Button>
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>

      {/* Lesson Content (when a lesson is selected) */}
      {activeLesson && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">{activeLesson.title}</h3>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <iframe
              src={activeLesson.videoUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
          <p className="text-gray-700">{activeLesson.content}</p>
        </div>
      )}
    </div>
  );
};

export default CourseDetail; 