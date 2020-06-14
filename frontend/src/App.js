import React from "react";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import HomePage from "./pages/dummy_pages/HomePage";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
//kan import ena test page gia na dokimaso to protected route sto frontend afto den exi na kani me to backedn apla thelo na do an boro sto fornted na pao se afto to route mono an exo token ola ta data ta pernoa etsi kai alios apo to bakcend afto eini gia na einai pio oreo to expriense tou user osta na tou leo na kanei login an dne exei token gia na paei se sigkriemeno route
import user_test_page from "./pages/dummy_pages/user_test_page";
//kano improt to helper function pou exo ftiaksi gia to functionaltiy pou thelo

import auth_check from "./util/auth_check";
import Navbar from "./pages/navbar/Navbar";

import "./App.css";

function App(props) {
  return (
    <div className="App">
      {props.token ? <Navbar /> : <div>alo navbar</div>}

      {/* boro giro apo to switch stamtent na valo ena div/main tag kai na valo to css pou exo sto Navbar.css gia na kano push olo to contnate apo ta componets pou kano render pros ta deksia giati exo kai to navbar pou piani xoro */}
      <Switch>
        <Route exact path="/home" component={auth_check(HomePage)} />
        <Route exact path="/" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/test" component={auth_check(user_test_page)} />
        {/* <Route exact path="/test" component={user_test_page} /> */}
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
