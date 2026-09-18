import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div className="toast" id="notification-toast">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
}
