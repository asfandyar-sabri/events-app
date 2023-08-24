import { auth , googleProvider} from "../config/firebase";
import { createUserWithEmailAndPassword,signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    console.log(auth?.currentUser?.email);
    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err){
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth,googleProvider);
            const user = result.user;
            // console.log("User is: ", user);
            sendUserDataToBackend(user);
        } catch (err){
            console.error(err);
        }
    };

    const sendUserDataToBackend = async (user) => {
        try {
            const response = await fetch('http://localhost:4000/googleSignIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
    
            if (response.ok) {
                console.log('User data sent to backend successfully');
            } else {
                console.error('Error sending user data to backend');
            }
        } catch (error) {
            console.error('Error sending user data to backend:', error);
        }
    };
    
    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (err){
            console.error(err);
        }
    };

    return (
      <div>
        <input placeholder="Email.." onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Password.."
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signIn}> Signin</button>
        <button onClick={signInWithGoogle}> Signin with google</button>
        {console.log(email, password)};
        <button onClick={logOut}> logOut</button>
      </div>
    );
};
