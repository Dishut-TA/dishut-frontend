import React from 'react';
import { Toaster } from 'react-hot-toast';

const CustomToaster: React.FC = () => {
  return (
    <Toaster 
      position="top-center"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        duration: 4000,
        className: 'text-sm font-bold rounded-2xl shadow-xl px-5 py-3',
        success: {
          style: {
            background: '#F0FDF4', 
            color: '#166534', 
            border: '1px solid #BBF7D0', 
          },
          iconTheme: {
            primary: '#185325',
            secondary: '#FFFFFF',
          },
        },
        error: {
          style: {
            background: '#FEF2F2', 
            color: '#991B1B', 
            border: '1px solid #FECACA', 
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
        loading: {
          style: {
            background: '#FFFFFF',
            color: '#334155', 
            border: '1px solid #E2E8F0', 
          },
        }
      }} 
    />
  );
};

export default CustomToaster;