import React, { useState, useEffect } from 'react'
import './signupLoginForm.css'
import WidthSizeCustHook from './WidthSizeCustHook'
import { connect } from 'react-redux'
import {
  signUpUserAction,
  signUpUserImageAction,
  logInUserAction,
  loginToken,
} from '../../_actions/actions/user_actions'
import ImageUpload from '../../shared/image_upload/imageUpload'
import { withRouter } from 'react-router-dom'

export function SignupLoginForm(props) {
  const [email, setEmail] = useState('email')
  const [password, setPassword] = useState('password')
  const [ConPassword, setConPassword] = useState('confirm password')
  const [strength, setStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [uploadedImage, setUploadedImage] = useState()
  const [showCssClasses, setShowCssClasses] = useState(false)
  const [showCssClassesTimeout, setShowCssClassesTimeout] = useState(false)
  const [matchingPasswords, setMatchingPasswords] = useState(false)
  // state for window width so i can render component conditinally:
  const [width, setWidth] = WidthSizeCustHook()
  // console.log(width)

  const [validations, setValidations] = useState([])

  const emailHandler = (e) => {
    setEmail(e.target.value)
  }

  useEffect(() => {
    if (email === '') {
      setEmail('email')
    }
  }, [email])

  const ConfirmPasswordHandler = (e) => {
    setConPassword(e.target.value)
  }

  useEffect(() => {
    if (ConPassword === '') {
      setConPassword('confirm password')
    }
    if (ConPassword === password) {
      setMatchingPasswords(true)
    }
    if (ConPassword !== password) {
      setMatchingPasswords(false)
    }
  }, [ConPassword])

  // thelo na trexei to use effect kathe fora pou alazei to to password state epidi to password den ginete re-render den thelo na trexei mesa sto idio function pou kano set to password
  useEffect(() => {
    if (password === '') {
      setPassword('password')
    }
    console.log('H')
    setValidations([
      password.length > 5,
      password.search(/[A-Z]/) > -1,
      password.search(/[0-9]/) > -1,
      password.search(/[$&+,:;=?@!#]/) > -1,
    ])
    // setStrength(validations.reduce((acc, cur) => acc + cur, 0))
  }, [password])

  // ftiaxno kai ena use effect na dtrexei otan alazei to valudation akrivos i idio logiki pou exo otan kai apo pano gia to validation otan alazei to password
  useEffect(() => {
    setStrength(validations.reduce((acc, cur) => acc + cur, 0))
  }, [validations])

  const validatePassword = (e) => {
    setPassword(e.target.value)
  }

  const showPasswordHandler = (argument) => {
    if (argument) {
      setShowPassword(true)
    }
    if (!argument) {
      setShowPassword(false)
    }
  }

  const addCssClassesHandler = () => {
    if (showCssClasses) {
      setShowCssClasses(false)
      setShowCssClassesTimeout(false)
      setEmail('email')
      setPassword('password')
    }
    if (!showCssClasses) {
      setShowCssClasses(true)
      setTimeout(function () {
        setShowCssClassesTimeout(true)
      }, 600)
      setEmail('email')
      setPassword('password')
    }
  }

  const uploadImageHandler = (item) => {
    setUploadedImage(item)
  }
  const sendDataToServer = async (event) => {
    event.preventDefault()
    //an den exo uploaded file stelno aplo action mono me json
    if (!uploadedImage) {
      //pernao 2 argument sto fucntion to ena einai ta data kai to alo to history oste otan einai eptixies to action na boro na kano to user redirect
      props.signUpUserAction(
        JSON.stringify({
          email: email,
          password: password,
        }),
        props.history,
      )
    }
    if (uploadedImage) {
      //pernao 4 argument sto fucntion to ena einai ta data kai to alo to history oste otan einai eptixies to action na boro na kano to user redirect
      props.signUpUserImageAction(email, password, uploadedImage, props.history)
    }
  }

  const LoginUser = async (event) => {
    event.preventDefault()
    //an den exo uploaded file stelno aplo action mono me json

    props.logInUserAction(
      JSON.stringify({
        email: email,
        password: password,
      }),
      props.history,
    )
  }

  if (width > 550) {
    return (
      <div className="sign-up-body">
        <div
          className={
            showCssClasses ? 'container right-panel-active' : 'container'
          }
          id="container"
        >
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={addCssClassesHandler}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={addCssClassesHandler}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            showCssClasses ? 'login-div login-div-active' : 'login-div'
          }
        >
          <div className="logo"></div>
          <div className="title">Log in</div>

          <div className="fields">
            <div className="username">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>

              <input
                type="username"
                className="user-input"
                onChange={emailHandler}
                placeholder={email}
              />
            </div>

            <div className="password">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="pass-input"
                placeholder={password}
                onChange={validatePassword}
              />
              <span
                className="toggle-password"
                onMouseEnter={() => showPasswordHandler(true)}
                onMouseLeave={() => showPasswordHandler(false)}
              >
                {showPassword ? '👁️' : '👁️'}
              </span>
            </div>
          </div>
          <button onClick={LoginUser} className="signin-button">
            Login
          </button>
        </div>

        <div
          className={
            showCssClassesTimeout
              ? 'login-div-login login-div-login-active'
              : 'login-div-login '
          }
        >
          <div className="logo"></div>
          <div className="title">Sign Up</div>

          <div className="fields">
            <div className="username">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>

              <input
                type="username"
                className="user-input"
                onChange={emailHandler}
                placeholder={email}
              />
            </div>

            <div className="password">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="pass-input"
                placeholder={password}
                onChange={validatePassword}
              />
              <span
                className="toggle-password"
                onMouseEnter={() => showPasswordHandler(true)}
                onMouseLeave={() => showPasswordHandler(false)}
              >
                {showPassword ? '👁️' : '👁️'}
              </span>
            </div>
            {password.length > 0 ? (
              <ul>
                <li>
                  {' '}
                  {validations[0] ? '✔️' : '❌'} must be at least 5 characters
                </li>
                <li>
                  {' '}
                  {validations[1] ? '✔️' : '❌'} must contain a capital letter
                </li>
                <li> {validations[2] ? '✔️' : '❌'} must contain a number</li>
                <li>
                  {' '}
                  {validations[3] ? '✔️' : '❌'} must contain one of $&+,:;=?@#
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  {' '}
                  {validations[0] ? '✔️' : '❌'} must be at least 5 characters
                </li>
                <li>
                  {' '}
                  {validations[1] ? '✔️' : '❌'} must contain a capital letter
                </li>
                <li> {validations[2] ? '✔️' : '❌'} must contain a number</li>
                <li>
                  {' '}
                  {validations[3] ? '✔️' : '❌'} must contain one of $&+,:;=?@#
                </li>
              </ul>
            )}
            <div className="password">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="pass-input"
                placeholder={ConPassword}
                onChange={ConfirmPasswordHandler}
              />
              <span
                className="toggle-password"
                onMouseEnter={() => showPasswordHandler(true)}
                onMouseLeave={() => showPasswordHandler(false)}
              >
                {showPassword ? '👁️' : '👁️'}
              </span>
            </div>

            <ImageUpload center uploadImageHandler={uploadImageHandler} />
          </div>

          <button
            type="button"
            disabled={!matchingPasswords}
            className="signin-button"
            onClick={sendDataToServer}
          >
            Sign Up
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div className="sign-up-body">
        <label className="switch" style={{ marginTop: '10px' }}>
          <input type="checkbox" id="togBtn" onClick={addCssClassesHandler} />
          <div className="slider round"></div>
        </label>
        <div
          className={
            showCssClassesTimeout
              ? 'login-div-small  display-help '
              : 'login-div-small '
          }
        >
          <div className="logo"></div>
          <div className="title">Log in</div>

          <div className="fields">
            <div className="username">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>

              <input
                type="username"
                className="user-input"
                onChange={emailHandler}
                placeholder={email}
              />
            </div>

            <div className="password">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="pass-input"
                placeholder={password}
                onChange={validatePassword}
              />
              <span
                className="toggle-password"
                onMouseEnter={() => showPasswordHandler(true)}
                onMouseLeave={() => showPasswordHandler(false)}
              >
                {showPassword ? '👁️' : '👁️'}
              </span>
            </div>
          </div>
          <button onClick={LoginUser} className="signin-button">
            Login
          </button>
        </div>

        <div
          className={
            showCssClassesTimeout
              ? 'login-div-small '
              : 'login-div-small display-help'
          }
        >
          <div className="logo"></div>
          <div className="title">Sign Up</div>

          <div className="fields">
            <div className="username">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>

              <input
                type="username"
                className="user-input"
                onChange={emailHandler}
                placeholder={email}
              />
            </div>

            <div className="password">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="pass-input"
                placeholder={password}
                onChange={validatePassword}
              />
              <span
                className="toggle-password"
                onMouseEnter={() => showPasswordHandler(true)}
                onMouseLeave={() => showPasswordHandler(false)}
              >
                {showPassword ? '👁️' : '👁️'}
              </span>
            </div>
            {password.length > 0 ? (
              <ul>
                <li>
                  {' '}
                  {validations[0] ? '✔️' : '❌'} must be at least 5 characters
                </li>
                <li>
                  {' '}
                  {validations[1] ? '✔️' : '❌'} must contain a capital letter
                </li>
                <li> {validations[2] ? '✔️' : '❌'} must contain a number</li>
                <li>
                  {' '}
                  {validations[3] ? '✔️' : '❌'} must contain one of $&+,:;=?@#
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  {' '}
                  {validations[0] ? '✔️' : '❌'} must be at least 5 characters
                </li>
                <li>
                  {' '}
                  {validations[1] ? '✔️' : '❌'} must contain a capital letter
                </li>
                <li> {validations[2] ? '✔️' : '❌'} must contain a number</li>
                <li>
                  {' '}
                  {validations[3] ? '✔️' : '❌'} must contain one of $&+,:;=?@#
                </li>
              </ul>
            )}
            <div className="password">
              <svg className="svg-icon" fill="#999" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="pass-input"
                placeholder={ConPassword}
                onChange={ConfirmPasswordHandler}
              />
              <span
                className="toggle-password"
                onMouseEnter={() => showPasswordHandler(true)}
                onMouseLeave={() => showPasswordHandler(false)}
              >
                {showPassword ? '👁️' : '👁️'}
              </span>
            </div>
            <ImageUpload center uploadImageHandler={uploadImageHandler} />
          </div>

          <button
            type="button"
            disabled={!matchingPasswords}
            className="signin-button"
            onClick={sendDataToServer}
          >
            Sign Up
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
  }
}

const mapDispatchToProps = {
  // prepei na kano import sto conmponent to action pou thelo apo to actions.js file
  signUpUserAction: signUpUserAction,
  signUpUserImageAction: signUpUserImageAction,
  logInUserAction: logInUserAction,
  loginToken: loginToken,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SignupLoginForm))
