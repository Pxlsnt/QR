import React, { useState, useMemo } from 'react';
import { Device } from './types/Device';
import { sendToGoogleSheet } from './services/googleSheets';
import SearchBar from './components/SearchBar';
import DeviceCard from './components/DeviceCard';
import BorrowPopup from './components/BorrowPopup';
import AddDevicePopup from './components/AddDevicePopup';

function App() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "820015",
      name: "กล้อง Kodak",
      category: "กล้อง",
      status: "ready",
      img: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
      note: "",
      borrower: "",
      duedate: ""
    },
    {
      id: "8J0152",
      name: "กล้อง DJI",
      category: "กล้อง",
      status: "ready",
      img: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
      note: "",
      borrower: "",
      duedate: ""
    },
    {
      id: "8I1734",
      name: "กล้อง Sony",
      category: "กล้อง",
      status: "ready",
      img: "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg",
      note: "",
      borrower: "",
      duedate: ""
    },
    {
      id: "879892",
      name: "ขาตั้งกล้องยาว",
      category: "ขาตั้ง",
      status: "ready",
      img: "https://images.pexels.com/photos/257881/pexels-photo-257881.jpeg",
      note: "",
      borrower: "",
      duedate: ""
    },
    {
      id: "879952",
      name: "ขาตั้งกล้องเล็ก",
      category: "ขาตั้งกล้อง",
      status: "ready",
      img: "https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg",
      note: "",
      borrower: "",
      duedate: ""
    },
    {
      id: "982321",
      name: "ไฟชุด",
      category: "ไฟ",
      status: "ready",
      img: "https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg",
      note: "",
      borrower: "",
      duedate: ""
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [borrowPopup, setBorrowPopup] = useState<{
    isOpen: boolean;
    device: Device | null;
  }>({ isOpen: false, device: null });
  const [addDevicePopup, setAddDevicePopup] = useState(false);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = 
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.id.includes(searchQuery) ||
        device.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'all' || device.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [devices, searchQuery, filterStatus]);

  const handleBorrowDevice = (device: Device) => {
    setBorrowPopup({ isOpen: true, device });
  };

  const handleConfirmBorrow = async (borrowerName: string, dueDate: string) => {
    if (!borrowPopup.device) return;

    const formattedDate = dueDate.split('-').reverse().join('/');
    const updatedDevice = {
      ...borrowPopup.device,
      status: 'borrowed' as const,
      borrower: borrowerName,
      duedate: formattedDate
    };

    setDevices(prev => 
      prev.map(device => 
        device.id === borrowPopup.device!.id ? updatedDevice : device
      )
    );

    await sendToGoogleSheet({
      action: 'borrow',
      id: updatedDevice.id,
      name: updatedDevice.name,
      category: updatedDevice.category,
      status: 'borrowed',
      img: updatedDevice.img,
      note: updatedDevice.note,
      borrower: borrowerName,
      duedate: formattedDate
    });

    setBorrowPopup({ isOpen: false, device: null });
  };

  const handleReturnDevice = async (device: Device) => {
    if (!confirm('ยืนยันการคืนอุปกรณ์?')) return;

    const updatedDevice = {
      ...device,
      status: 'ready' as const,
      borrower: '',
      duedate: ''
    };

    setDevices(prev => 
      prev.map(d => d.id === device.id ? updatedDevice : d)
    );

    await sendToGoogleSheet({
      action: 'return',
      id: device.id,
      name: device.name,
      category: device.category,
      status: 'ready',
      img: device.img,
      note: device.note
    });
  };

  const handleAddDevice = async (newDevice: {
    id: string;
    name: string;
    category: string;
    img?: string;
    note?: string;
  }) => {
    const device: Device = {
      ...newDevice,
      status: 'ready',
      borrower: '',
      duedate: ''
    };

    setDevices(prev => [...prev, device]);

    await sendToGoogleSheet({
      action: 'add',
      id: device.id,
      name: device.name,
      category: device.category,
      status: 'ready',
      img: device.img,
      note: device.note
    });

    setAddDevicePopup(false);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setFilterStatus('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 font-kanit">
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-6 text-center shadow-2xl animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          ระบบยืมคืนอุปกรณ์
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={handleRefresh}
          onAddDevice={() => setAddDevicePopup(true)}
          currentFilter={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <p className="text-lg">ไม่มีรายการที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            filteredDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onBorrow={() => handleBorrowDevice(device)}
                onReturn={() => handleReturnDevice(device)}
              />
            ))
          )}
        </div>
      </div>

      <BorrowPopup
        isOpen={borrowPopup.isOpen}
        device={borrowPopup.device}
        onClose={() => setBorrowPopup({ isOpen: false, device: null })}
        onConfirm={handleConfirmBorrow}
      />

      <AddDevicePopup
        isOpen={addDevicePopup}
        onClose={() => setAddDevicePopup(false)}
        onAdd={handleAddDevice}
        existingIds={devices.map(d => d.id)}
      />
    </div>
  );
}

export default App;