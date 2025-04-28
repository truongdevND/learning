import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Form, Input, Card, Divider, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import courseService from '../../../services/courseService';
import CourseModal from '../../../components/CourseModal';
import LessonModal from '../../../components/LessonModal';
import useNotificationStore from "../../../stores/useNotificationStore";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function CourseManager() {
  const { showSuccess, showError } = useNotificationStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [courseModalType, setCourseModalType] = useState('create');
  const [courseForm] = Form.useForm();
  const [submittingCourse, setSubmittingCourse] = useState(false);
  
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [lessonModalType, setLessonModalType] = useState('create');
  const [lessonForm] = Form.useForm();
  const [submittingLesson, setSubmittingLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });
  const [deletingItem, setDeletingItem] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourses();
      setCourses(res.data?.courses || []);
    } catch {
      console.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (course) => {
    setSelectedCourse(course.id);
    setDetailLoading(true);
    try {
      const res = await courseService.getCourseById(course.id);
      setCourseDetail(res.data || res);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      setCourseDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const showDeleteConfirm = (id, type = 'course') => {
    setItemToDelete({ id, type });
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setItemToDelete({ id: null, type: null });
  };

  const handleConfirmDelete = async () => {
    setDeletingItem(true);
    try {
      if (itemToDelete.type === 'course') {
        await courseService.deleteCourse(itemToDelete.id);
        setCourses((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        if (selectedCourse === itemToDelete.id) {
          setSelectedCourse(null);
          setCourseDetail(null);
        }
        showSuccess("Xóa khóa học thành công!");
      } else if (itemToDelete.type === 'lesson') {
        await courseService.deleteLesson(itemToDelete.id);
        
        if (courseDetail) {
          const updatedLessons = courseDetail.lessons.filter(lesson => lesson.id !== itemToDelete.id);
          setCourseDetail({...courseDetail, lessons: updatedLessons});
        }
        showSuccess("Xóa bài học thành công!");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      showError(itemToDelete.type === 'course' ? "Xóa khóa học thất bại!" : "Xóa bài học thất bại!");
    } finally {
      setDeletingItem(false);
      setIsDeleteModalVisible(false);
      setItemToDelete({ id: null, type: null });
    }
  };

  const showCreateCourseModal = () => {
    courseForm.resetFields();
    setCourseModalType('create');
    setIsCourseModalVisible(true);
  };

  const showEditCourseModal = (course) => {
    courseForm.setFieldsValue({
      course_name: course.course_name,
      description: course.description,
    });
    setCourseModalType('edit');
    setIsCourseModalVisible(true);
  };

  const handleCourseCancel = () => {
    setIsCourseModalVisible(false);
  };

  const handleCourseSubmit = async (values) => {
    setSubmittingCourse(true);
    try {
      if (courseModalType === 'create') {
         await courseService.createCourse(values);
        fetchCourses()
        showSuccess("Tạo khóa học mới thành công!");
      } else if (courseModalType === 'edit') {
        await courseService.updateCourse(selectedCourse, values);
        setCourses(courses.map(c => c.id === selectedCourse ? {...c, ...values} : c));
        if (courseDetail && courseDetail.id === selectedCourse) {
          setCourseDetail({...courseDetail, ...values});
        }
        showSuccess("Cập nhật khóa học thành công!");
      }
      setIsCourseModalVisible(false);
    } catch (error) {
      console.error("Failed to submit course:", error);
      showError(courseModalType === 'create' ? 'Tạo khóa học thất bại!' : 'Cập nhật khóa học thất bại!');
    } finally {
      setSubmittingCourse(false);
    }
  };

  const showCreateLessonModal = () => {
    lessonForm.resetFields();
    setLessonModalType('create');
    setIsLessonModalVisible(true);
  };

  const showEditLessonModal = (lesson) => {
    setSelectedLesson(lesson.id);
    lessonForm.setFieldsValue({
      lesson_name: lesson.lesson_name,
      description: lesson.description,
    });
    setLessonModalType('edit');
    setIsLessonModalVisible(true);
  };

  const handleLessonCancel = () => {
    setIsLessonModalVisible(false);
    setSelectedLesson(null);
  };

  const handleLessonSubmit = async (values) => {
    setSubmittingLesson(true);
    try {
      if (lessonModalType === 'create') {
        const lessonData = {
          ...values,
          course_id: selectedCourse
        };
        const res = await courseService.createLesson(lessonData);
        const newLesson = res.data || res;
        
        if (courseDetail) {
          const updatedLessons = [...(courseDetail.lessons || []), newLesson];
          setCourseDetail({...courseDetail, lessons: updatedLessons});
        }
        
        showSuccess("Tạo bài học mới thành công!");
      } else if (lessonModalType === 'edit') {
        await courseService.updateLesson(selectedLesson, values);
        if (courseDetail) {
          const updatedLessons = courseDetail.lessons.map(lesson => 
            lesson.id === selectedLesson ? {...lesson, ...values} : lesson
          );
          setCourseDetail({...courseDetail, lessons: updatedLessons});
        }
        showSuccess("Cập nhật bài học thành công!");
      }
      setIsLessonModalVisible(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error("Failed to submit lesson:", error);
      showError(lessonModalType === 'create' ? 'Tạo bài học thất bại!' : 'Cập nhật bài học thất bại!');
    } finally {
      setSubmittingLesson(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            className="bg-yellow-500 hover:bg-yellow-600"
            onClick={(e) => {
              e.stopPropagation();
              showEditCourseModal(record);
              setSelectedCourse(record.id);
            }}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              showDeleteConfirm(record.id, 'course');
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className="m-0">Quản lý khóa học</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={showCreateCourseModal}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tạo mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={courses} 
        loading={loading}
        rowKey="id"
        rowClassName={(record) => record.id === selectedCourse ? 'bg-blue-50' : ''}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: 'cursor-pointer'
        })}
        className="bg-white rounded shadow"
      />

      {selectedCourse && (
        <Card 
          title={<div className="flex items-center justify-between mb-0">
            <Title level={4} className="mb-0">Chi tiết khóa học</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="middle"
              onClick={showCreateLessonModal}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Thêm bài học
            </Button>
          </div>}
          className="mt-8 shadow-md"
          loading={detailLoading}
        >
          {courseDetail && (
            <div className="">
              <div>
                <Title level={4} className="mb-2">{courseDetail.course_name}</Title>
                <Paragraph className="text-gray-600">{courseDetail.description}</Paragraph>
              </div>
              <Divider />
              <div>
                <Title level={5} className="mb-4">Danh sách bài học</Title>
                <Table
                  columns={[
                    {
                      title: 'ID',
                      dataIndex: 'id',
                      key: 'id',
                      width: 80,
                    },
                    {
                      title: 'Tên bài học',
                      dataIndex: 'lesson_name',
                      key: 'lesson_name',
                      width: 200, 
                    },
                    {
                      title: 'Mô tả',
                      dataIndex: 'description',
                      key: 'description',
                      ellipsis: true,
                      width: 300, 
                    },
                    {
                      title: 'Action',
                      key: 'action',
                      render: (_, record) => (
                        <Space size="small">
                          <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            className="bg-yellow-500 hover:bg-yellow-600"
                            onClick={e => {
                              e.stopPropagation();
                              showEditLessonModal(record);
                            }}
                          >
                            Sửa
                          </Button>
                          <Button 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={e => {
                              e.stopPropagation();
                              showDeleteConfirm(record.id, 'lesson');
                            }}
                          >
                            Xóa
                          </Button>
                        </Space>
                      ),
                      width: 100,
                    },
                  ]}
                  dataSource={courseDetail.lessons || []}
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: 'Không có bài học nào.' }}
                  className="bg-white rounded shadow w-full"
                />
              </div>
            </div>
          )}
        </Card>
      )}

      
      <Modal
        title={`Xác nhận xóa ${itemToDelete.type === 'course' ? 'khóa học' : 'bài học'}`}
        open={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Hủy
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger 
            loading={deletingItem}
            onClick={handleConfirmDelete}
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa {itemToDelete.type === 'course' ? 'khóa học' : 'bài học'} này?</p>
      </Modal>

      <CourseModal
        visible={isCourseModalVisible}
        type={courseModalType}
        form={courseForm}
        loading={submittingCourse}
        onCancel={handleCourseCancel}
        onSubmit={handleCourseSubmit}
      />

      <LessonModal
        visible={isLessonModalVisible}
        type={lessonModalType}
        form={lessonForm}
        loading={submittingLesson}
        onCancel={handleLessonCancel}
        onSubmit={handleLessonSubmit}
      />
    </div>
  );
}

export default CourseManager;