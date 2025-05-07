import React, { createContext, useState, useContext, useEffect } from 'react';
import { formatPrice, formatPhoneNumber } from '../utils/formatters';
import { carData } from '../data/carData';
import { customerData } from '../data/customerData';
import { salesData } from '../data/salesData';
import { employeeData } from '../data/employeeData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Khởi tạo state từ localStorage hoặc dữ liệu mặc định
  const [cars, setCars] = useState(() => {
    const savedCars = localStorage.getItem('cars');
    return savedCars ? JSON.parse(savedCars) : carData;
  });
  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem('customers');
    return savedCustomers ? JSON.parse(savedCustomers) : customerData;
  });
  const [sales, setSales] = useState(salesData);
  const [employees, setEmployees] = useState(employeeData);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('appointments');
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  // Lưu cars vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const addCar = (newCar) => {
    const formattedCar = {
      id: Date.now(),
      ...newCar,
      price: Number(newCar.price),
      quantity: Number(newCar.quantity)
    };
    setCars(prevCars => [...prevCars, formattedCar]);
  };

  const updateCar = (updatedCar) => {
    setCars(prevCars => prevCars.map(car => 
      car.id === updatedCar.id 
        ? {
            ...car,
            ...updatedCar,
            price: Number(updatedCar.price),
            quantity: Number(updatedCar.quantity)
          }
        : car
    ));
  };

  const deleteCar = (carId) => {
    setCars(prevCars => prevCars.filter(car => car.id !== carId));
  };

  const addCustomer = (newCustomer) => {
    const formattedCustomer = {
      ...newCustomer,
      id: Date.now(),
      purchased: 0,
      appointments: 0,
      phone: formatPhoneNumber(newCustomer.phone)
    };
    setCustomers(prevCustomers => [...prevCustomers, formattedCustomer]);
  };

  const addSale = (newSale) => {
    const formattedSale = {
      ...newSale,
      id: `DH-${String(sales.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('vi-VN'),
      value: formatPrice(Number(newSale.value))
    };
    setSales(prevSales => [...prevSales, formattedSale]);

    // Cập nhật số lượng xe
    const updatedCars = cars.map(car => {
      if (car.name === newSale.car) {
        return { ...car, quantity: car.quantity - 1 };
      }
      return car;
    });
    setCars(updatedCars);

    // Cập nhật số lượng mua của khách hàng
    const updatedCustomers = customers.map(customer => {
      if (customer.name === newSale.customer) {
        return { ...customer, purchased: customer.purchased + 1 };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
  };

  const addEmployee = (newEmployee) => {
    const formattedEmployee = {
      id: Date.now(),
      ...newEmployee,
      status: 'Đang Hoạt Động',
      joinDate: new Date().toLocaleDateString('vi-VN')
    };
    setEmployees(prevEmployees => [...prevEmployees, formattedEmployee]);
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(customers.map(customer =>
      customer.id === updatedCustomer.id ? { ...customer, ...updatedCustomer } : customer
    ));
  };

  const updateSale = (updatedSale) => {
    setSales(sales.map(sale =>
      sale.id === updatedSale.id ? { ...sale, ...updatedSale } : sale
    ));
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees(prevEmployees => prevEmployees.map(emp => 
      emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
    ));
  };

  const deleteCustomer = (customerId) => {
    setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId));
  };

  const deleteSale = (saleId) => {
    setSales(prevSales => prevSales.filter(sale => sale.id !== saleId));
  };

  const deleteEmployee = (employeeId) => {
    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
  };

  const toggleFavorite = (carId) => {
    setFavorites(prev => {
      if (prev.includes(carId)) {
        return prev.filter(id => id !== carId);
      } else {
        return [...prev, carId];
      }
    });
  };

  const addAppointment = (newAppointment) => {
    console.log('Adding new appointment:', newAppointment); // Để debug
    setAppointments(prevAppointments => {
      const updatedAppointments = [...prevAppointments, newAppointment];
      // Lưu vào localStorage ngay lập tức
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return updatedAppointments;
    });
  };

  const addAppointmentAndCustomer = (formData) => {
    // Tạo appointment mới với status
    const newAppointment = {
      id: Date.now(),
      ...formData,
      status: 'Chờ xác nhận',
      createdAt: new Date().toISOString()
    };

    // Lưu appointment vào state và localStorage
    setAppointments(prev => {
      const updatedAppointments = [...prev, newAppointment];
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return updatedAppointments;
    });

    // Kiểm tra và cập nhật thông tin khách hàng
    const existingCustomer = customers.find(c => c.phone === formData.phone);
    if (!existingCustomer) {
      const newCustomer = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointments: 1,
        joinDate: new Date().toISOString(),
        purchased: 0
      };
      setCustomers(prev => {
        const updatedCustomers = [...prev, newCustomer];
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        return updatedCustomers;
      });
    } else {
      setCustomers(prev => {
        const updatedCustomers = prev.map(customer =>
          customer.id === existingCustomer.id
            ? { ...customer, appointments: customer.appointments + 1 }
            : customer
        );
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        return updatedCustomers;
      });
    }
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  return (
    <DataContext.Provider value={{
      cars, setCars, addCar, updateCar, deleteCar,
      customers, setCustomers, addCustomer, updateCustomer, deleteCustomer,
      sales, setSales, addSale, updateSale, deleteSale,
      employees, setEmployees, addEmployee, updateEmployee, deleteEmployee,
      favorites, toggleFavorite,
      appointments, setAppointments, addAppointment, updateAppointmentStatus,
      addAppointmentAndCustomer
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
