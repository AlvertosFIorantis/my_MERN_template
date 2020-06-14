import React, { useState, useEffect } from "react";
import "./signup.css";
import axios from "axios";
import { connect } from "react-redux";
import {
  signUpUserAction,
  signUpUserImageAction,
} from "../../_actions/actions/user_actions";
import ImageUpload from "../../shared/image_upload/imageUpload";
import { withRouter } from "react-router-dom";

function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState();

  const [validations, setValidations] = useState([]);

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  // thelo na trexei to use effect kathe fora pou alazei to to password state epidi to password den ginete re-render den thelo na trexei mesa sto idio function pou kano set to password
  useEffect(() => {
    console.log("H");
    setValidations([
      password.length > 5,
      password.search(/[A-Z]/) > -1,
      password.search(/[0-9]/) > -1,
      password.search(/[$&+,:;=?@!#]/) > -1,
    ]);
    // setStrength(validations.reduce((acc, cur) => acc + cur, 0))
  }, [password]);

  // ftiaxno kai ena use effect na dtrexei otan alazei to valudation akrivos i idio logiki pou exo otan kai apo pano gia to validation otan alazei to password
  useEffect(() => {
    setStrength(validations.reduce((acc, cur) => acc + cur, 0));
  }, [validations]);

  const validatePassword = (e) => {
    setPassword(e.target.value);

    // setValidations([
    //   password.length > 5,
    //   password.search(/[A-Z]/) > -1,
    //   password.search(/[0-9]/) > -1,
    //   password.search(/[$&+,:;=?@#]/) > -1,
    // ])
    // setStrength(validations.reduce((acc, cur) => acc + cur, 0))
  };

  const showPasswordHandler = (argument) => {
    if (argument) {
      setShowPassword(true);
    }
    if (!argument) {
      setShowPassword(false);
    }
  };

  // const sendDataToServer = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const responseData = await axios({
  //       method: "POST",
  //       url: "http://localhost:5000/api/users/signup",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       data: JSON.stringify({
  //         email: email,
  //         password: password,
  //       }),
  //     });
  //     // epidi apo to backend tora perno ena alo field to value pou perpeoi na paro sto front eund gia na exo prosvasi sto userId eian to userId den stelno pleon ena obkect pou eian o user kai ekei eian to id stelno kateftina to user id an kai tah borousan a aestelan olo to object Thelo tora ektos apo to ID na pernao kai to token kai etsi akrivos to leo sto backend token
  //     setToken(responseData.data.token);
  //     console.log(responseData);
  //   } catch (err) {
  //     console.log(err.response.data.message);
  //   }
  // };
  const sendDataToServer = async (event) => {
    event.preventDefault();
    //an den exo uploaded file stelno aplo action mono me json
    if (!uploadedImage) {
      //pernao 2 argument sto fucntion to ena einai ta data kai to alo to history oste otan einai eptixies to action na boro na kano to user redirect
      props.signUpUserAction(
        JSON.stringify({
          email: email,
          password: password,
        }),
        props.history
      );
    }
    if (uploadedImage) {
      //pernao 4 argument sto fucntion to ena einai ta data kai to alo to history oste otan einai eptixies to action na boro na kano to user redirect
      props.signUpUserImageAction(
        email,
        password,
        uploadedImage,
        props.history
      );
    }
  };

  const uploadImageHandler = (item) => {
    setUploadedImage(item);
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
            className={strength > 3 ? " input valid" : "input invalid"}
          />
          <label
            htmlFor="password"
            className={password.length > 0 ? "label extraclass" : "label"}
          >
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
        {/* Na afereso afto to div an dne thelo na fente i grames me to pos dinato einai to apssword mou */}
        <div className="strength">
          <span className={strength > 0 ? "bar bar-1 bar-show" : "bar bar-1"} />
          <span className={strength > 1 ? "bar bar-2 bar-show" : "bar bar-2"} />
          <span className={strength > 2 ? "bar bar-3 bar-show" : "bar bar-3"} />
          <span className={strength > 3 ? "bar bar-4 bar-show" : "bar bar-4"} />
        </div>

        {/* contionlarly rentder if vlaidation.lenghth iparxei afot kanei to && */}
        {password.length > 0 ? (
          <ul>
            <li>
              {" "}
              {validations[0] ? "✔️" : "❌"} must be at least 5 characters
            </li>
            <li>
              {" "}
              {validations[1] ? "✔️" : "❌"} must contain a capital letter
            </li>
            <li> {validations[2] ? "✔️" : "❌"} must contain a number</li>
            <li>
              {" "}
              {validations[3] ? "✔️" : "❌"} must contain one of $&+,:;=?@#
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              {" "}
              {validations[0] ? "✔️" : "❌"} must be at least 5 characters
            </li>
            <li>
              {" "}
              {validations[1] ? "✔️" : "❌"} must contain a capital letter
            </li>
            <li> {validations[2] ? "✔️" : "❌"} must contain a number</li>
            <li>
              {" "}
              {validations[3] ? "✔️" : "❌"} must contain one of $&+,:;=?@#
            </li>
          </ul>
        )}
        {/* to center eiani ena prop pou pernao sto componte  gian na alakso to css sto compoente oste na to valo sto kedro */}
        <ImageUpload center uploadImageHandler={uploadImageHandler} />

        <button disabled={strength < 4} onClick={sendDataToServer}>
          Sign Up
        </button>
        <button onClick={protectedRouteHandler}>protected route</button>
        <button onClick={ProtectedRouteFrontEnd}>
          protected route FrontEnd
        </button>
      </form>
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
  };
};

const mapDispatchToProps = {
  // prepei na kano import sto conmponent to action pou thelo apo to actions.js file
  signUpUserAction: signUpUserAction,
  signUpUserImageAction: signUpUserImageAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signup));
//xirisimopio to withRouter gia na boro na exo access sto history mesa sto action opote an einai eptixes to action na boro na kano redirect se alo url ton xiristi
// tora sto action perano 2 arguments to ena eiani ta data kai to alo to props.history gia na boro na to exo access mesa sto action

// sto link boro na do pos xrisimopio to "withROuter"
// https://stackoverflow.com/questions/54036562/how-to-redirect-from-an-action-event-in-redux
