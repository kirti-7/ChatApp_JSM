import React, { useState } from 'react'
import Cookies from 'universal-cookie';
import axios from 'axios';


const initialValue = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
}

const Auth = () => {

    const cookies = new Cookies();


    const [form, setForm] = useState(initialValue);
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, phoneNumber, avatarURL } = form;

        const URL = 'http://localhost:5000/auth';
        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, fullName: form.fullName, phoneNumber, avatarURL,
        });
        // const response = await axios.post(`${URL}/${isSignup? 'signup':'login'}`);


        
        cookies.set('token',token);
        cookies.set('username',username);
        cookies.set('fullName',fullName);
        cookies.set('userId',userId);

        if (isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }

        window.location.reload();
    }

    const switchMode = () => {
        setIsSignup(!isSignup);
    }


  return (
      <div className='auth__form-container'>
          <div className="auth__form-container_fields">
              <div className="auth__form-container_fields-content" >
                  <p>
                      {isSignup ? 'Sign Up' : 'Sign In'}
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                      {isSignup && (
                          <div className="auth__form-container_fields-content_input">
                              <label htmlFor="fullName">Full Name</label>
                              <input type="text" name='fullName' placeholder='Full Name' onChange={handleChange} required/>
                          </div>
                      )}

                      <div className="auth__form-container_fields-content_input">
                          <label htmlFor="username">Username</label>
                          <input type="text" name='username' placeholder='Username' onChange={handleChange} required />
                      </div>

                      {isSignup && (
                          <div className="auth__form-container_fields-content_input">
                              <label htmlFor="phoneNumber">Phone Number</label>
                              <input type="text" name='phoneNumber' placeholder='Phone Number' onChange={handleChange} required />
                          </div>
                      )}

                      {isSignup && (
                          <div className="auth__form-container_fields-content_input">
                              <label htmlFor="avatarURL">Avatar URL</label>
                              <input type="text" name='avatarURL' placeholder='Avatar URL' onChange={handleChange} required />
                          </div>
                      )}

                      <div className="auth__form-container_fields-content_input">
                          <label htmlFor="password">Password</label>
                          <input type={showPassword? "text": "password"} name='password' placeholder='Password' onChange={handleChange} required />
                          <div style={{ display: 'flex', margin: 0, marginTop: "4px", alignContent:'center' }}>
                                  <input
                                  type="checkbox"
                                  checked={showPassword}
                                  onChange={(e) => { setShowPassword(e.target.checked) }}
                                  style={{ float: 'left', margin: 0, padding: 0, width: '15px', marginRight: "2px", outline: "none", boxShadow: "0px 0px 0px 1.5px #ffffff", }}
                                  />
                              <label style={{marginBottom: 0}}>{showPassword ? "Hide Password" : "Show Password"}</label>
                                  
                          </div>
                      </div>

                      {isSignup && (<div className="auth__form-container_fields-content_input">
                          <label htmlFor="confirmPassword">Confirm Password</label>
                          <input type={showConfirmPassword ? "text" : "password"} name='confirmPassword' placeholder='Confirm Password' onChange={handleChange} required />
                          <div style={{ display: 'flex', margin: 0, marginTop: "4px" }}>
                              <input
                                  type="checkbox"
                                  checked={showConfirmPassword}
                                  onChange={(e) => { setShowConfirmPassword(e.target.checked) }}
                                  style={{ float: 'left', margin: 0, padding: 0, width: '15px', marginRight: "2px", outline: "none", boxShadow: "0px 0px 0px 1.5px #ffffff", }}
                              />
                              <label style={{ marginBottom: 0 }}>{ showConfirmPassword? "Hide Password": "Show Password"}</label>
                              

                          </div>
                      </div>)}
                      
                      <div className="auth__form-container_fields-content_button">
                          <button>
                              {isSignup ? "Sign up" : "Sign in"}
                          </button>
                      </div>

                  </form>
                  <div className="auth__form-container_fields-account">
                      <p>
                          {isSignup ? "Already have an account? " : "Don't have an account? "}
                          <span onClick={switchMode}>
                              {isSignup? "Sign in":"Sign up"}
                          </span>
                      </p>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default Auth