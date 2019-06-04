import { useState } from 'react';

export function useModal() {
  return useState({
    modalContent: null,
    showModal: false
  });
}
