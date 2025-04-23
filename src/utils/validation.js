// =======================
// 🔐 Form Validations
// =======================

export const validateName = (name) => {
    if (!name.trim()) return "Name is required.";
    return "";
  };
  
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required.";
    if (!emailRegex.test(email)) return "Invalid email format.";
    return "";
  };
  
  export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password.trim()) return "Password is required.";
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters and include uppercase, lowercase, a number, and can contain special characters.";
    }
    return "";
  };
  
  
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword.trim()) return "Please confirm your password.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };
  
  export const validateGender = (gender) => {
    if (!gender) return "Please select your gender.";
    return "";
  };
  
  export const validateDateOfBirth = (dob) => {
    if (!dob) return "Date of birth is required.";
  
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    if (birthDate > today) return "Date of birth cannot be in the future.";
    if (age < 8) return "You must be at least 8 years old.";
  
    return "";
  };
  
  // =======================
  // 🆔 UID Utilities
  // =======================
  
  /**
   * Generates a custom user ID with a Routiner prefix.
   */
  export const generateCustomId = () => {
    const prefix = "Routiner";
    const randomNumber = Math.floor(10000000 + Math.random() * 90000);
    return `${prefix}${randomNumber}`;
  };
  
  /**
   * Formats a UID into a readable segmented format.
   * e.g. abcdefgh-ijkl-mnop
   */
  export const formatUid = (uid) => {
    return `${uid.substring(0, 8)}-${uid.substring(8, 12)}-${uid.substring(12, 16)}`;
  };
  