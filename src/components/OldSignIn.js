import React, { Component } from 'react';
import {BrowserView, MobileView} from 'react-device-detect';
import { config } from './utility/Constants'
import Background from './bg.jpeg'
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import styles from './Signin.css'


// let logo = "/logo2.png";
// let bg = "/bg2.jpg";
class Signin extends Component {
  constructor(props){
    super(props);
    this.state={
      open: false,
      errors: []
    }
  }

  isValid() {
    let username = this.inputNode5.value
    let firstname = this.inputNode6.value
    let lastname = this.inputNode7.value
    let email = this.inputNode8.value
    let password = this.inputNode9.value
    let errors = {username, firstname, lastname, password, email, errorsFound: 0}
    if(username.length < 1){
      errors.username = "Username required"
      errors.errorsFound+= 1
    } else {
      errors.username = ""
    }
    if(firstname.length < 1){
      errors.firstname = "First name required"
      errors.errorsFound+= 1
    } else {
      errors.firstname = ""
    }
    if(lastname.length < 1){
      errors.lastname = "Last name required"
      errors.errorsFound+= 1
    } else {
      errors.lastname = ""
    }
    if(password.length < 8){
      errors.password = "Password must be at least 8 characters"
      errors.errorsFound+= 1
    } else {
      errors.password = ""
    }
    if(email.length < 1){
      errors.email = "Email required"
      errors.errorsFound+= 1
    } else{
      errors.email = ""
      var atFound = false
      var dotFound = false
      var invalid = false
      for(var i = 0; i < email.length; i++){
        var lastAt = 0
        if(email[i] === '@'){
          atFound = true
          lastAt = i
        }
        if(atFound && !dotFound && email[i] === '.'){
          dotFound = true
          if(email.length - i < 3){
            invalid = true
          } else if (i - lastAt < 2) {
            invalid = true
          }
        }
      }
      if(!dotFound || invalid){
        errors.email = "Your email address is improperly formatted"
        errors.errorsFound+= 1
      } else {
        errors.email = ""
      }
    }
    return errors
  }

  handleSubmit = event => {
    event.preventDefault();
    var formData = new FormData();
    formData.append("username", this.inputNode1.value);
    formData.append("password", this.inputNode2.value);
    let url = config.url.BASE_URL + 'tokens'
    fetch(url,
    { method: 'POST', body: formData })
    // eslint-disable-next-line
    .then(res => res.json()).then(res => (console.log(res.jwt),
    window.localStorage.setItem('jwt', res.jwt)))
    .then(() => this.props.history.push('/'))
    .catch(function(error){console.log('There is an error: ', error.message)})
  }

  handleRegisterSubmit = event => {
    event.preventDefault();
    let errorsFound = this.isValid()

    var formData = new FormData();
    formData.append("username", this.inputNode5.value);
    formData.append("firstname", this.inputNode6.value);
    formData.append("lastname", this.inputNode7.value);
    formData.append("email", this.inputNode8.value);
    formData.append("password", this.inputNode9.value);

    var formDataToken = new FormData();
    formDataToken.append("username", this.inputNode5.value);
    formDataToken.append("password", this.inputNode9.value);
    let url = config.url.BASE_URL + 'users'
    let url2 = config.url.BASE_URL + 'tokens'

    if(errorsFound.errorsFound === 0){
      fetch(url,
      { method: 'POST', body: formData })
      .then(() =>
      fetch(url2,
      { method: 'POST', body: formDataToken}))
      // eslint-disable-next-line
      .then(res => res.json()).then(res => (console.log(res.jwt),
      window.localStorage.setItem('jwt', res.jwt)))
      .then(() => {
        this.props.history.push('/')
        this.setState({ open: false, errors: [] });
      })
      .catch(function(error){console.log('There is an error: ', error.message)})
    } else {
      this.setState({errors: errorsFound})
    }
  }

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });

  render() {
    return (
      <div>
      <MobileView>
      <div>
      <br/>
        <main style={{backgroundRepeat: 'no-repeat', backgroundImage: `url(${Background})`, height: '75vh', width: '100vw'}}>
        <div align="center" style={{fontFamily: "Shadows Into Light", fontSize: '5.5vh'}}>
        <span style={{fontSize: '6.5vh', color: "#0046C4"}}>10</span>Athletes
        </div>
        <form align="center" style={{fontSize: 'xx-large'}} onSubmit={this.handleSubmit}>
        <div align="center" style={{marginTop: "3vh", marginLeft: '20%', marginRight: '20%', backgroundColor: "white", border: "3px solid #435685", width: "60%"}}>
          <br/><b>Sign In</b><br/><br/>
          <label htmlFor="username"></label>
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
          <br />
          <br/>
          <label htmlFor="password"></label>
          <input
            style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
            type="password"
            id="password"
            name="password"
            placeholder="   Password"
            ref={(node) => {
              this.inputNode2 = node;
            }}
          />
          <br/><br/>
          <div id="inlineSlot " align="center">
            <button type="submit" value="Sign In" style={{color: "white", backgroundColor: "#42B729", width: '40%', height: '3em', fontSize: "large"}}>
              <b style={{fontSize: "x-large"}}>Sign In</b>
            </button>
            <br/><br/>
            <span style={{fontSize: "x-large"}}>Not Registered? <br/><a href="/register">Sign Up</a> for a <br/>Free Account</span><br/><br/>
          </div>
          </div>
        </form>
        </main>
      </div>
      </MobileView>
      <BrowserView>
      <div>
      <br/>
      <br/>
      <br/>
      <div style={{float: 'left', width: "50%"}}>
      <div style={{marginLeft: "10%", marginTop: "5vh", height: '17.5vh', fontFamily: "Copperplate", fontSize: '15vh'}}>
      10Athletes
      </div>
      <div style={{marginLeft: "5%", backgroundRepeat: 'no-repeat', backgroundImage: `url(${Background})`, height: '49.5vh', paddingBottom: '9.5vh'}}>
      </div>
      </div>
        <main >

        <form align="center" style={{fontSize: 'xx-large'}} onSubmit={this.handleSubmit}>
        <div align="center" style={{marginTop: "10vh", marginLeft: '57.5%', marginRight: '17.5%', backgroundColor: "#eee", border: "3px solid #435685", width: "25%"}}>
        <br/>
          <label htmlFor="username"></label>
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
          <br />
          <br/>
          <label htmlFor="password"></label>
          <input
            style={{float: "center", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
            type="password"
            id="password"
            name="password"
            placeholder="   Password"
            ref={(node) => {
              this.inputNode2 = node;
            }}
          />
          <br/><br/>
          <div id="inlineSlot " align="center" style={{marginLeft: "10%", marginRight: "10%"}}>
            <Button size="lg" type="submit" value="Sign In" block>
              <b>Sign In</b>
            </Button>
            <br/>
            <div style={{paddingLeft: "10%", paddingRight: "10%", borderBottom: "1px solid #435685"}}></div>
            <br/>
            <span><Button size="lg" className="px-5 signupButton" variant="success" onClick={this.openModal}><b>Sign Up</b></Button></span><br/><br/>
          </div>
          <Modal backdrop="static" centered show={this.state.open} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form onSubmit={this.handleRegisterSubmit}>
              <Row className="pl-3 pr-3 mt-4">
                <Col xs="12" lg="6" className="mb-4">
                  <Form.Group>
                  <Form.Control
                    size="lg"
                    type="name"
                    id="firstNameInput"
                    placeholder="  First Name"
                    name="firstname"
                    required
                    isInvalid={!!this.state.errors.firstname}
                    ref={(node) => {
                      this.inputNode6 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.firstname }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs="12" lg="6" className="mb-4">
                  <Form.Group>

                  <Form.Control
                    size="lg"
                    id="lastNameInput"
                    type="name"
                    placeholder="  Last Name"
                    name="lastname"
                    required
                    isInvalid={!!this.state.errors.lastname}
                    ref={(node) => {
                      this.inputNode7 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.lastname }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="pl-3 pr-3 mb-4">
                <Col xs="12">
                  <Form.Group>

                  <Form.Control
                    size="lg"
                    id="usernameInput"
                    placeholder="  Username"
                    type="name"
                    name="username"
                    required
                    isInvalid={!!this.state.errors.username}
                    ref={(node) => {
                      this.inputNode5 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.username }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="pl-3 pr-3 mb-4">
                <Col xs="12">
                <Form.Group>

                  <Form.Control
                    size="lg"
                    id="emailInput"
                    placeholder="  Email"
                    type="email"
                    name="email"
                    required
                    isInvalid={!!this.state.errors.email}
                    ref={(node) => {
                      this.inputNode8 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.email }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="pl-3 pr-3">
                <Col xs="12">
                  <Form.Group>

                    <Form.Control
                      size="lg"
                      className="mb-2"
                      id="passwordInput"
                      placeholder="  Password"
                      type="password"
                      name="password"
                      required
                      minLength="8"
                      isInvalid={!!this.state.errors.password}
                      ref={(node) => {
                        this.inputNode9 = node;
                      }}
                    />
                    <Form.Control.Feedback className="error-message" type='invalid'>
                      { this.state.errors.password }
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs="4"></Col>
                <Col className="mt-4 mb-3" xs="4">
                <Button size="lg" type="submit" variant="success" onClick={this.handleRegisterSubmit}>
                  Sign Up
                </Button>
                </Col>
              </Row>
              </Form>
              </Modal.Body>
            </Modal>

          </div>
        </form>
        </main>
      </div>
      </BrowserView>
      </div>
    );
  }

}

export default Signin;
