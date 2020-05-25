import React from "react";
import Signup from "./pages/signup/Signup";
import { Route, Switch } from "react-router-dom";
//kan import ena test page gia na dokimaso to protected route sto frontend afto den exi na kani me to backedn apla thelo na do an boro sto fornted na pao se afto to route mono an exo token ola ta data ta pernoa etsi kai alios apo to bakcend afto eini gia na einai pio oreo to expriense tou user osta na tou leo na kanei login an dne exei token gia na paei se sigkriemeno route
import user_test_page from "./pages/dummy_pages/user_test_page";
//kano improt to helper function pou exo ftiaksi gia to functionaltiy pou thelo

import auth_check from "./util/auth_check";

import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <Signup /> */}
      <Switch>
        <Route exact path="/" component={Signup} />
        <Route exact path="/test" component={auth_check(user_test_page)} />
        {/* <Route exact path="/test" component={user_test_page} /> */}
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

export default App;
