export const  validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { valid: false, message: "Email is required." };
  }

  if (!regex.test(email)) {
    return { valid: false, message: "Please enter a valid email address." };
  }

  return { valid: true, message: "" };
}

export const validatePassword = (password) => {
  const rules = [
    {
      regex: /.{8,}/,
      message: "Password must be at least 8 characters long.",
    },
    {
      regex: /[a-z]/,
      message: "Password must include at least one lowercase letter.",
    },
    {
      regex: /[A-Z]/,
      message: "Password must include at least one uppercase letter.",
    },
    {
      regex: /\d/,
      message: "Password must include at least one number.",
    },
    {
      regex: /[@$!%*?#&^+=_()]/,
      message: "Password must include at least one special character.",
    },
  ];

  if (!password) {
    return { valid: false, message: "Password is required." };
  }

  for (const rule of rules) {
    if (!rule.regex.test(password)) {
      return { valid: false, message: rule.message };
    }
  }

  return { valid: true, message: "" };
}

