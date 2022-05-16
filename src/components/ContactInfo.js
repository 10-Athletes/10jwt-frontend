import React, { Component } from 'react';
import PhoneInput from 'react-phone-number-input'
import jwtDecode from 'jwt-decode'
import { config } from './utility/Constants'
import { Button, Form, Container, Row, Col, Collapse, Modal, Card, ListGroup, Popover, OverlayTrigger, Tooltip, Table, Accordion, InputGroup } from 'react-bootstrap';
import styles from './Profile.css'
import "bootstrap/js/src/collapse.js";
import 'react-phone-number-input/style.css'


export default class ContactInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    user: {},
    value: "",
    error: "",
    disabled: false,
    otherBox: "",
    collapsed: true,
    }
    this.updateNumber = this.updateNumber.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showOtherBox = this.showOtherBox.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    let username = ""
    let jwt = window.localStorage.getItem('jwt')
    if(!jwt){
      this.props.history.push('/register', {error: "You must be signed in to view a profile"})
    } else {
      let result = jwtDecode(jwt)
      if (result.username){
        username = result.username
        console.log("result", result )
      }
      let url = config.url.BASE_URL + 'users/'+result.id
      fetch(url)
      .then(response => response.json())
      .then(function(data){
        let user = data.user
        let collapsed = true
        let numLines = 0
        if(data.user.contact[0]){
          this.inputNode1.value = "" || data.user.contact[0]["email"]
          this.inputNode2.value = "" || data.user.contact[0]["location"]
          this.inputNode3.value = "" || data.user.contact[0]["availability"]
          this.inputNode4.value = "" || data.user.contact[0]["other"]
          this.inputNode5.value = "" || data.user.contact[0]["gender"]
          this.inputNode6.value = "" || data.user.contact[0]["age"]["month"]
          this.inputNode16.value = "" || data.user.contact[0]["age"]["day"]
          this.inputNode26.value = "" || data.user.contact[0]["age"]["year"]
          if(data.user.contact[0]["age"].length > 0){
            numLines = 1
          }
          if(data.user.contact[0]["gender"].length > 0 && data.user.contact[0] !== 'Prefer Not to Answer'){
            numLines = 1
          }
          if(data.user.contact[0]["location"].length > 0){
            numLines = 1
          }
          if(data.user.contact[0]["email"].length > 0){
            numLines += 1
          }
          if(data.user.contact[0]["availability"].length > 0){
            numLines += 1
          }
          if(data.user.contact[0]["other"].length > 0){
            numLines += 1
          }
          if(data.user.contact[0]["phoneNumber"].length > 0){
            numLines += 1
          }
          if(numLines > 2){
            collapsed = false
          }
          this.setState({user, value: data.user.contact[0]["phoneNumber"], collapsed})
        } else {
          this.setState({user})
        }
      }.bind(this)).catch(function(error) {
        console.log(error)
      })
    }
  }

  updateNumber(value){
    this.setState({value})
  }

  toggle(){
    this.props.history.push('/profile')
    this.setState({collapsed: !this.state.collapsed})

  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({disabled: true})
    let phoneNumber
    if(this.state.value){
      phoneNumber = this.state.value
    } else{
      phoneNumber = ""
    }
    var formData = new FormData();
    let age = {}
    if(this.inputNode6.value !== "Month" &&
            this.inputNode16.value !== "" &&
            this.inputNode26.value !== ""){
      age = {
        month: this.inputNode6.value,
        day: this.inputNode16.value,
        year: this.inputNode26.value
      }
    }
    console.log(age, "bday")
    let updateContact ={
      updateContact: {
        email: this.inputNode1.value,
        location: this.inputNode2.value,
        phoneNumber,
        availability: this.inputNode3.value,
        other: this.inputNode4.value,
        gender: this.inputNode5.value,
        age
      }
    }
    let userID = this.state.user.id

    let url = config.url.BASE_URL + 'users/' + userID
    fetch(
      url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify
        // ({
          (updateContact),
        //   user
        // })
      }
    )
    .then(response => {
      if(response.status === 200){
        window.scrollTo(0,0)
        this.props.updated(updateContact["updateContact"])
        this.setState({error: "", disabled: false})
      }
      else{
        this.setState({
          error: "No changes made", disabled: false
        })
      }
    })
  }

  showOtherBox(e){
    if(e.target.value === "Other"){
      this.setState({otherBox: <Form.Control
        size="lg"
        id="gender"
        placeholder="  Gender"
        type="text"
        name="gender"

        ref={(node) => {
          this.inputNode5 = node;
        }}
      />
      })
    } else {
      this.setState({otherBox: ""})
    }
  }

  render(){
    if(this.props.history.location.hash === "#update-contact" && this.state.collapsed === false && !this.state.updateClicked){
      this.toggle()
    }
    let atLeast18 = new Date().getFullYear() - 18
    return(
        <Card className="shadow mt-3">
        <Card.Title onClick={() => this.toggle()} className="initial-title text-center ml-5 mt-3">Update Contact Info</Card.Title>
          <Collapse in={this.state.collapsed} className="w-100">
            <Row>
              <Col>
                <Form style={{fontSize: 'x-large'}} onSubmit={this.handleSubmit}>
                <Form.Text className="text-muted text-center ml-3">
                <b>Optional Info</b> - To be used by other members to contact you for games
                </Form.Text>
                  <Row className="pl-3 my-4">
                    <Col xs="12">
                      <Form.Group>
                      <Row className="pl-2 mb-4">
                        <Col xs="12">
                          <PhoneInput
                          onChange={this.updateNumber}
                          defaultCountry="US"
                            placeholder="   Enter phone number"
                            value={this.state.value}

                            />
                        </Col>
                      </Row>

                      <Form.Control
                        size="lg"
                        id="email"
                        placeholder="  Email"
                        type="text"
                        name="email"
                        ref={(node) => {
                          this.inputNode1 = node;
                        }}
                      />
                      <Form.Control.Feedback className="error-message" type='invalid'>

                      </Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="pl-3 my-4">
                    <Col xs="12">
                      <Form.Group>

                      <Form.Control
                        size="lg"
                        id="location"
                        placeholder="  Location"
                        type="text"
                        name="location"

                        ref={(node) => {
                          this.inputNode2 = node;
                        }}
                      />
                      <Form.Control.Feedback className="error-message" type='invalid'>

                      </Form.Control.Feedback>
                      <Form.Text className="text-muted text-left">
                        As specific or vague as you want.
                      </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="pl-3 my-4">
                    <Col xs="12">
                      <Form.Group>

                      <Form.Control
                        size="lg"
                        id="availability"
                        placeholder="  Availability"
                        type="text"
                        name="availability"

                        ref={(node) => {
                          this.inputNode3 = node;
                        }}
                      />
                      <Form.Control.Feedback className="error-message" type='invalid'>

                      </Form.Control.Feedback>
                      <Form.Text className="text-muted text-left">
                        When are you available to play? (ie: "MWF 5-8pm")
                      </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>


                        <Row className="pl-3 my-4">
                          <Col xs="12">
                            <Form.Group>

                            <Form.Control
                              size="lg"
                              id="other"
                              placeholder="  Other Contact Method"
                              as="textarea"
                              rows={3}
                              name="other"
                              ref={(node) => {
                                this.inputNode4 = node;
                              }}
                            />
                            <Form.Control.Feedback className="error-message" type='invalid'>

                            </Form.Control.Feedback>
                            <Form.Text className="text-muted text-left">
                            ie: Instagram, Facebook, Whatsapp
                            </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="pr-0 pl-0 ml-0 my-4">
                          <Col xs="3">
                            <Form.Group>
                            <Form.Text className="text-muted text-left">
                            Sex
                            </Form.Text>
                            <Form.Select
                              size="lg"
                              id="gender"
                              onChange={this.showOtherBox}
                              type="text"
                              name="gender"

                              ref={(node) => {
                                this.inputNode5 = node;
                              }}
                            >
                            <option>Prefer Not to Answer</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                            </Form.Select>
                            {this.state.otherBox}
                            <Form.Control.Feedback className="error-message" type='invalid'>

                            </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            <Col xs="12" sm="3">
                            </Col>
                            <Col xs="12" sm="6">
                            <Form.Text className="text-muted text-left">
                            Birthdate
                            </Form.Text>
                            <InputGroup>

                              <Form.Select
                              className="mr-2 text-center"
                                id="month"
                                name="month"
                                ref={(node) => {
                                  this.inputNode6 = node;
                                }}
                              >
                                <option defaultValue>Month</option>
                                <option value="01">1-January</option>
                                <option value="02">2-February</option>
                                <option value="03">3-March</option>
                                <option value="04">4-April</option>
                                <option value="05">5-May</option>
                                <option value="06">6-June</option>
                                <option value="07">7-July</option>
                                <option value="08">8-August</option>
                                <option value="09">9-September</option>
                                <option value="10">10-October</option>
                                <option value="11">11-November</option>
                                <option value="12">12-December</option>
                              </Form.Select>
                              <Form.Control
                                size="lg"
                                className="mr-2"
                                placeholder="Day"
                                type="number"
                                name="day"
                                min="1"
                                max="31"
                                step="1"
                                ref={(node) => {
                                  this.inputNode16 = node;
                                }}
                              />
                              <Form.Control
                                size="lg"
                                placeholder="Year"
                                type="number"
                                name="year"
                                min="1900"
                                max={atLeast18}
                                step="1"
                                ref={(node) => {
                                  this.inputNode26 = node;
                                }}
                              />
                              <Form.Control.Feedback className="error-message" type='invalid'>

                              </Form.Control.Feedback>
                              </InputGroup>

                          </Col>

                        </Row>
                        <Col xs="12">
                        <Form.Text style={{color: "red"}} className="text-left text-center">
                        {this.state.error}
                        </Form.Text>
                        </Col>
                  <Col xs="12">
                  <Button className="mt-3 mb-4 w-100"size="lg" type="submit" disabled={this.state.disabled} value="Sign In" >
                    <b>Update Contact Info</b>
                  </Button>
                  </Col>
                </Form>
              </Col>
            </Row>
          </Collapse>
        </Card>
    )
  }
}
