import React, { useState } from 'react';
import { signInWithEmailAndPassword, validatePassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Button, Input, Label } from '../index';
import './Auth.css';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import getFirebaseErrorMessage from '../../firebase/firebaseErrors';
import { validateEmail } from '../../utils/validation';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);

    if (emailError) {
      setError({ email: emailError});
      return;
    }

    setError({});

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successfull");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setError((prevError) => ({
        ...prevError, firebase: errorMessage,
      }));
    }
  }

  const toggleEye = () => {
    setShowPassword(!showPassword);
  }


  return (
    <div className='auth-container'>
      <h2 className='auth-heading'>Continue with E-mail</h2>
      <form onSubmit={handleLogin}>
        <div className="email">
          <Label htmlFor="email" label="E-mail: " />
          <Input
            type='email'
            placeholder='Enter your Email'
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setError((prev) => ({ ...prev, email: validateEmail(email) }))}
          />
          {error.email && <span className="error">{error.email}</span>}
          <FaEnvelope />
        </div>

        <div className="password">
          <Label htmlFor="password" label="Password: " />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder='Enter your Password'
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            
          />
          <span onClick={toggleEye} id='eyeBtn'>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>


        <div className="forgot">
          <p className="forgot"><Link to={'/forgot-password'}>Forgot Password</Link></p>
        </div>

        <div className='account'>
          <p><Link to={'/signup'}>Don't have an account?</Link></p>
        </div>

        <Button type="submit">Login</Button>
        {error.firebase && <p className='error'>{error.firebase}</p>}
      </form>


    </div>
  )
}

export default Login
