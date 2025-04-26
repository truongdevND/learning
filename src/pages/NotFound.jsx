// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-[120px] font-bold text-blue-600 leading-none">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">Oops! Trang không tồn tại</h2>
      <p className="text-gray-600 mt-2 mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
