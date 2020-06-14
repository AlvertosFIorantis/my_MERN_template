import axios from "axios";

export const logInUserAction = (dataFromComponent) => async (
  dispatch,
  getState
) => {
  // edo vazo to logic pou thelo na ekteleite sto async request gia paradigma an thelo na alakso kati apo ta data pou perno apo to api peso ti gia pradigma ot iperno kati data apo to backend kai thelo na ta peraso san payload gia paradgiam exo token apo to logged in user
  try {
    const responseData = await axios({
      method: "POST",
      url: "http://localhost:5000/api/users/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: dataFromComponent,
    });
    // otan telioso oti thelo na kano pali kano return to object opos exo kai sta apla action apla i idiafora tora einai oti adi gia return object exo dispatch to object
    console.log(responseData.data);
    dispatch({
      type: "LOGIN_USER",
      // boro na peraso san payload pragmata pou perno apo to backend
      payload: responseData.data,
    });
  } catch (err) {
    dispatch({
      type: "AUTH_FAILED",
      // boro na peraso san payload pragmata pou perno apo to backend
      payload: err.response.data,
    });
  }
};

//pernao 2 argument sto fucntion to ena einai ta data kai to alo to history oste otan einai eptixies to action na boro na kano to user redirect
export const signUpUserAction = (dataFromComponent, history) => async (
  dispatch,
  getState
) => {
  // edo vazo to logic pou thelo na ekteleite sto async request gia paradigma an thelo na alakso kati apo ta data pou perno apo to api peso ti gia pradigma ot iperno kati data apo to backend kai thelo na ta peraso san payload gia paradgiam exo token apo to logged in user
  try {
    const responseData = await axios({
      method: "POST",
      url: "http://localhost:5000/api/users/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: dataFromComponent,
    });
    // otan telioso oti thelo na kano pali kano return to object opos exo kai sta apla action apla i idiafora tora einai oti adi gia return object exo dispatch to object

    dispatch({
      type: "SIGNUP_USER",
      // boro na peraso san payload pragmata pou perno apo to backend
      payload: responseData.data,
    });
    console.log("recieved data from backend");
    history.push("/home");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "AUTH_FAILED",
      // boro na peraso san payload pragmata pou perno apo to backend
      payload: err.response.data,
    });
    console.log("some error from backend");
  }
};

//ftiaxno ean deftero action gia na kano signup stelnodas data sto server pou mazi stenlo kai image ektos apo text. Apo ti stigmi pou thelo na stilo image den boro na xrisimopiso json opote prepei na stilo form data. Sto form data boro na stilo kanonika kai json data kai image data opote ta inpub gia to email kai to passwrod eiani akrivos to idio kai theoritka tha borousa na eixa ena function pou na estlna piso form data ala thelo gia parctice na ta kano ksexorista

// to history pou pernao eian igia na boro na kano redirect to user an einai eptixes to action
export const signUpUserImageAction = (
  email,
  password,
  image,
  history
) => async (dispatch, getState) => {
  // edo vazo to logic pou thelo na ekteleite sto async request gia paradigma an thelo na alakso kati apo ta data pou perno apo to api peso ti gia pradigma ot iperno kati data apo to backend kai thelo na ta peraso san payload gia paradgiam exo token apo to logged in user
  try {
    //dimiourgo form data gia na boro na stilo image kai text data sto backend
    const formData = new FormData();
    //mesa sto quation vazo to "key" san na exo json format
    formData.append("email", email);
    formData.append("password", password);

    //edo vazo key image giati kai sto backend sot middelware psanxno gia image
    formData.append("image", image);
    console.log("image", image);
    const responseData = await axios({
      method: "POST",
      url: "http://localhost:5000/api/users/signup",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    // otan telioso oti thelo na kano pali kano return to object opos exo kai sta apla action apla i idiafora tora einai oti adi gia return object exo dispatch to object

    dispatch({
      type: "SIGNUP_USER_IMAGE",
      // boro na peraso san payload pragmata pou perno apo to backend
      payload: responseData.data,
    });
    console.log("received data from backend");
    history.push("/home");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "AUTH_FAILED",
      // boro na peraso san payload pragmata pou perno apo to backend
      payload: err.response.data,
    });
    console.log("some error from backend");
  }
};
