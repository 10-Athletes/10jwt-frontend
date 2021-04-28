import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'
import Profile from "./templates/ProfileBtn";
import Logout from "./templates/LogoutBtn";
// import { config } from './utility/Constants'
import {Container, Row, Col, NavLink} from "reactstrap";

export default class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: undefined
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);

  }

  componentDidMount(){
    let jwt = window.localStorage.getItem('jwt');
    if(jwt){
      let result = jwtDecode(jwt)
      if(result.username){
        this.setState({username: result.username})
      }
    }
    else{
      this.props.history.push('/register')
    }

  }

  handleLogout () {
    window.localStorage.removeItem('jwt')
    this.props.history.push('/register')
  }

  handleProfileClick(){
    this.props.history.push('/profile')
  }

  render(){
    return (
      <div>
        <Container style={{marginTop: '1rem',width: '100%'}} fluid>
          <Row>
            <Col>
              <Container style={{border: '1px solid #eee', padding: '2em'}}>
                <h3>
                  Welcome back, {this.state.username},<br />
                  <small>use the links above to navigate</small>
                </h3>
              </Container>
            </Col>
            <Col>
              <Container style={{border: '1px solid #eee', padding: '2em'}}>
                  <NavLink className="btn-primary" href="/ranking/">View Rankings</NavLink>
                  <NavLink className="btn-info" href="/profile/">View Profile</NavLink>
                  <NavLink className="btn-muted" href="/logout/">Logout</NavLink>
                
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

}
