import React, { Component } from 'react';
import { config } from './utility/Constants'
import Background from './bg.jpeg'
import { Button, Form, Container, Row, Col, Modal, Card, CloseButton } from 'react-bootstrap';
import styles from './Signin.css'
import jwtDecode from 'jwt-decode'



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

  componentDidMount(){
    let user = {}
    let jwt = window.localStorage.getItem('jwt');
    if(jwt){
      let result = jwtDecode(jwt)
      if(result.username){
        user = result
      } else{
        this.props.history.push('/rankings')
      }
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
    .then(() => this.props.history.push('/profile'))
    .catch(setTimeout(() => this.setState({errors: ["Invalid username or password"]}), 1500))
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
        this.props.history.push('/profile')
        this.setState({ open: false, errors: [] });
      })
      .catch(setTimeout(() => this.setState({errors: ["Username already in use"]}), 1500))
    } else {
      this.setState({errors: errorsFound})
    }
  }

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });

  render() {
    return (
      <Container fluid style={{marginTop: "5%"}}>
        <Row>
        <Col xl="1">
        </Col>
          <Col xl="6">

      <div className="d-none d-xl-block text-center" style={{height: '20vh', fontFamily: "boogaloo", fontSize: '15vh'}}>
      <span className="ten-logo"><span style={{letterSpacing: "-10px"}}>1</span>0</span><span className="ten-logo-athletes">Athletes</span>
      </div>
      <div className="d-none d-xl-block text-center"><span className="descriptive-tagline-big" style={{height: '7vh', fontSize: '5vh', fontFamily: "boogaloo"}}>Play Sports, Get Ranked</span></div>
      <div className="d-block d-xl-none text-center pt-5 m-5" style={{height: '4vh', fontFamily: "boogaloo", fontSize: '4vh'}}>
      <span className="ten-logo"><span style={{letterSpacing: "-4px"}}>1</span>0</span><span className="ten-logo-athletes">Athletes</span><br/>
      <span className="descriptive-tagline-small" style={{fontSize: '3.5vh'}}>Play Sports, Get Ranked</span>
      </div>
      <Card className="border-0 d-none d-xl-block" style={{backgroundRepeat: 'no-repeat', backgroundImage: `url(${Background})`, height: '100%', marginTop: '5vh'}}>
      </Card>
          </Col>
          <Col xl="1">
          </Col>
          <Col className="mt-3 mt-xl-5 pt-xl-5" xl="3">
        <div>
        <span className="d-none d-xl-block" style={{marginTop: "15%"}}></span>
        <Card className="shadow mt-5" style={{backgroundColor: "#eee"}}>
        <Form align="center" style={{fontSize: 'xx-large'}} onSubmit={this.handleSubmit}>
        <Row className="px-3 my-4">
          <Col xs="12">
            <Form.Group>

            <Form.Control
              size="lg"
              id="usernameInput"
              placeholder="  Username or Email"
              type="name"
              name="username"
              required
              isInvalid={!!this.state.errors.username}
              ref={(node) => {
                this.inputNode1 = node;
              }}
            />
            <Form.Control.Feedback className="error-message" type='invalid'>
              { this.state.errors.username }
            </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="px-3">
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
                isInvalid={!!this.state.errors.password}
                ref={(node) => {
                  this.inputNode2 = node;
                }}
              />
              <Form.Control.Feedback className="error-message" type='invalid'>
                { this.state.errors.password }
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

          <div id="inlineSlot " align="center" className="">

            <Col xs="12">
            <Button className="mt-3 mb-4 w-100"size="lg" type="submit" value="Sign In" >
              <b>Sign In</b>
            </Button>
            </Col>
            <Col className="mb-3 sign-in-error text-center">
              {this.state.errors[0]}
            </Col>
            <Row className="mx-3" style={{marginLeft: "10%", marginRight: "10%", borderBottom: "1px solid #435685"}}>
            </Row>
            <Row>
              <Col xs="12">
                <Button size="lg" className="signupButton my-4 w-50" variant="success" onClick={this.openModal}><b>Sign Up</b></Button>
              </Col>
            </Row>
          </div>

          <Modal backdrop="static" centered show={this.state.open} onHide={this.closeModal}>
              <Modal.Header>
                <Modal.Title>Sign Up</Modal.Title>
                <CloseButton onClick={this.closeModal}>X</CloseButton>
              </Modal.Header>
              <Modal.Body>
              <Form onSubmit={this.handleRegisterSubmit}>
              <Row className="pl-3 pr-3 mt-4">
                <Col xs="12" xl="6" className="mb-4">
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
                <Col xs="12" xl="6" className="mb-4">
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
              <Container>
              <Row className="error-username-taken">
              <Col className="text-center mx-auto">
              {this.state.errors[0]}
              </Col>
              </Row>
              </Container>
              <Row>
                <Col xs="4"></Col>
                <Col className="mt-4 mb-3" xs="6" lg="4">
                <Button size="lg" type="submit" variant="success" onClick={this.handleRegisterSubmit}>
                  Sign Up
                </Button>
                </Col>
              </Row>
              </Form>
              </Modal.Body>
            </Modal>
            </Form>

          </Card>
        </div>

            </Col>
          </Row>
        </Container>    );
  }

}

export default Signin;
