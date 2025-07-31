import React from 'react';

export interface ManualOverlayPropsType {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ManualOverlay: React.FC<ManualOverlayPropsType> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};

export default ManualOverlay;
