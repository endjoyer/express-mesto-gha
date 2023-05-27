import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useForm } from 'react-hook-form';

const Login = ({ onAuthorization }) => {
  const {
    register,
    formState: { errors, isValid },
    getValues,
    reset,
  } = useForm({ mode: 'onChange', criteriaMode: 'all' });

  const handleSubmit = (e) => {
    e.preventDefault();

    onAuthorization(getValues('password'), getValues('email'));
  };
  useEffect(() => {
    reset();
  }, []);

  return (
    <div className="auth">
      <PopupWithForm
        name="auth"
        title="Вход"
        onSubmit={handleSubmit}
        btnText="Войти"
        isValid={isValid}
      >
        <label className="popup__label">
          <input
            className="popup__input popup__input_auth"
            placeholder="Email"
            name="email"
            type="email"
            {...register('email', {
              required: 'Заполните это поле.',
              minLength: {
                value: 5,
                message: 'Минимум 5 символов.',
              },
              maxLength: {
                value: 40,
                message: 'Максимум 40 символов.',
              },
            })}
          />
          <span className="popup__input-error popup__input-error_active">
            {errors?.email && errors?.email?.message}
          </span>
        </label>
        <label className="popup__label">
          <input
            className="popup__input popup__input_auth"
            name="password"
            placeholder="Пароль"
            type="password"
            {...register('password', {
              required: 'Заполните это поле.',
              minLength: {
                value: 8,
                message: 'Минимум 8 символов.',
              },
              maxLength: {
                value: 40,
                message: 'Максимум 40 символов.',
              },
            })}
          />
          <span className="popup__input-error popup__input-error_active">
            {errors?.password && errors?.password?.message}
          </span>
        </label>
      </PopupWithForm>
    </div>
  );
};

export default Login;
