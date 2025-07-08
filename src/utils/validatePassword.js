export const validatePassword = (value) => {
  let strength = 0;
  if (value.length >= 6) strength += 1;
  if (/[A-Z]/.test(value)) strength += 1;
  if (/[0-9]/.test(value)) strength += 1;
  if (/[^A-Za-z0-9]/.test(value)) strength += 1;
  return strength;
};
