import { useCallback, useState, useRef, useEffect } from 'react';

export function useFormValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    setIsValid(formRef.current.checkValidity());
  });

  const handleChange = (ev) => {
    const { name, value, validationMessage, form } = ev.target;
    setValues((oldValues) => ({ ...oldValues, [name]: value }));
    setErrors((oldErrors) => ({ ...oldErrors, [name]: validationMessage }));
    setIsValid(form.checkValidity());
  };

  const reset = (initialValues = {}) => {
    setValues(initialValues);
    setErrors({});
  };

  const setValue = useCallback((name, value) => {
    setValues((oldValues) => ({ ...oldValues, [name]: value }));
  }, []);

  return {
    values,
    errors,
    isValid,
    handleChange,
    setValue,
    reset,
    formRef,
  };
}
