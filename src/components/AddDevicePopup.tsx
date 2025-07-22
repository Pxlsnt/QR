import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddDevicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: {
    id: string;
    name: string;
    category: string;
    img?: string;
    note?: string;
  }) => void;
  existingIds: string[];
}

const AddDevicePopup: React.FC<AddDevicePopupProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  existingIds 
}) => {
  const [deviceId, setDeviceId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [note, setNote] = useState('');

  const generateId = () => {
    let id;
    do {
      id = Math.floor(100000 + Math.random() * 900000).toString();
    } while (existingIds.includes(id));
    return id;
  };

  useEffect(() => {
    if (isOpen) {
      setDeviceId(generateId());
      setName('');
      setCategory('');
      setImageUrl('');
      setNote('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId.trim() || !name.trim() || !category.trim()) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    if (existingIds.includes(deviceId)) {
      alert('ID อุปกรณ์นี้ถูกใช้แล้ว!');
      setDeviceId(generateId());
      return;
    }

    onAdd({
      id: deviceId.trim(),
      name: name.trim(),
      category: category.trim(),
      img: imageUrl.trim() || undefined,
      note: note.trim() || undefined
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-scale-in relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h3 className="text-xl font-semibold text-center text-purple-800 mb-6">
          เพิ่มอุปกรณ์ใหม่เข้าสู่ระบบ
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID อุปกรณ์ (สุ่มอัตโนมัติ) *
            </label>
            <input
              type="text"
              value={deviceId}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                         bg-gray-100 text-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่ออุปกรณ์ *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg 
                         bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
              placeholder="กรอกชื่ออุปกรณ์"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมวดหมู่ *
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg 
                         bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
              placeholder="เช่น กล้อง, ขาตั้ง, ไฟ"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ลิงก์รูปภาพ (URL)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg 
                         bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเหตุ
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg 
                         bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200 resize-vertical"
              placeholder="หมายเหตุเพิ่มเติม"
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
            บันทึกอุปกรณ์
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDevicePopup;