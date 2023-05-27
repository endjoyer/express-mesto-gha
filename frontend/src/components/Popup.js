import { useEffect } from 'react';

const Popup = ({ isOpen, onClose, children, name }) => {
  useEffect(() => {
    const handleEscClose = (evt) => {
      if (evt.key === 'Escape') {
        onClose();
      }
    };

    const handleOverlayClose = (evt) => {
      if (evt.target.classList.contains('popup_opened')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscClose);
      document.addEventListener('mousedown', handleOverlayClose);
      return () => {
        document.removeEventListener('keydown', handleEscClose);
        document.removeEventListener('mousedown', handleOverlayClose);
      };
    }
  }, [isOpen, onClose]);

  return (
    <aside
      className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}
      id="popup-edit"
    >
      {children}
    </aside>
  );
};

export default Popup;
