import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
// import { signInWithGoogle } from '../utilities/googleSignin.auth';


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:4000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });
    
        const data = await response.json();
    
          // Handle success or error response from the backend
        if (response.ok) {
            console.log('User registered successfully:', data);
            localStorage.setItem('authToken', data.token);
            // Redirect to a new page or perform any other action
            navigate('/dashboard');
        } else {
            console.error('Error during registration:', data.message);
        }
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    };

    // const handleGoogleSignup = async () => {
    //     await signInWithGoogle();
    //     navigate('/dashboard'); // Redirect to the dashboard route
    // };



    return (
        <div>
        <h2>Signup</h2>
        <InputField
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
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
        <Button text="Signup" onClick={handleSignup} />

        <p>Already have an account? <Link to="/">Login</Link> here</p>

        {/* <button onClick={handleGoogleSignup}>Sign up with Google</button> */}

        </div>
    );
};

export default Signup;
