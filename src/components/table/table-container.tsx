import React from 'react';

export const TableContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='border-border/40 bg-card/20 h-[calc(100vh-15rem)] overflow-auto border shadow-sm backdrop-blur-2xl'>
      {children}
    </div>
  );
};
