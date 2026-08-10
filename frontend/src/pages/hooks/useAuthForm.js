import { useCallback, useState } from "react";

const EMAIL_PATTERN = /^[^\s]+@[^\s]+\.[^\s]+$/;

const VALIDATORS = {
  fullname: (value) => (!value.trim() ? "Full name is required" : undefined),
  email: (value) =>
    !value.trim() || !EMAIL_PATTERN.test(value) ? "Valid email is required" : undefined,
  password: (value) =>
    !value || value.length < 8 ? "Password must be at least 8 characters" : undefined,
  confirmPassword: (value, formData) =>
    !value || value !== formData.password ? "Passwords must match" : undefined,
};

function buildInitialFormData(fields) {
  return fields.reduce((acc, field) => {
    acc[field] = "";
    return acc;
  }, {});
}

export function useAuthForm(fields) {
  const [formData, setFormData] = useState(() => buildInitialFormData(fields));
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const validate = useCallback(() => {
    const nextErrors = {};

    fields.forEach((field) => {
      const validator = VALIDATORS[field];
      if (!validator) return;

      const error = validator(formData[field], formData);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [fields, formData]);

  return { formData, errors, handleChange, validate };
}