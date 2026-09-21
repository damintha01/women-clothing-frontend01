export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}

/** Returns a { field: message } map for any of `fields` missing from `values`. */
export function requireFields(values, fields) {
  const errors = {};
  for (const field of fields) {
    const value = values[field];
    if (value === undefined || value === null || String(value).trim() === "") {
      errors[field] = "This field is required.";
    }
  }
  return errors;
}

export function validateLoginInput(values) {
  const errors = requireFields(values, ["email", "password"]);
  if (!errors.email && !isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  return errors;
}

export function validateRegisterInput(values) {
  const errors = requireFields(values, ["name", "email", "password", "confirmPassword"]);
  if (!errors.email && !isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!errors.password && values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!errors.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export function validateAddressInput(values) {
  return requireFields(values, ["line1", "city", "zip", "country"]);
}
