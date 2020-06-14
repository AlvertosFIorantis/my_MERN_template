import React, { useState, useEffect } from "react";
// import "./login.css";
import axios from "axios";
import { connect } from "react-redux";
import { logInUserAction } from "../../_actions/actions/user_actions";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const validatePassword = (e) => {
    setPassword(e.target.value);
  };

  const showPasswordHandler = (argument) => {
    if (argument) {
      setShowPassword(true);
    }
    if (!argument) {
      setShowPassword(false);
    }
  };

  const sendDataToServer = async (event) => {
    event.preventDefault();
    //an den exo uploaded file stelno aplo action mono me json

    props.logInUserAction(
      JSON.stringify({
        email: email,
        password: password,
      })
    );
  };

  const protectedRouteHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await axios({
        method: "GET",
        url: "http://localhost:5000/test_protected_route",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      });
      console.log(responseData);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const ProtectedRouteFrontEnd = (event) => {
    event.preventDefault();
    //gia frontennd
    props.history.push("/test");
  };
  return (
    <main className="background">
      <form>
        <div className="field">
          <input
            type="email"
            name="email"
            className="input"
            onChange={emailHandler}
            placeholder={email}
          />
          <label
            htmlFor="email"
            className={email.length > 0 ? "label extraclass" : "label"}
          >
            Email
          </label>
        </div>

        <div className="field">
          <input
            type={showPassword ? "text" : "password"}
            name="email"
            // className="input"
            placeholder={password}
            onChange={validatePassword}
            className={" input valid"}
          />
          <label htmlFor="password" className={"label extraclass"}>
            Password
          </label>
          <span
            className="toggle-password"
            onMouseEnter={() => showPasswordHandler(true)}
            onMouseLeave={() => showPasswordHandler(false)}
          >
            {showPassword ? "👁️" : "👁️"}
          </span>
        </div>

        <button onClick={sendDataToServer}>Sign Up</button>
        <button onClick={protectedRouteHandler}>protected route</button>
        <button onClick={ProtectedRouteFrontEnd}>
          protected route FrontEnd
        </button>
      </form>
      {/* <img src={props.userImage} alt="image" /> */}
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    userImage: state.user.image,
  };
};

const mapDispatchToProps = {
  // prepei na kano import sto conmponent to action pou thelo apo to actions.js file
  logInUserAction: logInUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
