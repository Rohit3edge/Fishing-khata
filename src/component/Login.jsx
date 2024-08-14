import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../img/logos/kisaankhatalogo.png";
import { login } from "../store/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "semantic-ui-react";
import { VscEye } from "react-icons/vsc";

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertpass, setAlertpass] = useState("");

  const navigate = useNavigate("");
  const { loading, error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  async function signIn(e) {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(({ message }) => {
        alert(message);
      });
  }

  const save = (e) => {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
 const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (regEmail.test(email)) {
      setAlertEmail("");
    } else if (!regEmail.test(email) && email === "") {
      setAlertEmail("Please enter your mobile number or email");
      e.preventDefault("");
    }

    const regPass = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,8}$/;
    if (regPass.test(password)) {
      setAlertpass("");
    } else if (!regPass.test(password) && password === "") {
      setAlertpass("Please enter your password");
      e.preventDefault("");
    } else {
      setAlertpass("");
    }
  };

  return (
    <div>
      <section className="login-bg-image">
        <div className="bg-overlay-orange" />

        <div className="card-section">
          <div className="d-flex justify-content-around align-items-center">
            <div className="">
            <img src={logo} alt="travel-logo" className="div-logo" />
            </div>
            

            <div className="login-form-2">
              {/*error && <Alert variant="danger">{error}</Alert>*/}
              <div className="d-flex justify-content-center">
                <img src={logo} alt="logo" className="logo-form-2" />
              </div>
              <h2
                className="text-start mb-4"
                style={{ color: "black", fontWeight: "500" }}
              >
                Login
              </h2>

              <form onSubmit={signIn}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control text-black-ph"
                  placeholder="User Email/Phone"
                  style={{ height: "50px" }}
                />
                <p className="alert-message">{alertEmail}</p>

                <div className="position-r">
                  <input
                    type={passwordShown ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control text-black-ph"
                    placeholder="Password"
                    style={{ height: "50px" }}
                  />
                  <VscEye className="eye_icon_login" onClick={togglePassword} />
                </div>
                <p className="alert-message">{alertpass}</p>

                <div className="col-md-12 d-flex justify-content-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-warning login-btn col-white"
                    onClick={save}
                  >
                    Sign in
                  </button>
                </div>
                <hr />
                <p className="text-start">
                  <Link
                    to="/ForgotPassword"
                    className="heightlight-black text-center"
                  >
                    Forgot password ?
                  </Link>
                </p>
                <p
                  className="text-start login-text-2 pt-1  d-flex align-items-center"
                  style={{ fontWeight: "400" }}
                >
                  Don't have an account? &nbsp;
                 
                    <Link to="/register">
                      <b className="heightlight-black"> Register Now</b>
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
