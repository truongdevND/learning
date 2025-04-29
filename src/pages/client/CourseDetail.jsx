import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Collapse,
  Button,
  Space,
  Divider,
  Avatar,
  Spin,
  message,
  Progress,
  Table,
  Tag,
} from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import testService from "../../services/testService";
import useNotificationStore from "../../stores/useNotificationStore";

const { Panel } = Collapse;

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const lessonContentRef = useRef(null);
  const { showError } = useNotificationStore();

  useEffect(() => {
    fetchDataCourseDetail(id);
    const completed = JSON.parse(
      localStorage.getItem(`completedLessons_${id}`) || "[]"
    );
    setCompletedLessons(completed);
  }, [id]);

  const fetchDataCourseDetail = async (id) => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(id);
      const { course, lessons } = response.data;
      setCourse(course);
      setLessons(lessons);
      // If there are lessons, select the first one by default
      if (lessons && lessons.length > 0) {
        setSelectedLesson(lessons[0]);
      }
    } catch (e) {
      showError("Failed to fetch course details");
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
      console.error("Failed to fetch media:", error);
      return null;
    }
  };

  const createTestLesson = async (lesson) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const param = {
        id: lesson.id,
        user_id: user.user_id,
      };
      const resp = await testService.createTest(param);

      if (resp.data && resp.data.test_id) {
        navigate(`/test/${resp.data.test_id}`);
      } else {
        showError("Failed to create test");
      }
    } catch (e) {
      showError("Failed to create test");
      console.error(e);
    }
  };

  const handleLessonClick = (lesson) => {
    try {
      setSelectedLesson(lesson);
      setTimeout(() => {
        if (lessonContentRef.current) {
          lessonContentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (error) {
      showError("Failed to load lesson");
      console.error(error);
    }
  };

  const handleTestClick = (lesson) => {
    createTestLesson(lesson);
  };

  const markLessonAsComplete = (lessonId) => {
    const newCompletedLessons = [...completedLessons];
    if (!newCompletedLessons.includes(lessonId)) {
      newCompletedLessons.push(lessonId);
      setCompletedLessons(newCompletedLessons);
      localStorage.setItem(
        `completedLessons_${id}`,
        JSON.stringify(newCompletedLessons)
      );
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
    <div className="container mx-auto ">
      {/* Header: Thông tin khóa học và tiến độ */}
      <div className="bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between p-6 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`http://localhost:8080/api/media/${course.img}`}
            alt={course.course_name}
            className="w-28 h-28 object-cover rounded-lg border"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{course.course_name}</h1>
            <div className="text-gray-500 text-sm mb-1">Cập nhật: {new Date(course.updated_at).toLocaleDateString()}</div>
            <div className="text-gray-500 text-sm">Tạo: {new Date(course.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[220px]">
          <div className="text-gray-600 font-medium">{lessons.length} bài học</div>
        </div>
      </div>

      {/* Mô tả khóa học */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Giới thiệu khóa học</h2>
        <p className="text-gray-700 leading-relaxed">{course.description}</p>
      </div>

      {/* Main content: 2 cột */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Danh sách bài học */}
        <div className="md:w-1/3 w-full">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Nội dung khóa học</h2>
            <ul className="divide-y divide-gray-200">
              {lessons.map((lesson, idx) => (
                <li
                  key={lesson.id}
                  className={`py-3 px-2 cursor-pointer rounded transition-all flex items-center gap-2 hover:bg-blue-50 ${selectedLesson && selectedLesson.id === lesson.id ? 'bg-blue-100 border-l-4 border-blue-500 font-semibold' : ''}`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <span className="w-6 text-gray-500">{idx + 1}.</span>
                  <span className="flex-1">{lesson.lesson_name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nội dung bài học */}
        <div className="md:w-2/3 w-full">
          {selectedLesson && (
            <div ref={lessonContentRef} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{selectedLesson.lesson_name}</h3>
              <div className="mb-4 flex flex-col gap-4">
                {selectedLesson.lesson_video && (
                  <div className="aspect-w-16 aspect-h-9">
                    <video
                      src={`http://localhost:8080/api/media/${selectedLesson.lesson_video}`}
                      className="w-full h-full rounded-lg border"
                      controls
                      onEnded={() => markLessonAsComplete(selectedLesson.id)}
                    />
                  </div>
                )}
                {selectedLesson.img && (() => {
                  const isPdf = typeof selectedLesson.img === "string" && selectedLesson.img.toLowerCase().endsWith(".pdf");
                  if (isPdf) {
                    return (
                      <iframe
                        src={`http://localhost:8080/api/media/${selectedLesson.img}`}
                        className="w-full h-[600px] rounded-lg border"
                        title="PDF Viewer"
                      />
                    );
                  }
                  return (
                    <img
                      src={`http://localhost:8080/api/media/${selectedLesson.img}`}
                      alt="Lesson"
                      className="w-full  object-contain rounded-lg border"
                    />
                  );
                })()}
                {/* No media */}
                {!selectedLesson.lesson_video && !selectedLesson.img && (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                    <p className="text-gray-400">Không có media cho bài học này</p>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedLesson.description}</p>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={() => handleTestClick(selectedLesson)}
                >
                  Làm bài kiểm tra
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;