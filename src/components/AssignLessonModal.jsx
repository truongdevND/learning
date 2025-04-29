import React, { useEffect, useState } from 'react';
import { Modal, Button, Select, Spin, message } from 'antd';
import courseService from '../services/courseService';

const AssignLessonModal = ({ visible, onCancel, courseId, onSuccess }) => {
  const [lessonOptions, setLessonOptions] = useState([]);
  const [selectedLessonIds, setSelectedLessonIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible || !courseId) return;
    setLoading(true);
    Promise.all([
      courseService.getLession({ page: 0, pageSize: 1000 }),
      courseService.getCourseById(courseId)
    ]).then(([lessonRes, courseRes]) => {
      const lessons = lessonRes.data?.lesson_list || [];
      setLessonOptions(lessons.map(l => ({ label: l.lesson_name, value: l.id })));
      const assigned = (courseRes.data?.lessons || []).map(l => l.id);
      setSelectedLessonIds(assigned);
    }).catch(() => {
      setLessonOptions([]);
      setSelectedLessonIds([]);
    }).finally(() => setLoading(false));
  }, [visible, courseId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await courseService.updateCoursAssignLesson(courseId, selectedLessonIds);
      message.success('Gán bài học thành công!');
      onSuccess && onSuccess();
    } catch {
      message.error('Gán bài học thất bại!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Gán bài học cho khóa học"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>Hủy</Button>,
        <Button key="save" type="primary" loading={saving} onClick={handleSave}>Lưu</Button>
      ]}
    >
      {loading ? <Spin /> : (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Chọn các bài học để gán"
          options={lessonOptions}
          value={selectedLessonIds}
          onChange={setSelectedLessonIds}
          optionFilterProp="label"
          showSearch
        />
      )}
    </Modal>
  );
};

export default AssignLessonModal; 