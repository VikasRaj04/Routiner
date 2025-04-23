import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { Button, Input, Label } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import getFirebaseErrorMessage from '../../firebase/firebaseErrors';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateGender,
  validateDateOfBirth,
  generateCustomId,
} from '../../utils/validation';

function SignUp() {
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth: '',
    gender: '',
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Real-time validation
    let error = '';
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, value);
        break;
      case 'gender':
        error = validateGender(value);
        break;
      case 'birth':
        error = validateDateOfBirth(value);
        break;
      default:
        break;
    }
    setError((prevError) => ({
      ...prevError,
      [name]: error,
    }));
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // Full form validation before submission
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      gender: validateGender(formData.gender),
      birth: validateDateOfBirth(formData.birth),
    };

    if (Object.values(newErrors).some((err) => err)) {
      setError(newErrors);
      return;
    }

    try {
      const { name, email, password, birth, gender } = formData;
      const customId = generateCustomId();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        customId: customId,
        name,
        email,
        birth,
        gender,
      });

      alert('User Registered Successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError((prevError) => ({
        ...prevError,
        firebase: errorMessage,
      }));
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-heading">Create Account</h2>
      <form onSubmit={handleRegister} autoComplete='on'>
        {/* Name */}
        <div className="name">
          <Label htmlFor="name" label="Full Name:" />
          <Input
            type="text"
            name="name"
            placeholder="Enter your Full Name"
            id="name"
             autocomplete="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {error.name && <span className="error">{error.name}</span>}
        </div>

        {/* Email */}
        <div className="email">
          <Label htmlFor="email" label="Enter Email" />
          <Input
            type="email"
            placeholder="Enter your Email"
            name="email"
            value={formData.email}
            id="email"
            autocomplete="email" 
            onChange={handleChange}
            required
          />
          {error.email && <span className="error">{error.email}</span>}
        </div>

        {/* Password */}
        <div className="password">
          <Label htmlFor="password" label="Create a Strong Password" />
          <Input
            type="password"
            placeholder="Create Password"
            value={formData.password}
            name="password"
            id="password"
             autocomplete="new-password"
            onChange={handleChange}
            required
          />
          {error.password && <span className="error">{error.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className="confirm-password">
          <Label htmlFor="confirm-password" label="Confirm Password" />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            name="confirmPassword"
            id="confirm-password"
            autocomplete="new-password"
            onChange={handleChange}
            required
          />
          {error.confirmPassword && (
            <span className="error">{error.confirmPassword}</span>
          )}
        </div>

        {/* Date of Birth */}
        <div className="dob">
          <Label htmlFor="dob" label="Date of Birth" />
          <Input
            type="date"
            name="birth"
            id="dob"
            autocomplete='bday'
            value={formData.birth}
            onChange={handleChange}
            required
          />
          {error.birth && <span className="error">{error.birth}</span>}
        </div>

        {/* Gender */}
        <div className="gender">
          <label>Gender:</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
              checked={formData.gender === 'Male'}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
              checked={formData.gender === 'Female'}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Other"
              onChange={handleChange}
              checked={formData.gender === 'Other'}
            />
            Other
          </label>
          {error.gender && <span className="error">{error.gender}</span>}
        </div>

        {/* Error Message from Firebase */}
        {error.firebase && <p className="error">{error.firebase}</p>}

        {/* Already have an account */}
        <div className="account">
          <p>
            <Link to="/login">Already have an account?</Link>
          </p>
        </div>

        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}

export default SignUp;
