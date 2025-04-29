import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Form, Card, Divider, Modal, Tag, Collapse, Avatar, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilePdfOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import courseService from '../../services/courseService';
import LessonModal from '../../components/LessonModal';
import useNotificationStore from "../../stores/useNotificationStore";
import { QuestionPayload, QuestionDetail, QuestionAnswer } from '../../QuestionModel';
import TestModal from '../../components/TestModal';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

function LessonManager() {
  const { showSuccess, showError } = useNotificationStore();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonDetail, setLessonDetail] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [lessonModalType, setLessonModalType] = useState('create');
  const [lessonForm] = Form.useForm();
  const [submittingLesson, setSubmittingLesson] = useState(false);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingItem, setDeletingItem] = useState(false);

  const [lessonPage, setLessonPage] = useState(1);
  const [lessonPageSize, setLessonPageSize] = useState(10);
  const [lessonTotal, setLessonTotal] = useState(0);
  
  const [questionPage, setQuestionPage] = useState(1);
  const [questionPageSize, setQuestionPageSize] = useState(10);
  const [questionTotal, setQuestionTotal] = useState(0);

  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [testModalType, setTestModalType] = useState('create');
  const [testForm] = Form.useForm();
  const [submittingTest, setSubmittingTest] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isDeleteQuestionModalVisible, setIsDeleteQuestionModalVisible] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchDebounceRef = React.useRef();

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchText]);

  useEffect(() => {
    fetchLessons(1, lessonPageSize, debouncedSearchText);
    setLessonPage(1);
  }, [debouncedSearchText]);

  const fetchLessons = async (page = lessonPage, pageSize = lessonPageSize ,key) => {
    setLoading(true);
    try {
      const res = await courseService.getLession({ page: page - 1, pageSize,key });
      setLessons(res.data?.lesson_list || []);
      setLessonTotal(res.data?.total || 0);
    } catch {
      showError("Không thể tải danh sách bài học");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (lessonId, page = questionPage, pageSize = questionPageSize) => {
    try {
      const qRes = await courseService.getQuestion(lessonId, page - 1, pageSize);
      // Sử dụng cấu trúc dữ liệu mới
      setQuestions(qRes?.data?.questions || []);
      setQuestionTotal(qRes?.data?.total_elements || 0);
      setLessonDetail(lessons.find(l => l.id === lessonId));
      setQuestionPage(page);
      setQuestionPageSize(pageSize);
    } catch {
      showError("Không thể tải danh sách câu hỏi");
      setQuestions([]);
    }
  };

  const handleRowClick = (lesson) => {
    setSelectedLesson(lesson.id);
    setDetailLoading(true);
    try {
      fetchQuestions(lesson.id, 1, questionPageSize);
    } catch {
      showError("Không thể tải chi tiết bài học hoặc câu hỏi");
      setLessonDetail(null);
      setQuestions([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    setItemToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    setDeletingItem(true);
    try {
      const rep = await courseService.deleteLesson(itemToDelete);
      if (rep && rep.code === 200) {
        if (selectedLesson === itemToDelete) {
          setSelectedLesson(null);
          setLessonDetail(null);
          setQuestions([]);
        }
        showSuccess("Xóa bài học thành công!");
        fetchLessons();
      } else {
        showError("Xóa bài học thất bại!");
      }
    } catch {
      showError("Xóa bài học thất bại!");
    } finally {
      setDeletingItem(false);
      setIsDeleteModalVisible(false);
      setItemToDelete(null);
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
      img: lesson.img,
      lesson_video: lesson.lesson_video,
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
      let payload = {
        lesson_name: values.lesson_name,
        description: values.description,
        img: values.img,
        video: values.video,
      };
      if (lessonModalType === 'create') {
        await courseService.createLesson(payload);
        fetchLessons();
        showSuccess("Tạo bài học mới thành công!");
      } else if (lessonModalType === 'edit') {
        await courseService.updateLesson(selectedLesson, payload);
        setLessons(lessons.map(l => l.id === selectedLesson ? { ...l, ...payload, lesson_name: values.lesson_name } : l));
        if (lessonDetail && lessonDetail.id === selectedLesson) {
          setLessonDetail({ ...lessonDetail, ...payload, lesson_name: values.lesson_name });
        }
        showSuccess("Cập nhật bài học thành công!");
      }
      setIsLessonModalVisible(false);
      setSelectedLesson(null);
    } catch {
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
      width: 80,
    },
    {
      title: 'Tên bài học',
      dataIndex: 'lesson_name',
      key: 'lesson_name',
      width: 250,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Ảnh',
      dataIndex: 'img',
      key: 'img',
      width: 100,
      render: (img) => img ? (
        img.endsWith('.pdf') ? (
          <FilePdfOutlined style={{ fontSize: 24, color: 'red' }} />
        ) : (
          <img src={`http://localhost:8080/api/media/${img}`} alt="img" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: '4px' }} />
        )
      ) : null,
    },
    {
      title: 'Video',
      dataIndex: 'lesson_video',
      key: 'lesson_video',
      width: 100,
      render: (lesson_video) => lesson_video ? <Button type="link" target="_blank" href={`http://localhost:8080/api/media/${lesson_video}`}>Xem video</Button> : null,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            className="bg-yellow-500 hover:bg-yellow-600"
            onClick={(e) => {
              e.stopPropagation();
              showEditLessonModal(record);
            }}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              showDeleteConfirm(record.id);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Render câu hỏi theo cấu trúc mới
  const renderQuestion = (question, index) => {
    return (
      <Card 
        key={question.id} 
        className="mb-4 shadow-sm hover:shadow-md transition-shadow"
        bordered={false}
      >
        <div className="flex items-start gap-3">
          <Avatar 
            shape="square"
            size={40}
            className="flex-shrink-0 bg-blue-500 mt-1"
          >
            {index + 1}
          </Avatar>
          <div className="flex-grow">
            <Space direction="vertical" className="w-full">
              <div className="flex flex-col ">
              {question.image_url && (
                  <img 
                    src={`http://localhost:8080/api/media/${question.image_url}`} 
                    alt="Hình minh hoạ" 
                    className="max-w-[200px] mb-4 object-contain rounded"
                  />
                )}
                <Title level={5} className="mb-2">
               
                  <QuestionCircleOutlined className="mr-2 text-blue-500" /> 
                  {question.question}
                </Title>
               
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <Title level={5} className="text-gray-600 mb-2">Đáp án:</Title>
                <div className="grid gap-2">
                  {question.answers.map(answer => (
                    <div 
                      key={answer.id} 
                      className={`p-2 rounded border flex items-center ${answer.correct ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                    >
                      {answer.correct ? (
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                      ) : (
                        <CloseCircleOutlined className="text-gray-400 mr-2" />
                      )}
                      <Text className={answer.correct ? 'font-medium' : ''}>
                        {answer.answer_text}
                      </Text>
                      {answer.correct && (
                        <Tag color="success" className="ml-2">Đáp án đúng</Tag>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

 
  const showCreateTestModal = () => {
    testForm.resetFields();
    setTestModalType('create');
    setIsTestModalVisible(true);
    setSelectedQuestion(null);
  };
 
  const showEditTestModal = (question) => {
    setSelectedQuestion(question);
    testForm.setFieldsValue({
      question: question.question,
      img: question.image_url,
      questionAnswers: question.answers.map(a => ({ answer: a.answer_text, isCollect: a.correct }))
    });
    setTestModalType('edit');
    setIsTestModalVisible(true);
  };

  const handleTestCancel = () => {
    setIsTestModalVisible(false);
    setSelectedQuestion(null);
  };

  const handleTestSubmit = async (values) => {
    setSubmittingTest(true);
    let payload;
    // Đảm bảo img luôn là chuỗi, nếu không có thì truyền ''
    const imgValue = values.img ? values.img : '';
    if (testModalType === 'create') {
      payload = {
        question_details: [
          {
            question: values.question,
            img: imgValue,
            question_answers: values.questionAnswers.map(a => ({ answer: a.answer, is_collect: !!a.isCollect }))
          }
        ]
      };
    } else if (testModalType === 'edit' && selectedQuestion) {
      payload = {
        questions: [
          {
            id: selectedQuestion.id,
            question: values.question,
            img: imgValue,
            answers: values.questionAnswers.map((a, idx) => ({
              id: selectedQuestion.answers?.[idx]?.id,
              answer: a.answer,
              correct: !!a.isCollect
            }))
          }
        ]
      };
    }
    try {
      if (testModalType === 'create') {
        await courseService.createQuestion(selectedLesson, payload);
        showSuccess('Thêm câu hỏi thành công!');
      } else if (testModalType === 'edit' && selectedQuestion) {
        await courseService.updateQuestion(selectedLesson, payload);
        showSuccess('Cập nhật câu hỏi thành công!');
      }
      setIsTestModalVisible(false);
      fetchQuestions(selectedLesson, questionPage, questionPageSize);
    } catch {
      showError(testModalType === 'create' ? 'Thêm câu hỏi thất bại!' : 'Cập nhật câu hỏi thất bại!');
    } finally {
      setSubmittingTest(false);
    }
  };
  const showDeleteQuestionConfirm = (question) => {
    setQuestionToDelete(question);
    setIsDeleteQuestionModalVisible(true);
  };
  const handleCancelDeleteQuestion = () => {
    setIsDeleteQuestionModalVisible(false);
    setQuestionToDelete(null);
  };
  const handleConfirmDeleteQuestion = async () => {
    setDeletingQuestion(true);
    try {
      await courseService.deleteLQuestion(questionToDelete.id);
      showSuccess('Xóa câu hỏi thành công!');
      fetchQuestions(selectedLesson, questionPage, questionPageSize);
    } catch {
      showError('Xóa câu hỏi thất bại!');
    } finally {
      setDeletingQuestion(false);
      setIsDeleteQuestionModalVisible(false);
      setQuestionToDelete(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Title level={2} className="m-0">Quản lý bài học</Title>
          <Input.Search
            placeholder="Tìm kiếm bài học..."
            allowClear
            value={searchText}
            onChange={e => {
              setSearchText(e.target.value);
            }}
            style={{ width: 300 }}
            className="ml-4"
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={showCreateLessonModal}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tạo mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={lessons} 
        loading={loading}
        rowKey="id"
        rowClassName={(record) => record.id === selectedLesson ? 'bg-blue-50' : ''}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: 'cursor-pointer hover:bg-gray-50'
        })}
        className="bg-white p-5 rounded-lg shadow"
        pagination={{
          current: lessonPage,
          pageSize: lessonPageSize,
          total: lessonTotal,
          onChange: (page, pageSize) => {
            setLessonPage(page);
            setLessonPageSize(pageSize);
            fetchLessons(page, pageSize);
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bài học`
        }}
      />

      {selectedLesson && (
        <Card
          title={
            <div className="flex items-center justify-between">
              <Space>
                <Title level={4} className="mb-0">Question</Title>
               
              </Space>
             
            </div>
          }
          className="mt-8 shadow-md rounded-lg"
          loading={detailLoading}
        >
          {lessonDetail && (
            <div>
              <div className="flex gap-6">
                {lessonDetail.img && (
                  <div className="flex-shrink-0">
                    {lessonDetail.img.endsWith('.pdf') ? (
                      <a 
                        href={`http://localhost:8080/api/media/${lessonDetail.img}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <FilePdfOutlined style={{ fontSize: 64, color: 'red' }} />
                        <Text className="mt-2">Xem PDF</Text>
                      </a>
                    ) : (
                        <div>
                              <img 
                        className="w-[240px] h-auto object-cover rounded-lg border shadow-sm" 
                        src={`http://localhost:8080/api/media/${lessonDetail.img }`} 
                        alt={lessonDetail.lesson_name} 
                      />
                        </div> 

                    
                    )}
                    {lessonDetail.lesson_video&&(
                         <Button
                         type="link"
                         href={`http://localhost:8080/api/media/${lessonDetail.lesson_video}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="px-0"
                       >
                         Xem video bài học
                       </Button>
                    )}
                  </div>
                )}
                <div className="flex-grow">
                  <Title level={3} className="mb-2">{lessonDetail.lesson_name}</Title>
                  <Paragraph className="text-gray-600 whitespace-pre-line">{lessonDetail.description}</Paragraph>
                  {lessonDetail.video && (
                    <div className="mt-4">
                      <Button
                        type="link"
                        href={`http://localhost:8080/api/media/${lessonDetail.video}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-0"
                        style={{padding: 0}}
                      >
                        Xem video bài học
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <Divider />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Title level={4} className="mb-0">Danh sách câu hỏi</Title>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showCreateTestModal} className="bg-blue-500 hover:bg-blue-600">
                      Thêm câu hỏi
                    </Button>
                    <Text className="text-gray-500">{`Hiển thị ${questions.length} / ${questionTotal} câu hỏi`}</Text>
                  </Space>
                </div>

                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="relative group">
                        {renderQuestion(question, index)}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button size="small" icon={<EditOutlined />} onClick={() => showEditTestModal(question)} className="bg-yellow-500 hover:bg-yellow-600" />
                          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => showDeleteQuestionConfirm(question)} />
                        </div>
                      </div>
                    ))}
                    
                    {questionTotal > questionPageSize && (
                      <div className="flex justify-center mt-6">
                        <Button.Group>
                          <Button 
                            disabled={questionPage === 1}
                            onClick={() => fetchQuestions(selectedLesson, questionPage - 1, questionPageSize)}
                          >
                            Trang trước
                          </Button>
                          <Button disabled>
                            {`Trang ${questionPage} / ${Math.ceil(questionTotal / questionPageSize)}`}
                          </Button>
                          <Button 
                            disabled={questionPage >= Math.ceil(questionTotal / questionPageSize)}
                            onClick={() => fetchQuestions(selectedLesson, questionPage + 1, questionPageSize)}
                          >
                            Trang sau
                          </Button>
                        </Button.Group>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <QuestionCircleOutlined style={{ fontSize: 48 }} className="text-gray-300 mb-4" />
                    <Text className="text-gray-500">Không có câu hỏi nào cho bài học này</Text>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      <Modal
        title={`Xác nhận xóa bài học`}
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
        <p>Bạn có chắc chắn muốn xóa bài học này? Tất cả câu hỏi liên quan cũng sẽ bị xóa.</p>
      </Modal>

      <LessonModal
        visible={isLessonModalVisible}
        type={lessonModalType}
        form={lessonForm}
        loading={submittingLesson}
        onCancel={handleLessonCancel}
        onSubmit={handleLessonSubmit}
      />

      <TestModal
        visible={isTestModalVisible}
        type={testModalType}
        form={testForm}
        loading={submittingTest}
        onCancel={handleTestCancel}
        onSubmit={handleTestSubmit}
      />

      <Modal
        title={`Xác nhận xóa câu hỏi`}
        open={isDeleteQuestionModalVisible}
        onCancel={handleCancelDeleteQuestion}
        footer={[
          <Button key="cancel" onClick={handleCancelDeleteQuestion}>
            Hủy
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger 
            loading={deletingQuestion}
            onClick={handleConfirmDeleteQuestion}
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa câu hỏi này?</p>
      </Modal>
    </div>
  );
}

export default LessonManager;