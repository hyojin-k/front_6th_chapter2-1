import { useState, useCallback } from 'react';

export const useManual = () => {
  const [isManualOpen, setIsManualOpen] = useState(false);

  // 매뉴얼 열기
  const openManual = useCallback(() => {
    setIsManualOpen(true);
  }, []);

  // 매뉴얼 닫기
  const closeManual = useCallback(() => {
    setIsManualOpen(false);
  }, []);

  // 매뉴얼 토글
  const toggleManual = useCallback(() => {
    setIsManualOpen((prev) => !prev);
  }, []);

  return {
    isManualOpen,
    openManual,
    closeManual,
    toggleManual,
  };
};
