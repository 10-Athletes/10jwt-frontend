import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import Profile from './components/Profile';
import Rankings from './components/Rankings';
import NewEvent from './components/NewEvent';
import Header from './components/Header';
import ViewUser from './components/ViewUser';
import Navigation from './components/Navigation';
import jwtDecode from 'jwt-decode'
// import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  render() {
    let jwt = window.localStorage.getItem('jwt');
    if(jwt){
      let result = jwtDecode(jwt)
      if(result.username){
    return (
      <div>
        <Router>
        <Route path='/' component={Navigation} />
          <div>
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/register' component={Signup} />
            <Route exact path='/' component={Profile} />
            <Route exact path='/profile' component={Profile} />
            <Route path='/profile/:id' component={ViewUser} />
            <Route exact path='/rankings' component={Rankings} />
            <Route exact path='/results' component={NewEvent} />
          </div>
        </Router>
      </div>
    );
  }
}else {
    return (
      <div>
        <Router>
        <Route path='/' component={Navigation} />
          <div>
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/register' component={Signup} />
            <Route exact path='/' component={Signin} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/rankings' component={Rankings} />
            <Route exact path='/results' component={NewEvent} />
          </div>
        </Router>
      </div>
    );
  }

  }
}

export default App;
