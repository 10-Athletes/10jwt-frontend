import React, { Component } from 'react';
import {config} from './utility/Constants';
import Signin from "./Signin";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
  Collapse,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import {Link} from 'react-router-dom';


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
    return (
      <div>
        <Container fluid>
          <Row>
            <Col md={4} style={{margin: '0 auto', textAlign: 'center'}}>
              <Form onSubmit={this.handleSubmit}>
                <FormGroup style={{display:'inline-block'}}>
                  <img src="" alt="logo" id="logo" width="50" height="50" />
                  <FormText><h1>Register</h1></FormText>
                </FormGroup>
                <FormGroup>
                  <Input
                  type="username"
                  placeholder="Username"
                  id="username"
                  name="username"
                  ref={(node) => {
                    this.inputNode1 = node;
                  }}
                  >
                  </Input>
                  <br/>
                  <Input
                    type="name"
                    placeholder="First Name"
                  id="firstname"
                  name="firstname"
                  ref={(node) => {
                    this.inputNode2 = node;
                  }}
                  >
                  </Input>
                  <br/>
                  <Input
                    type="text"
                    placeholder="Last Name"
                  id="lastname"
                  name="lastname"
                  ref={(node) => {
                    this.inputNode3 = node;
                  }}
                  >
                  </Input>
                  <br/>
                  <Input
                    type="email"
                    placeholder="Email Address"
                  id="email"
                  name="email"
                  ref={(node) => {
                    this.inputNode4 = node;
                  }}
                  >
                  </Input>
                  <br/>
                  <Input
                    type="password"
                    placeholder="Password"
                  id="password"
                  name="password"
                  ref={(node) => {
                    this.inputNode5 = node;
                  }}
                  >
                  </Input>
                </FormGroup>
                <ButtonGroup>
                  <Link to="/SignIn" >
                    <Button type="button" style={{borderRadiusTopRight:'0', borderRadiusBottomRight: '0', width: '150px'}} color="secondary">Sign In</Button>
                  </Link>
                    <Button type="button" color="primary" style={{borderRadiusTopRight:'0', borderRadiusBottomRight: '0', width: '150px'}}>Sign Up</Button>
                </ButtonGroup>

              </Form>
            </Col>
            


          </Row>

        </Container>
        
      </div>
    );
  }
  
}
export default Signup;