import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, Container, Row, Col, Form, Button, Modal, ListGroup, CloseButton} from 'react-bootstrap';
import jwtDecode from 'jwt-decode'
import styles from './Header.css'

import { config } from './utility/Constants'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logout: false,
      open: false,
      open2: false,
      errors: [],
      validPassword: "false",
      invalidPassword: "false"
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleResultsClick = this.handleResultsClick.bind(this);
    this.handleRankingsClick = this.handleRankingsClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.handleSignInClick = this.handleSignInClick.bind(this);
    this.changeBackGround = this.changeBackGround.bind(this);
    this.revertBackGround = this.revertBackGround.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this)
  }

  componentDidMount(){
    let jwt = window.localStorage.getItem('jwt');
    if(jwt){
      let result = jwtDecode(jwt)
      if(result.username){
        this.setState({username: result.username, logout: true})

      }
    }
    // else{
    //   this.props.history.push('/register')
    // }

  }

  handleLogout () {
    window.localStorage.removeItem('jwt')
    this.setState({logout: false, errors: []}, ()=> this.props.history.push('/signin'))
  }

  handleProfileClick(){
    this.props.history.push('/profile')
  }

  handleResultsClick(){
    this.props.history.push('/results')
  }

  handleRankingsClick(e){
    this.props.history.push('/rankings')
  }

  handleRegisterClick(){
    this.props.history.push('/register')
  }

  handleSignInClick(){
    this.props.history.push('/signin')
  }

  changeBackGround(e){
    e.target.style.backgroundColor = 'lightgrey';
  }

  revertBackGround(e){
    e.target.style.backgroundColor = 'white';
  }

  validPassword(){
    let valid = true
    if(this.inputNode9){
     valid = this.inputNode9.value.length >= 8
    }
    return valid
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

  handleSubmit (e){
    e.preventDefault();

    var formData = new FormData();
    formData.append("username", e.target[0].value);
    formData.append("password", e.target[1].value);
    let url = config.url.BASE_URL + 'tokens'
    fetch(url,
    { method: 'POST', body: formData })
    // eslint-disable-next-line
    .then(res => res.json()).then(res => (console.log(res.jwt),
    window.localStorage.setItem('jwt', res.jwt)))
    .then(() => this.props.history.push('/profile'))
    .catch(setTimeout(() => this.setState({errors: ["Invalid username or password"]}), 1000))
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

  forgotPassword(event){
    event.preventDefault()
    let url = config.url.BASE_URL + 'password/reset'
    var formDataReset = new FormData();
    formDataReset.append("emailOrUsername", this.inputNode10.value);
    fetch(url,
    { method: 'POST', body: formDataReset })
    this.closeModal2()
  }

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });
  openModal2 = () => this.setState({ open2: true });
  closeModal2 = () => this.setState({ open2: false });

  controlledTabs(){
    let key='/'
    let showRankingsLink =
      <Col xs="3" lg="2" className="mx-5">
        <Nav.Link href="/rankings" eventKey="rankings" className="viewrankings">View Rankings</Nav.Link>
      </Col>
    if(window.localStorage.getItem('jwt')){
      if(this.props.location.pathname === '/rankings'){
        key='rankings'
      } else if(this.props.location.pathname === '/results'){
        key='results'
      } else if(this.props.location.pathname === '/profile' || this.props.location.pathname === '/'){
        key='profile'
      }
      return (
        <Navbar collapseOnSelect bg="light" variant="light" expand="lg" className="fixed-top" style={{borderBottom: "1px solid black"}}>
          <Col>
            <Navbar.Brand className="pl-3" href="/"><span className="ten-logo"><span style={{letterSpacing: "-2px"}}>1</span><span style={{letterSpacing: "3px"}}>0</span></span><span className="ten-logo-athletes">Athletes</span></Navbar.Brand>
          </Col>
          <Navbar.Toggle  aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="text-white" variant="pills" activeKey={key}>
            <Col lg="4">
              <Nav.Link href="/rankings" eventKey="rankings" className="pl-3">Rankings</Nav.Link>
            </Col>
            <Col lg="4">
              <Nav.Link href="/profile" eventKey="profile" className="pl-4">Profile</Nav.Link>
            </Col>
            <Col lg="6">
              <Nav.Link href="/results" eventKey="results" className="pl-4">Submit Results</Nav.Link>
              </Col>
            </Nav>
            <Nav className="ml-auto">
              <Nav.Link className="px-3" eventKey="logout" onClick={this.handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )
    } else {
      if(this.props.location.pathname === '/rankings'){
        key='rankings'
        showRankingsLink=""
      } else if(this.props.location.pathname === '/register'){
        key='register'
      } else if(this.props.location.pathname === '/signin' || this.props.location.pathname === '/'){
        key='signIn'
      }
    }

    return(
      <Navbar bg="light" variant="light" expand="lg" className="fixed-top" style={{borderBottom: "1px solid black"}}>
        <Col>
          <Navbar.Brand className="pl-3 mr-5" xs="6" md="12" href="/"><span className="ten-logo"><span style={{letterSpacing: "-2px"}}>1</span><span style={{letterSpacing: "3px"}}>0</span></span><span className="ten-logo-athletes">Athletes</span></Navbar.Brand>
        </Col>
        {showRankingsLink}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="" variant="pills" activeKey={key}>

          </Nav>
          <Nav className="ml-auto mt-2">
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col xs="12" lg="auto">
                  <Form.Control
                    className="mb-2"
                    id="usernameInput"
                    placeholder="  Username or Email"
                    name="username"
                    required
                  />
                </Col>
                <Col xs="12" lg="auto">
                  <Form.Control
                    className="mb-2"
                    id="passwordInput"
                    placeholder="  Password"
                    type="password"
                    name="password"
                    required
                  />
                </Col>
                <Col className="mb-3 sign-in-error-header text-center d-block d-lg-none">
                  {this.state.errors[0]}
                </Col>
                <Row>
                <Col className="mt-2 sign-in-error-header text-center d-none d-lg-block">
                  {this.state.errors[0]}
                </Col>
                </Row>
                <Col lg="auto">
                  <Button type="submit" className="w-100 mb-2 px-3">
                    Sign In
                  </Button>
                </Col>

                <Col className="mt-2 d-none d-lg-block">
                  or
                </Col>
                <Col xs="12" className="or mb-2 d-block d-lg-none">
                  or
                </Col>

                <Col xs="12" className="d-lg-none">
                  <Button variant="success" block onClick={this.openModal} className="w-100 mb-2">Sign Up</Button>
                </Col>
                <Col xs="auto" className="d-none d-lg-block">
                  <Button variant="success" onClick={this.openModal} className="mb-2">Sign Up</Button>
                </Col>
                <Col xs="auto" className="d-lg-block">
                  <Button variant="link" onClick={this.openModal2} className="w-100 mb-2 px-3">
                    Forgot Password
                  </Button>
                </Col>
              </Row>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }


  render(){
    let displayContent = this.controlledTabs()
    let logout = ""
    let profile = ""
    let submitResults = ""
    let register = ""
    let signIn = ""
    let rankings = ""
    let pathName = this.props.location.pathName
    let stuff = this
    if(window.localStorage.getItem('jwt')){
      logout = <button onMouseEnter={this.changeBackGround} onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', width: '18.5vh', height: '8.4vh', fontSize: "large"}} onClick={this.handleLogout}><b>Logout</b></button>
      if(this.props.location.pathname !== '/profile'){
        profile = <button onMouseEnter={this.changeBackGround} onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', borderBottom: '0px', width: '18.5vh', height: '8.4vh', fontSize: "large"}} onClick={this.handleProfileClick}><b>Profile</b></button>
      } else {
        profile = <button onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "#435685", border: '0px', borderBottom: '0.5vh solid #435685', width: '18.5vh', height: '8vh', fontSize: "large"}} onClick={this.handleProfileClick}><b>Profile</b></button>
      }
      if(this.props.location.pathname !== '/results'){
        submitResults = <button onMouseEnter={this.changeBackGround} onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', width: '18.5vh', height: '8.4vh', paddingBottom: '0px', fontSize: "large"}} onClick={this.handleResultsClick}><b>Submit Results</b></button>
      } else {
        submitResults = <button onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "#435685", border: '0px', borderBottom: '0.5vh solid #435685', width: '18.5vh', height: '8vh', paddingBottom: '0px', fontSize: "large"}} onClick={this.handleResultsClick}><b>Submit Results</b></button>
      }
    } else {
      if(this.props.location.pathname === '/rankings'){
        register = <button onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', width: '18.5vh', height: '8.5vh', fontSize: "large"}} onMouseEnter={this.changeBackGround} onClick={this.handleRegisterClick}><b>Register</b></button>
        signIn = <button onMouseEnter={this.changeBackGround} onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', width: '18.5vh', height: '8.4vh', fontSize: "large"}} onClick={this.handleSignInClick}><b>Sign In</b></button>
      } else if (this.props.location.pathname === '/register') {
        signIn = <button onMouseEnter={this.changeBackGround} onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', width: '18.5vh', height: '8.4vh', fontSize: "large"}} onClick={this.handleSignInClick}><b>Sign In</b></button>
      } else if (this.props.location.pathname === '/signin') {
        register = <button onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', width: '18.5vh', height: '8.5vh', fontSize: "large"}} onMouseEnter={this.changeBackGround} onClick={this.handleRegisterClick}><b>Register</b></button>
      }
    }
    if(this.props.location.pathname !== '/rankings' && this.props.location.pathname !== '/'){
      rankings = <button onMouseEnter={this.changeBackGround} onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "black", border: '0px', width: '18.5vh', height: '8.4vh', fontSize: "large"}} onClick={this.handleRankingsClick}><b>Rankings</b></button>
    } else {
      rankings = <button onMouseLeave={this.revertBackGround} style={{backgroundColor: "white", color: "#435685", border: '0px', borderBottom: '0.5vh solid #435685', width: '18.5vh', height: '8vh', fontSize: "large"}}><b>Rankings</b></button>
    }

  //   <Nav className="fixed-top py-3" style={{borderBottom: "1px solid black"}} variant="pills" defaultActiveKey="results">
  // <Nav.Item>
  // <Navbar.Brand href="/">10Athletes</Navbar.Brand>
  // </Nav.Item>
  // <Nav.Item>
  // <Nav.Link onClick={this.handleRankingsClick} href="/rankings" eventKey="rankings">Rankings</Nav.Link>
  // </Nav.Item>
  // <Nav.Item>
  // <Nav.Link href="/profile" eventKey="profile">
  //   Profile
  // </Nav.Link>
  // </Nav.Item>
  // <Nav.Item>
  // <Nav.Link href="/results" eventKey="results">
  //   Submit Results
  // </Nav.Link>
  // </Nav.Item>
  // <Nav.Item>
  // <Nav.Link eventKey="logout">
  //   Logout
  // </Nav.Link>
  // </Nav.Item>
  // </Nav>


  // <Navbar bg="light" variant="light" expand="lg" className="fixed-top" style={{borderBottom: "1px solid black"}}>
  // <Col>
  // <Navbar.Brand className="pl-5" href="/">10Athletes</Navbar.Brand>
  // </Col>
  // <Navbar.Toggle aria-controls="basic-navbar-nav" />
  // <Navbar.Collapse id="basic-navbar-nav">
  // <Nav className="" variant="pills" defaultActiveKey="rankings">
  // <Col>
  //   <Nav.Link href="/rankings" eventKey="rankings" >Rankings</Nav.Link>
  //   </Col>
  //   <Col>
  //   <Nav.Link href="/profile" eventKey="profile" >Profile</Nav.Link>
  //   </Col>
  //   <Col>
  //   <Nav.Link lg="auto" href="/results" eventKey="results">Submit Results</Nav.Link>
  //   </Col>
  //   </Nav>
  //   <Nav className="ml-auto">
  //   <Nav.Link className="pr-3">Logout</Nav.Link>
  // </Nav>
  // </Navbar.Collapse>
  // </Navbar>
  let errors = ""
  let submittedErrors = this.state.errors
  var formattedErrors
  // if(this.state.errors.errorsFound > 0){
  //   errors = []
  //   const errorsFound = Object.entries(this.state.errors)
  //   for(const [location, error] of errorsFound){
  //     if(location !== 'errorsFound' && error !== ''){
  //       errors.push(<ListGroup.Item variant="danger" className="mt-2">{error}</ListGroup.Item>)
  //     }
  //   }
  //   formattedErrors = <Container className="mx-3"><ListGroup>{errors}</ListGroup></Container>
  // }
  let validPassword = this.validPassword()
    return(
      <div>
    {displayContent}
    <Modal backdrop="static" centered show={this.state.open2} onHide={this.closeModal2}>
      <Modal.Header>
        <Modal.Title>Forgot Password</Modal.Title>
        <CloseButton onClick={this.closeModal2}>X</CloseButton>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={this.forgotPassword}>
          <Row className="pl-3 pr-3 mt-4">
            <Col xs="12" className="mb-4">
              <Form.Group>
                <Form.Control
                size="lg"
                type="name"
                id="emailOrUsernameInput"
                placeholder="   Username or Email"
                name="emailorUsername"
                required
                ref={(node) => {
                  this.inputNode10 = node;
                }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs="4"></Col>
            <Col className="mt-4 mb-3 px-3" lg="12" xs="6">
            <Button size="lg" type="submit" className="w-100" variant="success" onClick={this.forgotPassword}>
              Forgot Password
            </Button>
            </Col>
          </Row>
          </Form>
        </Modal.Body>
      </Modal>
    <Modal backdrop="static" centered show={this.state.open} onHide={this.closeModal}>
        <Modal.Header>
          <Modal.Title>Sign Up</Modal.Title>
          <CloseButton onClick={this.closeModal}>X</CloseButton>
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
          <Container>
          <Row className="error-username-taken">
          <Col className="text-center mx-auto">
          {this.state.errors[0]}
          </Col>
          </Row>
          </Container>
          <Row>
            <Col xs="4"></Col>
            <Col className="mt-4 mb-3" lg="4" xs="6">
            <Button size="lg" type="submit" variant="success" onClick={this.handleRegisterSubmit}>
              Sign Up
            </Button>
            </Col>
          </Row>
          </Form>
        </Modal.Body>
      </Modal>

    </div>




    )
  }

}

export default Header;
