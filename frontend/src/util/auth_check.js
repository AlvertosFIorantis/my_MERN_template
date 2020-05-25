import React, { useEffect } from "react";
import { useSelector } from "react-redux";

//function gia na exo protected routes sto fornted ara tha ginome redriect mono an exo token sto redux store kai edo epistis adi na xrisimopio to mapStateToProps xrisimopio to user selector gia na ex prosvasi sto redux store/state

export default function (SpecificComponent) {
  function AuthenticationCheck(props) {
    let theSelector = useSelector((state) => state.user.token);
    console.log(theSelector);
    useEffect(() => {
      if (theSelector === null) {
        props.history.push("/");
        console.log("test");
      }
    }, []);

    return <SpecificComponent {...props} />;
  }
  return AuthenticationCheck;
}
