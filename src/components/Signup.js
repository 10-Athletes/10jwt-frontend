import React, { Component } from 'react';
import {BrowserView, MobileView} from 'react-device-detect';
import { config } from './utility/Constants'
import Background from './bg.jpeg'
import Logo from './logo.png'
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
      <MobileView>
      <div style={{float: 'left', width: "50%"}}>
      <div style={{marginLeft: "10%", marginTop: "15vh", height: '17.5vh', fontFamily: "Copperplate", fontSize: '15vh'}}>
      10Athletes
      </div>
      <div style={{marginLeft: "5%", backgroundRepeat: 'no-repeat', backgroundImage: `url(${Background})`, height: '49.5vh', paddingBottom: '9.5vh'}}>
      </div>
      </div>
      <br/>
      <br/>
      <br/>
        <main >
          <form align="center" style={{fontSize: 'xx-large'}} onSubmit={this.handleSubmit}>
          <div align="center" style={{marginLeft: '57.5%', marginRight: '17.5%', backgroundColor: "white", border: "3px solid #435685", width: "25%"}}>
          <br/><b>Sign Up</b><br/><br/>
            <div >
              <label htmlFor="username">
                <input
                  style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="username"
                  id="username"
                  name="username"
                  placeholder="   Username"
                  ref={(node) => {
                    this.inputNode1 = node;
                  }}
                />
                <br/><br/>
              </label>
              <label htmlFor="firstname">
                <input
                style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="   First Name"
                  ref={(node) => {
                    this.inputNode2 = node;
                  }}
                />
              </label>
              <br/><br/>
              <label htmlFor="firstname">
                <input
                style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="   Last Name"
                  ref={(node) => {
                    this.inputNode3 = node;
                  }}
                />
              </label>
              <br/><br/>
              <label htmlFor="email">
                <input
                style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="   Email"
                  ref={(node) => {
                    this.inputNode4 = node;
                  }}
                />
              </label>
              <br/><br/>

              <label htmlFor="password">
                <input
                  style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="   Password"
                  ref={(node) => {
                    this.inputNode5 = node;
                  }}
                />
              </label>
              <br/>
              <br/>
              <div id="inlineSlot blueBtn" align="center">
                <label htmlFor="register">
                  {" "}
                  <button id="signin" type="submit" style={{color: "white", backgroundColor: "#42B729", width: '40%', height: '3em', fontSize: "large"}}>
                    <b style={{fontSize: "x-large"}}>Sign Up</b>
                  </button>
                  <br/><br/>
                </label>
                    {" "}
                    <span style={{fontSize: "x-large"}}>Already have an account? <a href="/signin">Sign In</a></span><br/><br/>


                  {" "}
              </div>
            </div>
            </div>
          </form>{" "}
        </main>
      </MobileView>
      <BrowserView>
      <div style={{float: 'left', width: "50%"}}>
      <div style={{marginLeft: "10%", marginTop: "15vh", height: '17.5vh', fontFamily: "Copperplate", fontSize: '15vh'}}>
      10Athletes
      </div>
      <div style={{marginLeft: "5%", backgroundRepeat: 'no-repeat', backgroundImage: `url(${Background})`, height: '49.5vh', paddingBottom: '9.5vh'}}>
      </div>
      </div>
      <br/>
      <br/>
      <br/>
        <main >
          <form align="center" style={{fontSize: 'xx-large'}} onSubmit={this.handleSubmit}>
          <div align="center" style={{marginLeft: '57.5%', marginRight: '17.5%', backgroundColor: "white", border: "3px solid #435685", width: "25%"}}>
          <br/><b>Sign Up</b><br/><br/>
            <div >
              <label htmlFor="username">
                <input
                  style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="username"
                  id="username"
                  name="username"
                  placeholder="   Username"
                  ref={(node) => {
                    this.inputNode1 = node;
                  }}
                />
                <br/><br/>
              </label>
              <label htmlFor="firstname">
                <input
                style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="   First Name"
                  ref={(node) => {
                    this.inputNode2 = node;
                  }}
                />
              </label>
              <br/><br/>
              <label htmlFor="firstname">
                <input
                style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="   Last Name"
                  ref={(node) => {
                    this.inputNode3 = node;
                  }}
                />
              </label>
              <br/><br/>
              <label htmlFor="email">
                <input
                style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="   Email"
                  ref={(node) => {
                    this.inputNode4 = node;
                  }}
                />
              </label>
              <br/><br/>

              <label htmlFor="password">
                <input
                  style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="   Password"
                  ref={(node) => {
                    this.inputNode5 = node;
                  }}
                />
              </label>
              <br/>
              <br/>
              <div id="inlineSlot blueBtn" align="center">
                <label htmlFor="register">
                  {" "}
                  <button id="signin" type="submit" style={{color: "white", backgroundColor: "#42B729", width: '40%', height: '3em', fontSize: "large"}}>
                    <b style={{fontSize: "x-large"}}>Sign Up</b>
                  </button>
                  <br/><br/>
                </label>
                    {" "}
                    <span style={{fontSize: "x-large"}}>Already have an account? <a href="/signin">Sign In</a></span><br/><br/>


                  {" "}
              </div>
            </div>
            </div>
          </form>{" "}
        </main>
        </BrowserView>
      </div>
    );
  }

}

export default Signup;
