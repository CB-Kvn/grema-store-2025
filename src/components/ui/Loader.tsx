import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoader } from '@/store/slices/loaderSlice';

const Loader: React.FC = () => {
  const isLoading = useSelector(selectLoader);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;