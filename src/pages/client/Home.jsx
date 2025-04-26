import React, { useState, useEffect } from 'react';
import { Card, Select, Tag, Space, Rate, Empty, Spin, message } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import courseService from '../../services/courseService';
const { Option } = Select;

const Home = () => {
  const [filter, setFilter] = useState('all');
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keySearch, setKeySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      message.success('Courses loaded successfully');
    } catch (e) {
      message.error('Failed to fetch courses');
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

  return (
    <div>
      {/* Filter Section */}
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
    </div>
  );
};

export default Home;