import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import Profile from './components/Profile';
import Rankings from './components/Rankings';
import NewEvent from './components/NewEvent';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/register' component={Signup} />
            <Route exact path='/' component={Welcome} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/rankings' component={Rankings} />
            <Route exact path='/results' component={NewEvent} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
