import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatPrice } from '../../utils/formatters';

const FavoriteList = () => {
  const { cars, favorites, toggleFavorite } = useData();
  const favoriteCars = cars.filter(car => favorites.includes(car.id));
  const navigate = useNavigate();

  const carContent = (car) => (
    <div key={car.id} className="bg-white rounded-lg overflow-hidden">
      <div className="relative">
        <img 
          src={car.image} 
          alt={car.name} 
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => navigate(`/client/cars/${car.id}`)}
        />
        <button
          onClick={() => toggleFavorite(car.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
        >
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{car.name}</h3>
        <p className="text-red-600 font-bold text-xl mb-4">
          {formatPrice(car.price)}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{car.brand}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{car.type || 'SUV'}</span>
        </div>
        <div className="flex justify-between">
          {car.quantity > 0 ? (
            <button 
              onClick={() => navigate(`/client/appointment/${car.id}`)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Đặt lịch hẹn
            </button>
          ) : (
            <span className="px-4 py-2 bg-red-100 text-red-600 rounded-md">
              Hết hàng
            </span>
          )}
          <button 
            onClick={() => navigate(`/client/cars/${car.id}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );

  if (favoriteCars.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Xe Yêu Thích</h1>
        <p className="text-gray-500">Bạn chưa có xe yêu thích nào</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Xe Yêu Thích</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {favoriteCars.map(car => carContent(car))}
      </div>
    </div>
  );
};

export default FavoriteList;
