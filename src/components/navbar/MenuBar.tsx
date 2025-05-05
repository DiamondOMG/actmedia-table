"use client";
import React from 'react';

interface Props {
  className?: string;
}

const MenuBar: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      Menu Bar
    </div>
  );
};

export default MenuBar;
