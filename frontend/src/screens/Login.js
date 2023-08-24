import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { signInWithGoogle } from '../utilities/googleSignin.auth';
 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
      
            const data = await response.json();
        
            // Handle success or error response from the backend
            if (response.ok) {
                console.log('User logged in successfully:', data);
                localStorage.setItem('authToken', data.token);
              
                // Redirect to a new page or perform any other action
                navigate('/dashboard');
            } else {
                console.error('Error during login:', data.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    // const handleGoogleSignIn = async () => {
    //     await signInWithGoogle();
    //     navigate('/dashboard'); // Redirect to the dashboard route
    // };

    return (
        <div>
            <h2>Login</h2>
            <InputField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button text="Login" onClick={handleLogin} />

            <p>Not have an account? <Link to="/signup">Sign up</Link></p>

            {/* <button onClick={handleGoogleSignIn}>Sign in with Google</button> */}
        </div>
    );
};

export default Login;
