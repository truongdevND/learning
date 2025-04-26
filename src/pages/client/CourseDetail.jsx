import React, { useState, useEffect } from "react";
import {
  Card,
  Collapse,
  Button,
  Space,
  Divider,
  Avatar,
  Spin,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import courseService from "../../services/courseService";

const { Panel } = Collapse;

const CourseDetail = () => {
  const [activeLesson, setActiveLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchDataCourseDetail(id);
  }, [id]);

  const fetchDataCourseDetail = async (id) => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(id);
      const { course, lessons } = response.data;
      setCourse(course);
      setLessons(lessons);
    } catch (e) {
      message.error("Failed to fetch course details");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaData = async (link) => {
    try {
      const response = await courseService.getMedia(link);
      return response; // Assuming the response contains a url field
    } catch (error) {
      console.error("Failed to fetch media:", error);
      return null;
    }
  };

  const handleLessonClick = async (lesson) => {
    try {
      const videoUrl = await fetchMediaData(lesson.lesson_video);
      const imageUrl = await fetchMediaData(lesson.img);
      setActiveLesson({
        ...lesson,
        lesson_video: videoUrl,
        img: imageUrl,
      });
    } catch (error) {
      message.error("Failed to load lesson media");
    }
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
        <p className="mt-2">
          The course you're looking for doesn't exist or has been removed.
        </p>
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
              src={
                course.img ||
                "https://files.fullstack.edu.vn/f8-prod/courses/7.png"
              }
              alt={course.course_name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {course.course_name}
              </h1>
              <div className="flex items-center space-x-4 text-white">
                <span>
                  Updated: {new Date(course.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">Free</span>
                <Button type="primary" size="large">
                  Đăng ký học
                </Button>
              </div>

              <Divider />

              <div className="space-y-2">
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-gray-500 mr-2" />
                  <span>
                    Created: {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileTextOutlined className="text-gray-500 mr-2" />
                  <span>{lessons.length} bài học</span>
                </div>
              </div>

              <Divider />

              <div className="flex items-center space-x-4">
                <Avatar size={64} icon={<UserOutlined />} />
                <div>
                  <h3 className="font-semibold">Instructor</h3>
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
        <Collapse accordion>
          {lessons.map((lesson) => (
            <Panel
              key={lesson.id}
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PlayCircleOutlined className="text-blue-500 mr-2" />
                    <span>{lesson.lesson_name}</span>
                  </div>
                </div>
              }
            >
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-4">{lesson.description}</p>
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
          <p className="text-gray-700">{activeLesson.description}</p>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
