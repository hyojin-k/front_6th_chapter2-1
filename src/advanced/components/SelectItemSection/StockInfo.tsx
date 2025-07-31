import React from 'react';
import { ProductType } from '../../types';
import { QUANTITY_THRESHOLDS } from '../../constants/product';

export interface StockInfoPropsType {
  products: ProductType[];
}

const StockInfo: React.FC<StockInfoPropsType> = ({ products }) => {
  const getStockMessage = () => {
    let stockMsg = '';
    let hasLowStock = false;
    let outOfStock = false;

    products.forEach((item) => {
      if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
        hasLowStock = true;
        if (item.quantity > 0) {
          stockMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
        } else {
          stockMsg += `${item.name}: 품절\n`;
          outOfStock = true;
        }
      }
    });

    return { message: stockMsg, hasLowStock, outOfStock };
  };

  const { message, hasLowStock, outOfStock } = getStockMessage();

  if (!hasLowStock) {
    return null;
  }

  return (
    <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
      {message}
    </div>
  );
};

export default StockInfo;
