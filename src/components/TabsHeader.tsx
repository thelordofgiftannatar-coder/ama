import React from 'react';

interface TabsHeaderProps {
  activeTab: 'recent' | 'notebooks';
  onTabChange: (tab: 'recent' | 'notebooks') => void;
  accentColor?: string;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="px-4 py-2 flex justify-center max-w-4xl mx-auto">
      <div className="flex items-center p-1 bg-[#1e1c24]/90 backdrop-blur-md rounded-full border border-[#332f3d] shadow-md w-full max-w-sm">
        <button
          onClick={() => onTabChange('recent')}
          className={`flex-1 py-1.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
            activeTab === 'recent'
              ? 'bg-[#5b3b8c] text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Recent Pages
        </button>
        <button
          onClick={() => onTabChange('notebooks')}
          className={`flex-1 py-1.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
            activeTab === 'notebooks'
              ? 'bg-[#5b3b8c] text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Notebook List
        </button>
      </div>
    </div>
  );
};
