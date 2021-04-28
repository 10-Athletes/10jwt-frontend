import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Profile from './components/Profile';
import Rankings from './components/Rankings';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import NewEvent from './components/NewEvent';
import NB from "./components/NB";
let bg = "./bg2.jpg";
class App extends Component {
  
  render() {
    return (
      <div>
        <Router>
          
          <div>
              <NB></NB>
            <Container fluid style={{width: '100%', marginTop: '1em'}}>
            
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/register" component={Signup} />
            <Route exact path="/" component={Welcome} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/rankings" component={Rankings} />
              <Route exact path="/results" component={NewEvent} />
              </Container>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
