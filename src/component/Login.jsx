import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../img/logos/kisaankhatalogo.png';
import { login } from '../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { VscEye } from 'react-icons/vsc';

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertPass, setAlertPass] = useState('');
  const [invalid, setInvalid] = useState('');

  const navigate = useNavigate('');
  const { loading, error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const validateEmail = (email) => {
    const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.test(email)) {
      setAlertEmail('Please enter a valid email');
      return false;
    } else {
      setAlertEmail('');
      return true;
    }
  };

  const validatePassword = (password) => {
    const regPass = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,8}$/;
    // if (!regPass.test(password)) {
    //   setAlertPass("Password must be 6-8 characters long and include both letters and numbers");
    //   return false;
    // } else {
    //   setAlertPass("");
    //   return true;
    // }
    return true;
  };

  const validateInputs = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    return isEmailValid && isPasswordValid;
  };

  async function signIn(e) {
    e.preventDefault();
    if (validateInputs()) {
      dispatch(login({ email, password }))
        .unwrap()
        .then((data) => {
          console.log(data?.user?.data);
          const loginTime = new Date();
          loginTime.setMinutes(loginTime.getMinutes() + 40); // Add 10 minutes to the login time
          Cookies.set('user', JSON.stringify(data?.user?.data), { expires: loginTime });
          setAlertEmail('');
          setPassword('');
          navigate('/');
        })
        .catch(({ message }) => {
          setInvalid(message);
        });
    }
  }

  return (
    <div>
      <section className="login-bg-image">
        <div className="bg-overlay-orange"></div>
        <div className="card-section">
          <div className="d-flex justify-content-evenly align-items-center" style={{ justifyContent: 'space-evenly' }}>
            <img src={logo} alt="travel-logo" className="div-logo" />
            <div className="h-logn-line" />

            <div className="login-form-2">
              <div className="d-flex justify-content-center">
                <img src={logo} alt="logo" className="logo-form-2" />
              </div>
              <h2 className="text-start mb-4" style={{ color: 'black', fontWeight: '500' }}>
                Login
              </h2>
              <span className="alert-message">{invalid}</span>
              <form onSubmit={signIn}>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value); // Validate email on change
                  }}
                  className="form-control text-black-ph"
                  placeholder="User Email/Phone"
                  style={{ height: '50px' }}
                />
                <p className="alert-message">{alertEmail}</p>

                <div className="position-r">
                  <input
                    type={passwordShown ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value); // Validate password on change
                    }}
                    className="form-control text-black-ph"
                    placeholder="Password"
                    style={{ height: '50px' }}
                  />
                  <VscEye className="eye_icon_login" onClick={togglePassword} />
                </div>
                <p className="alert-message">{alertPass}</p>

                <div className="col-md-12 d-flex justify-content-center mt-4">
                  <button type="submit" className="btn btn-warning login-btn col-white">
                    Sign in
                  </button>
                </div>
                <hr />
                <p className="text-start">
                  <Link to="/ForgotPassword" className="heightlight-black text-center">
                    Forgot password?
                  </Link>
                </p>
                <p className="text-start login-text-2 pt-1 d-flex align-items-center" style={{ fontWeight: '400' }}>
                  Don't have an account? &nbsp;
                  <Link to="/register">
                    <b className="heightlight-black">Register Now</b>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
