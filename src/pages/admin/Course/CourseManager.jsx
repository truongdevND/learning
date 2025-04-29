import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Space, Typography, Form, Input, Card, Divider, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import courseService from '../../../services/courseService';
import CourseModal from '../../../components/CourseModal';
import LessonModal from '../../../components/LessonModal';
import useNotificationStore from "../../../stores/useNotificationStore";
import AssignLessonModal from '../../../components/AssignLessonModal';

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
  const [lessonForm] = Form.useForm();
  const [submittingLesson, setSubmittingLesson] = useState(false);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });
  const [deletingItem, setDeletingItem] = useState(false);

  const [lessonOptions, setLessonOptions] = useState([]);
  const [selectedLessonIds, setSelectedLessonIds] = useState([]);

  const [isAssignLessonModalVisible, setIsAssignLessonModalVisible] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchDebounceRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);

  // Filtered courses based on search text
  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchText.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Debounce searchText
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchText]);

  useEffect(() => {
    fetchCourses({ page: currentPage - 1, pageSize, key: debouncedSearchText });
  }, [debouncedSearchText, currentPage, pageSize]);

  const fetchCourses = async (param = {}) => {
    setLoading(true);
    try {
      const res = await courseService.getCourses(param);
      setCourses(res.data?.courses || []);
      setTotalCourses(res.data?.total || 0);
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

  const showCreateCourseModal = async () => {
    courseForm.resetFields();
    setCourseModalType('create');
    setIsCourseModalVisible(true);
    try {
      const res = await courseService.getLession({ page: 0, pageSize: 1000 });
      const options = (res.data?.lessons || []).map(lesson => ({
        label: lesson.lesson_name,
        value: lesson.id,
      }));
      setLessonOptions(options);
      setSelectedLessonIds([]);
      courseForm.setFieldsValue({ lesson_ids: [] });
    } catch {
      setLessonOptions([]);
      setSelectedLessonIds([]);
    }
  };

  const showEditCourseModal = async (course) => {
    courseForm.setFieldsValue({
      course_name: course.course_name,
      description: course.description,
      media: course.img,
    });
    setCourseModalType('edit');
    setIsCourseModalVisible(true);

    try {
      const res = await courseService.getLession({ page: 0, pageSize: 1000 });
      const options = (res.data?.lessons || []).map(lesson => ({
        label: lesson.lesson_name,
        value: lesson.id,
      }));
      setLessonOptions(options);

      const detail = await courseService.getCourseById(course.id);
      const assignedIds = (detail.data?.lessons || []).map(l => l.id);
      setSelectedLessonIds(assignedIds);
      courseForm.setFieldsValue({ lesson_ids: assignedIds });
    } catch {
      setLessonOptions([]);
      setSelectedLessonIds([]);
    }
  };

  const handleCourseCancel = () => {
    setIsCourseModalVisible(false);
  };

  const handleCourseSubmit = async (values) => {
    setSubmittingCourse(true);
    try {
      if (courseModalType === 'create') {
        await courseService.createCourse(values);
        fetchCourses();
        showSuccess("Tạo khóa học mới thành công!");
      } else if (courseModalType === 'edit') {
        await courseService.updateCourse(selectedCourse, values);
        await courseService.updateCoursAssignLesson(selectedCourse, values.lesson_ids);
        setCourses(courses.map(c => c.id === selectedCourse ? { ...c, ...values } : c));
        if (courseDetail && courseDetail.id === selectedCourse) {
          setCourseDetail({ ...courseDetail, ...values });
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

  const handleLessonCancel = () => {
    setIsLessonModalVisible(false);
  };

  const handleLessonSubmit = async (values) => {
    setSubmittingLesson(true);
    try {
      if (lessonModalType === 'create') {
        const lessonData = {
          ...values
        };
        const res = await courseService.createLesson(lessonData);
        const newLesson = res.data || res;
        
        if (courseDetail) {
          const updatedLessons = [...(courseDetail.lessons || []), newLesson];
          setCourseDetail({...courseDetail, lessons: updatedLessons});
        }
        if (selectedCourse && newLesson.id) {
          await courseService.updateCoursAssignLesson(selectedCourse, [newLesson.id]);
        }
        showSuccess("Tạo bài học mới thành công!");
      }
      setIsLessonModalVisible(false);
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
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center gap-4">
          <Title level={2} className="m-0">Quản lý khóa học</Title>
          <Input.Search
            placeholder="Tìm kiếm khóa học..."
            allowClear
            value={searchText}
            onChange={e => {
              setSearchText(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            style={{ width: 300 }}
            className="ml-4"
          />
        </div>
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
        dataSource={filteredCourses} 
        loading={loading}
        rowKey="id"
        rowClassName={(record) => record.id === selectedCourse ? 'bg-blue-50' : ''}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: 'cursor-pointer mr-5'
        })}
        className="bg-white   p-6 "
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCourses,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showTotal: (total) => `Tổng ${total} khóa học`,
        }}
      />

      {selectedCourse && (
        <Card 
          title={<div className="flex items-center mt-6 justify-between mb-0">
            <Title level={4} className="mb-0">Chi tiết khóa học</Title>
            <div className="flex gap-2">
              <Button
                type="default"
                onClick={() => setIsAssignLessonModalVisible(true)}
              >
                Gán bài học
              </Button>
            </div>
          </div>}
          className="mt-8 shadow-md"
          loading={detailLoading}
        >
          {courseDetail && (
            <div className="">
              <div className='flex gap-4'>
                <img className='w-[200px] h-full object-center'     src={`http://localhost:8080/api/media/${courseDetail.course.img}`} alt="" />
                <div>
                <Title level={4} className="mb-2">{courseDetail.course.course_name}</Title>
                <Paragraph className="text-gray-600">{courseDetail.course.description}</Paragraph>
                </div>
               
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
                  ]}
                  dataSource={courseDetail.lessons || []}
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: 'Không có bài học nào.' }}
                  className="bg-white "
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
        lessonOptions={lessonOptions}
        selectedLessonIds={selectedLessonIds}
        onLessonChange={ids => {
          setSelectedLessonIds(ids);
          courseForm.setFieldsValue({ lesson_ids: ids });
        }}
      />

      <LessonModal
        visible={isLessonModalVisible}
        form={lessonForm}
        loading={submittingLesson}
        onCancel={handleLessonCancel}
        onSubmit={handleLessonSubmit}
      />

      <AssignLessonModal
        visible={isAssignLessonModalVisible}
        onCancel={() => setIsAssignLessonModalVisible(false)}
        courseId={selectedCourse}
        onSuccess={() => {
          setIsAssignLessonModalVisible(false);
          // Sau khi gán xong, reload lại chi tiết khóa học
          if (selectedCourse) handleRowClick({ id: selectedCourse });
        }}
      />
    </div>
  );
}

export default CourseManager;