import React, { useEffect } from 'react'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Logout from './pages/logout/Logout'
import HomePage from './pages/dummy_pages/HomePage'
import SignupLoginForm from './pages/SignupLoginForm/SignupLoginForm'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
// to wihtRouter to thelo gia na exo access sto props.history kai na boro na to peraso san aargumetn sto action !!!
import { withRouter } from 'react-router-dom'

//kan import ena test page gia na dokimaso to protected route sto frontend afto den exi na kani me to backedn apla thelo na do an boro sto fornted na pao se afto to route mono an exo token ola ta data ta pernoa etsi kai alios apo to bakcend afto eini gia na einai pio oreo to expriense tou user osta na tou leo na kanei login an dne exei token gia na paei se sigkriemeno route
import user_test_page from './pages/dummy_pages/user_test_page'
//kano improt to helper function pou exo ftiaksi gia to functionaltiy pou thelo

import auth_check from './util/auth_check'
import Navbar from './pages/navbar/Navbar'

// Kano import to action gia na boro na kano refresh to token apo to local storage
import { loginToken } from './_actions/actions/user_actions'

function App(props) {
  // Function to check from logal storage if the user is autheticated
  const checkAuthenticated = () => {
    console.log('running login action')
    props.loginToken(props.history)
  }

  useEffect(() => {
    checkAuthenticated()
  }, [])

  return (
    <div className="App">
      {props.token ? <Navbar /> : null}

      {/* boro giro apo to switch stamtent na valo ena div/main tag kai na valo to css pou exo sto Navbar.css gia na kano push olo to contnate apo ta componets pou kano render pros ta deksia giati exo kai to navbar pou piani xoro */}

      <div className="container">
        <Switch>
          <Route exact path="/" component={SignupLoginForm} />
          {/* <Route exact path="/login" component={Login} /> */}
          <Route exact path="/home" component={auth_check(HomePage)} />
          {/* <Route exact path="/" component={Signup} /> */}

          <Route exact path="/test" component={auth_check(user_test_page)} />
          <Route exact path="/logout" component={auth_check(Logout)} />
          {/* <Route exact path="/test" component={user_test_page} /> */}
          <Route path="*" component={() => '404 NOT FOUND'} />
        </Switch>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
  }
}

const mapDispatchToProps = {
  loginToken: loginToken,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))

// xriazete na valo to withRouter gian axpo prosvasi sto props.history oste na to peraso sto action loginToken gia na kano verify to token apo to local storage
// kai na boron na to kano push,histoty gia na alkos URL kai component otan akno load to app gia proti fora kai exo token sto local storage
