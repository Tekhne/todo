import { useState } from 'react';

export function useModal() {
  const [modalState, setModalState] = useState({
    modalContent: null,
    showModal: false
  });

  return { modalState, setModalState };
}
