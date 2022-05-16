import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import Profile from './components/Profile';
import Rankings from './components/Rankings';
import NewEvent from './components/NewEvent';
import Header from './components/Header';
import Ticker from './components/Ticker';
import Login from './components/LoginGoogle';
import Logout from './components/LogoutGoogle';
import ViewUser from './components/ViewUser';
import PasswordReset from './components/PasswordReset';
import ContactInfo from './components/ContactInfo';
import jwtDecode from 'jwt-decode'
import styles from './App.css'
// import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  render() {
    let jwt = window.localStorage.getItem('jwt');
    if(jwt){
      let result = jwtDecode(jwt)
      if(result.username){
    return (
      <div className="app-body">
        <Router>
        <Route exact path = "/thisplace" component={ContactInfo} />
        <Route path='/' component={Header} />
        <Route path='/rankings' component={Ticker} />
          <div>
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/register' component={Signup} />
            <Route exact path='/' component={Profile} />
            <Route exact path='/profile' component={Profile} />
            <Route path='/profile/:id' component={ViewUser}/>
            <Route exact path='/rankings' component={Rankings} />
            <Route exact path='/results' component={NewEvent} />
          </div>
        </Router>

      </div>
    );
  }
}else {
    return (
      <div className="app-body">
        <Router>
        <Route path='/' component={Header} />
        <Route path='/rankings' component={Ticker} />
          <div>
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/register' component={Signup} />
            <Route exact path='/' component={Signin} />
            <Route exact path='/profile' component={Profile} />
            <Route path='/profile/:id' component={ViewUser}/>
            <Route exact path='/rankings' component={Rankings} />
            <Route exact path='/results' component={NewEvent} />
            <Route exact path = '/testing' component={Login} />
            <Route exact path = '/testing' component={Logout} />
            <Route path = '/password/reset' component={PasswordReset}/>
          </div>
        </Router>

      </div>
    );
  }

  }
}

export default App;
