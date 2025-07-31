import React from 'react';

export interface GridContainerPropsType {
  children: React.ReactNode;
  className?: string;
}

const GridContainer: React.FC<GridContainerPropsType> = ({ children, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 flex-1 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default GridContainer;
