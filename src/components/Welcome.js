import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'

import { config } from './utility/Constants'

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
    return(
      <div>
      <button onClick={this.handleLogout}>Logout</button><br />
      <button onClick={this.handleProfileClick}>Profile</button><br />
        <h1>hello {this.state.username}</h1>
      </div>
    )
  }

}

export default Welcome;
