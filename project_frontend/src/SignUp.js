import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles/Signup.css'
import Navbar from './components/Navbar';
import images from './assets/exo';

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/signup', {
                name: name,
                username: username,
                password: password
            });
            if (response.status === 201) {
                console.log(response.data.message);
                navigate('/');
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className='SignUpPage'>
            <Navbar isProfile={false}/>
            <div className="content-space">
                <div>
                    <img src={images.logo_short} alt="" className="short-logo" />
                    <h1 className="head">Welcome to <br /> Goodspace Communications</h1>
                </div>
                <form className="form_signup backdrop-blur-md" onSubmit={handleSubmit}>
                    <div className="form-container">
                        <h1 className="heading">Signup</h1>
                        <div className="input-container">
                            <div className="username">
                                <div className="username-text">Name</div>
                                <input
                                    type="text"
                                    className="input-login"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>  
                            <div className="username">
                                <div className="username-text">Username</div>
                                <input
                                    type="text"
                                    className="input-login"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="password">
                                <div className="password-text">Password</div>
                                <input
                                    type="password"
                                    className="input-login"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="btn-container">
                            <button type="submit" className="btn" id="Log-in">
                                Sign up
                            </button>
                            <button id="signup" className="btn" onClick={() => { navigate("/"); }}>
                                Go Back to Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {/* <div className='form_signup'>
                <form onSubmit={handleSubmit}>
                    <div className='name_signup'>
                        <div className='name-text'>Enter your Name</div>
                        <input type='text' id='name-input' placeholder='Name' onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className='username_signup'>
                        <div className='username-text'>Enter new UserName</div>
                        <input type='text' id='username-input' placeholder='Enter you username' onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className='password_signup'>
                        <div className='password-text'>Enter your Password</div>
                        <input type='password' id='password-input' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type='submit' id='sign-in'>Sign-Up</button>
                </form>
                <button onClick={() => { navigate('/') }}>Go Back to Login</button>
            </div> */}
        </div>
    )
}

export default SignUp