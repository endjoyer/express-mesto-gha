import Popup from './Popup';
import PopupWithForm from './PopupWithForm';

function ConfirmationPopup({ isOpen, onClose, onConfirm }) {
  function handleSubmit(e) {
    e.preventDefault();

    onConfirm();
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <PopupWithForm
        name="confirmation"
        title="Вы уверены?"
        btnText="Да"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      ></PopupWithForm>
    </Popup>
  );
}

export default ConfirmationPopup;
