import React, { useEffect } from 'react';
import Popup from './Popup';
import PopupWithForm from './PopupWithForm';
import { useForm } from 'react-hook-form';

const EditAvatarPopup = ({ isOpen, onClose, onUpdateAvatar, isLoading }) => {
  const {
    register,
    formState: { errors, isValid },
    getValues,
    reset,
  } = useForm({ mode: 'onChange', criteriaMode: 'all' });

  const handleSubmit = (event) => {
    event.preventDefault();

    onUpdateAvatar({
      avatar: getValues('avatar'),
    });
  };

  useEffect(() => {
    reset();
  }, [isOpen]);

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <PopupWithForm
        name="edit-avatar"
        title="Обновить аватар"
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        btnText="Сохранить"
        isValid={isValid}
      >
        <label className="popup__label">
          <input
            className="popup__input"
            type="url"
            placeholder="Ссылка на изображение"
            {...register('avatar', {
              required: 'Заполните это поле.',
              validate: (v) => v.includes('http'),
            })}
          />
          <span className="popup__input-error popup__input-error_active">
            {errors?.avatar &&
              (errors?.avatar?.message || 'Введите ссылку на изображение.')}
          </span>
        </label>
      </PopupWithForm>
    </Popup>
  );
};

export default EditAvatarPopup;
