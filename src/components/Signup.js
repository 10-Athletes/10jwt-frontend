import React, { Component } from 'react';
import { config } from './utility/Constants'
// import "./Signup.module.css"

let logo = "/logo2.png"
let bg = "/bg.jpg"


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
    { method: 'POST', body: formData })
    .then(() =>
    fetch(url2,
    { method: 'POST', body: formDataToken}))
    // eslint-disable-next-line
    .then(res => res.json()).then(res => (console.log(res.jwt),
    window.localStorage.setItem('jwt', res.jwt)))
    .then(() => this.props.history.push('/'))
    .catch(function(error){console.log('There is an error: ', error.message)})
  }

  render() {
    return (
      <div>
        <main>
          <form onSubmit={this.handleSubmit}>
            <img src={logo} alt="logo" id="logo" width="50" height="50" />
            <label htmlFor="username">
              Username
              <input
                type="username"
                id="username"
                name="username"
                ref={(node) => {
                  this.inputNode1 = node;
                }}
              />
            </label>
            <label htmlFor="firstname">
              First Name{" "}
              <input
                type="text"
                id="firstname"
                name="firstname"
                ref={(node) => {
                  this.inputNode2 = node;
                }}
              />
            </label>
            <label htmlFor="firstname">
              Last Name
              <input
                type="text"
                id="lastname"
                name="lastname"
                ref={(node) => {
                  this.inputNode3 = node;
                }}
              />
            </label>
            <label htmlFor="email">
              Email{" "}
              <input
                type="email"
                id="email"
                name="email"
                ref={(node) => {
                  this.inputNode4 = node;
                }}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                type="password"
                id="password"
                name="password"
                ref={(node) => {
                  this.inputNode5 = node;
                }}
              />
            </label>
            <div id="inlineSlot blueBtn">
              <label htmlFor="register">
                {" "}
                <button id="signin" type="submit">
                  Register
                </button>
              </label>
              <a href="/signin">
                <label id="signinLabel" htmlFor="signin">
                  {" "}
                  <button id="register" type="button">
                    Sign In
                  </button>
                </label>{" "}
              </a>
            </div>
          </form>{" "}
          <img src={bg} alt="bg" className="run" />
        </main>
      </div>
    );
  }

}

export default Signup;
