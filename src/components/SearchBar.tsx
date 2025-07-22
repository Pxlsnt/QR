import React from 'react';
import { Search, RefreshCw, Plus } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onAddDevice: () => void;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  onAddDevice,
  currentFilter,
  onFilterChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center animate-fade-in-up">
      <button
        onClick={onAddDevice}
        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-lg 
                   font-semibold shadow-lg hover:from-pink-500 hover:to-purple-600 transition-all 
                   duration-200 flex items-center gap-2 text-sm lg:text-base"
      >
        <Plus size={18} />
        เพิ่มอุปกรณ์ใหม่
      </button>
      
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาอุปกรณ์..."
          className="w-full pl-10 pr-4 py-2.5 border border-purple-200 rounded-lg 
                     bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                     focus:border-transparent transition-all duration-200"
        />
      </div>
      
      <button
        onClick={onRefresh}
        className="px-4 py-2.5 border-2 border-purple-600 text-purple-600 rounded-lg 
                   hover:bg-purple-600 hover:text-white transition-all duration-200 
                   flex items-center gap-2"
      >
        <RefreshCw size={16} />
        รีเฟรช
      </button>
      
      <div className="bg-white rounded-full border-2 border-purple-200 overflow-hidden 
                      shadow-md flex">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-6 py-2 font-medium transition-all duration-200 ${
            currentFilter === 'all'
              ? 'bg-purple-600 text-white'
              : 'text-purple-600 hover:bg-gray-50'
          }`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => onFilterChange('ready')}
          className={`px-6 py-2 font-medium transition-all duration-200 ${
            currentFilter === 'ready'
              ? 'bg-green-100 text-green-700'
              : 'text-purple-600 hover:bg-gray-50'
          }`}
        >
          พร้อมใช้งาน
        </button>
        <button
          onClick={() => onFilterChange('borrowed')}
          className={`px-6 py-2 font-medium transition-all duration-200 ${
            currentFilter === 'borrowed'
              ? 'bg-red-100 text-red-700'
              : 'text-purple-600 hover:bg-gray-50'
          }`}
        >
          ถูกยืม
        </button>
      </div>
    </div>
  );
};

export default SearchBar;