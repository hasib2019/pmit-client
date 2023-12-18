import { useCallback, useState } from 'react';
const useModalOpenClose = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, [isModalOpen]);
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, [isModalOpen]);
  return {
    isModalOpen,
    handlModalOpen,
    handleModalClose,
  };
};

export default useModalOpenClose;
