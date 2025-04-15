import React, { useState } from 'react'
import { auth } from '../../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router';
import './Auth.css';
import {Label, Input, Button} from '../index';
import getFirebaseErrorMessage from '../../firebase/firebaseErrors';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            const errorMessage = getFirebaseErrorMessage ? getFirebaseErrorMessage(err.code) : err.message || "Failed to send password reset email.";
            setError(errorMessage);
        }
    };

    return (
        <div className='auth-container'>
            <h2 className='auth-heading'>Forgot Password</h2>

            <form onSubmit={handlePasswordReset}>
                <div>
                    <Label htmlFor="email" label="Email Address:"></Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <Button type="submit">Reset Password</Button>
            </form>

            {message && <p className='success'>{message}</p>}
            {error && <p className='error'>{error}</p>}
        </div>
    )
}

export default ForgotPassword
