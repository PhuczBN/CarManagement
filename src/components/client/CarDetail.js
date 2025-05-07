import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { formatPrice } from '../../utils/formatters';
import { Heart, Calendar } from 'lucide-react';

const CarDetail = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { cars, favorites, toggleFavorite } = useData();
  const car = cars.find(c => c.id === Number(carId));

  if (!car) {
    return <div>Không tìm thấy xe</div>;
  }

  const isFavorite = favorites.includes(car.id);

  const handleBooking = () => {
    if (car.quantity > 0) {
      navigate(`/client/appointment/${car.id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-8 p-6">
          {/* Hình ảnh xe */}
          <div>
            <div className="relative">
              <img 
                src={car.image} 
                alt={car.name}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              <button
                onClick={() => toggleFavorite(car.id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow hover:bg-gray-100"
              >
                <Heart 
                  className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>
          </div>

          {/* Thông tin xe */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
              <p className="text-2xl font-bold text-red-600">{formatPrice(car.price)}</p>
            </div>

            {/* Thông số kỹ thuật */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Thông số kỹ thuật</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-600">Hãng xe:</p>
                  <p className="font-medium">{car.brand}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Số chỗ ngồi:</p>
                  <p className="font-medium">5 chỗ</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Hộp số:</p>
                  <p className="font-medium">Tự động</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Nhiên liệu:</p>
                  <p className="font-medium">Xăng</p>
                </div>
              </div>
            </div>

            {/* Tính năng */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tính năng</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Automatic</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">ABS</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Airbag</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Camera lùi</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Cảm biến</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">GPS</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              {car.quantity > 0 ? (
                <button
                  onClick={handleBooking}
                  className="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Đặt lịch xem xe
                </button>
              ) : (
                <span className="flex-1 bg-red-100 text-red-600 py-3 rounded-md text-center">
                  Hết hàng
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
          <p className="text-gray-600 leading-relaxed">
            {car.name} là mẫu sedan hạng D với thiết kế sang trọng, nội thất tiện nghi và động cơ mạnh mẽ.
            Xe được trang bị nhiều tính năng an toàn và công nghệ hiện đại, mang lại trải nghiệm lái xe tuyệt vời.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
