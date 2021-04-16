import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'
import Profile from "./templates/ProfileBtn";
import Logout from "./templates/LogoutBtn";
// import { config } from './utility/Constants'
import {Container, Row, Col} from "reactstrap";

class Welcome extends Component {
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
        <Container style={{background: '#eee', height: '500px', marginTop:'5%', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
          <Row>
            <Col xs="6">
              <Container>
                <h3>
                  Welcome back, {this.state.username},<br />
                  <small>use the links above to navigate</small>
                </h3>
              </Container>
            </Col>
            <Col xs="6">
              <Container>
                <Logout onClick={this.handleLogout}>Logout</Logout> &nbsp;
                <Profile onClick={this.handleProfileClick}>Profile</Profile>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

}

export default Welcome;
