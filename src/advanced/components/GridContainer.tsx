import React from 'react';

export interface GridContainerPropsType {
  children: React.ReactNode;
}

const GridContainer: React.FC<GridContainerPropsType> = ({ children }) => {
  return <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 flex-1">{children}</div>;
};

export default GridContainer;
