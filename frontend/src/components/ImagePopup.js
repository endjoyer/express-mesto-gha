import Popup from './Popup';

function ImagePopup({ card, onClose, isOpen }) {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <aside className={`popup popup-look-img ${isOpen ? 'popup_opened' : ''}`}>
        <div className="popup__container popup-look-img__container">
          <button
            className="popup__close"
            aria-label="Закрыть"
            type="button"
            onClick={onClose}
          ></button>
          <img
            className="popup-look-img__image"
            src={card.link}
            alt={card.name}
          />
          <h3 className="popup-look-img__title">{card.name}</h3>
        </div>
      </aside>
    </Popup>
  );
}

export default ImagePopup;
