import React, { Component } from 'react';
import { config } from './utility/Constants'


class Signup extends Component {

  handleSubmit = event => {
    event.preventDefault();
    var formData = new FormData();
    formData.append("username", this.inputNode1.value);
    formData.append("firstname", this.inputNode2.value);
    formData.append("lastname", this.inputNode3.value);
    formData.append("email", this.inputNode4.value);
    formData.append("password", this.inputNode5.value);

    var formDataToken = new FormData();
    formDataToken.append("username", this.inputNode1.value);
    formDataToken.append("password", this.inputNode5.value);
    console.log(formDataToken)
    let url = config.url.BASE_URL + 'users'
    let url2 = config.url.BASE_URL + 'tokens'

    fetch(url,
    { method: 'POST', body: formDataToken })
    .then(() =>
    fetch(url2,
    { method: 'POST', body: formDataToken}))
    .then(res => res.json()).then(res => (console.log(res.jwt),
    window.localStorage.setItem('jwt', res.jwt)))
    .then(() => this.props.history.push('/'))
    .catch(function(error){console.log('There is an error: ', error.message)})
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='username'>Username</label><br />
          <input type='username' id='username' name='username' ref={node => {this.inputNode1 = node}}/>
          <br />
          <label htmlFor='firstname'>First Name</label><br />
          <input type='text' id='firstname' name='firstname' ref={node => {this.inputNode2 = node}}/>
          <br />
          <label htmlFor='firstname'>Last Name</label><br />
          <input type='text' id='lastname' name='lastname' ref={node => {this.inputNode3 = node}}/>
          <br />
          <label htmlFor='email'>Email</label><br />
          <input type='email' id='email' name='email' ref={node => {this.inputNode4 = node}}/>
          <br />
          <label htmlFor='password'>Password</label><br />
          <input type='password' id='password' name='password' ref={node => {this.inputNode5 = node}}/>
          <br />
          <input type='submit' value='Sign Up'/>
        </form>
      </div>
    )
  }

}

export default Signup;
