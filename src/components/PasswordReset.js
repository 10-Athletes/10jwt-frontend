import React, { Component } from 'react';
import { Navbar, Nav, Card, NavDropdown, Alert, Container, Row, Col, Form, Button, Modal, ListGroup, CloseButton} from 'react-bootstrap';
import styles from './Header.css'

import { config } from './utility/Constants'

class PasswordReset extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resetToken: this.props.location.search.slice(7),
      errors: "",
      expired: true,
      open: false
    }
    this.updatePassword = this.updatePassword.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)

  }

  componentDidMount(){
    let url = config.url.BASE_URL + 'password/reset/validate'
    var formData = new FormData();
    let counter = 0
    let resetToken = ""
    for (var i = 0; i < this.state.resetToken.length; i++) {

      if(this.state.resetToken[i] === '%' &&
      i < this.state.resetToken.length - 2 &&
      this.state.resetToken[i + 1] === '3' &&
      this.state.resetToken[i + 2] === 'D'
    ){
      resetToken += "="
      counter = 2
    } else if (counter > 0) {
      counter -= 1
    } else {
      resetToken += this.state.resetToken[i]
    }
    };
    console.log(resetToken, "reset token here")
    formData.append("token", resetToken)
    fetch(url,
    {method: 'PATCH', body: formData})
    .then(function(data){
      if (data.status === 401){
        this.setState({errors: "Invalid or Expired Link"})
      } else {
        this.setState({expired: false})
      }

    }.bind(this))
  }
  //   .then(() => this.setState({expired: false}))
  //   .catch(() => this.setState({errors: "Invalid or expired reset link"}))
  // }

  updatePassword(event){
    event.preventDefault()
    if(this.inputNode1.value !== this.inputNode2.value){
      this.setState({errors: "The passwords do not match"})
    } else if(this.inputNode1.value.length < 8){
      this.setState({errors: "Your password must be at least 8 characters long"})
    } else{
      var formData = new FormData();
      formData.append("password", this.inputNode1.value);
      formData.append("token", this.state.resetToken)
      let url = config.url.BASE_URL + 'password/reset/edit'
      fetch(url,
      { method: 'PATCH', body: formData })
      .then(function(data){
        if (data.status === 401){
          this.setState({errors: "Invalid or Expired Link"})
        } else {
          this.props.history.push('/')
        }

      }.bind(this))
    }
  }

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });

  forgotPassword(event){
    event.preventDefault()
    let url = config.url.BASE_URL + 'password/reset'
    var formDataReset = new FormData();
    formDataReset.append("emailOrUsername", this.inputNode10.value);
    fetch(url,
    { method: 'POST', body: formDataReset })
    this.closeModal()

  }


  render(){
    if(this.state.expired){
      return(
        <div style={{paddingTop: "3%", paddingBottom: "1%", fontSize: "larger"}}>
        <Container className="d-block d-lg-none pb-3">
          <Row>
            <Col>
            .
            </Col>
          </Row>
        </Container>
        <br/><br/><br/><br/>
        <Modal backdrop="static" centered show={this.state.open} onHide={this.closeModal}>
          <Modal.Header>
            <Modal.Title>Forgot Password</Modal.Title>
            <CloseButton onClick={this.closeModal}>X</CloseButton>
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
          <Container>
          <Row>
          <Col xs="6" className="mx-auto">
          <Card className="shadow text-center">
        <Alert variant="danger">{this.state.errors}</Alert>
        <Button variant="link" size="lg" onClick={this.openModal}>Request a new link</Button>
        </Card>
        </Col>
        </Row>
        </Container>
        </div>
      )
    } else{
    return(
      <div style={{paddingTop: "3%", paddingBottom: "1%", fontSize: "larger"}}>
      <Container className="d-block d-lg-none pb-3">
        <Row>
          <Col>
          .
          </Col>
        </Row>
      </Container>
      <Container>
      <Row>
      <Col xs="12" sm="6" className="mx-auto">
      <Card className="mt-5 shadow" style={{marginTop: "5%"}} >
      <Form onSubmit={this.updatePassword}>
  <Form.Group className="mb-3 px-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="   Password" ref={(node) => {
      this.inputNode1 = node;
    }}/>
  </Form.Group>

  <Form.Group className="mb-3 px-3" controlId="formBasicConfirmPassword">
    <Form.Label>Confirm Password</Form.Label>
    <Form.Control type="password" placeholder="   Confirm Password" ref={(node) => {
      this.inputNode2 = node;
    }}/>
  </Form.Group>
  <Row className="px-5">
  <Button variant="success" type="submit" size="lg" className="w-100 mb-3">
    Submit
  </Button>
  </Row>
</Form>
  {this.state.errors}
  </Card>
  </Col>
  </Row>
  </Container>

      </div>
    )
  }
}

}

export default PasswordReset;
