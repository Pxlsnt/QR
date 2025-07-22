import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Device } from '../types/Device';

interface BorrowPopupProps {
  isOpen: boolean;
  device: Device | null;
  onClose: () => void;
  onConfirm: (borrowerName: string, dueDate: string) => void;
}

const BorrowPopup: React.FC<BorrowPopupProps> = ({ isOpen, device, onClose, onConfirm }) => {
  const [borrowerName, setBorrowerName] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName.trim() || !dueDate) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    onConfirm(borrowerName.trim(), dueDate);
    setBorrowerName('');
    setDueDate('');
  };

  const formatDate = (dateString: string) => {
    return dateString.split('-').reverse().join('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h3 className="text-xl font-semibold text-center text-purple-800 mb-6 letter-spacing-wide">
          ยืมอุปกรณ์: {device?.name}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ยืม *
            </label>
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg 
                         bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
              placeholder="กรอกชื่อผู้ยืม"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              วันที่คืนตามกำหนด *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg 
                         bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 
                       rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg 
                       hover:bg-pink-500 transition-all duration-200 font-semibold 
                       shadow-lg"
          >
            ยืนยันการยืม
          </button>
        </div>
      </form>
    </div>
  );
};

export default BorrowPopup;