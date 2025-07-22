import React from 'react';
import { Device } from '../types/Device';

interface DeviceCardProps {
  device: Device;
  onBorrow: () => void;
  onReturn: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onBorrow, onReturn }) => {
  const defaultImage = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg";
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden 
                    transform transition-all duration-200 hover:scale-105 hover:border-purple-500 
                    hover:shadow-xl animate-fade-in-up">
      <div className="relative overflow-hidden">
        <img
          src={device.img || defaultImage}
          alt={device.name}
          className="w-full h-40 object-cover transition-transform duration-200 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-lg text-purple-800 mb-2">{device.name}</h3>
        
        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <div><strong>ID:</strong> {device.id}</div>
          <div><strong>หมวดหมู่:</strong> {device.category}</div>
          <div className={`font-medium ${
            device.status === 'ready' ? 'text-green-600' : 'text-red-600'
          }`}>
            <strong>สถานะ:</strong> {device.status === 'ready' ? 'พร้อมใช้งาน' : 'ถูกยืม'}
          </div>
          
          {device.borrower && (
            <div className="text-purple-600 bg-purple-50 p-2 rounded-lg mt-2">
              <div><strong>ผู้ยืม:</strong> {device.borrower}</div>
              <div><strong>คืนวันที่:</strong> {device.duedate}</div>
            </div>
          )}
          
          {device.note && (
            <div className="text-gray-500 text-xs mt-2">
              <strong>หมายเหตุ:</strong> {device.note}
            </div>
          )}
        </div>
        
        <button
          onClick={device.status === 'ready' ? onBorrow : onReturn}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            device.status === 'ready'
              ? 'bg-gradient-to-r from-green-400 to-blue-400 text-white hover:from-green-500 hover:to-blue-500 shadow-md'
              : 'bg-white text-red-600 border-2 border-red-500 hover:bg-red-600 hover:text-white'
          }`}
        >
          {device.status === 'ready' ? 'ยืมอุปกรณ์นี้' : 'คืนอุปกรณ์'}
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;