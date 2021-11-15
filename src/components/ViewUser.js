import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'
import { config } from './utility/Constants'
import { Button, Form, Container, Row, Col, Modal, Spinner, Card, ListGroup, Popover, OverlayTrigger, Tooltip, Table, Accordion } from 'react-bootstrap';
import styles from './Profile.css'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    user: {},
    rating: "",
    sport: "",
    sports: [],
    sportID: 0,
    sportMatches: [],
    error: "",
    changed: 0,
    username: "",
    bonusSports: [],
    loading: true
    }

  }

  componentDidMount(){
    let userID = window.location.pathname.split("/")[2]
    let url = config.url.BASE_URL + 'users' + "/" + userID

    fetch(url)
    .then(res => res.json()).then(res => (this.setState({user: res.user})))
    .then(() => this.setState({loading: false}))
    .catch(() => this.setState({loading: false}))
  }

  sortedSportsList(){
    let official = []
    let unofficial = []
    let nothingPlayed = []
    let athlete
    this.state.user.sports.forEach((sport) => {
      if (sport.id !== "10" && sport.opponents.length >=5){
        let uselessVariable
        let numGames = 0
        this.state.user.events.forEach((event) => {
          // eslint-disable-next-line
          if(event.sport == sport.id){
            numGames++
          }
        })
        sport["numGames"] = numGames
        if(numGames >= 5){
          official.push(sport)
        }
        else{
          unofficial.push(sport)
        }
      } else if (sport.id !== "10" && sport.opponents.length > 0) {
        let numGames = 0
        this.state.user.events.forEach((event) => {
          // eslint-disable-next-line
          if(event.sport == sport.id){
            numGames++
          }
        })
        sport["numGames"] = numGames
        unofficial.push(sport)
      } else if (sport.id !== "10"){
        nothingPlayed.push(sport)
      }
      else {
        athlete = sport
      }
    })
    let sports = [athlete]


    return sports.concat(this.quickSort(official), [""], this.quickSort(unofficial), [""], this.quickSort(nothingPlayed.concat(this.state.bonusSports)), [official.length])
  }
  quickSort(sports) {
    if (sports.length <= 1) {
       return sports;
       } else {
         var left = [];
         var right = [];
         var newArr = [];
         var length = sports.length - 1;
         var pivot = sports[length];
         for (var i = 0; i < length; i++) {
            if (sports[i]["rating"] >= pivot["rating"]) {
               left.push(sports[i]);
             } else {
               right.push(sports[i]);
             }
           }
       return newArr.concat(this.quickSort(left), pivot, this.quickSort(right));
    }
 }

  render(){
    if (this.state.loading){
      return(
        <div>
          <span className="spinner-position">
            <Spinner animation="border" className="ml-3"/><br/>Loading...
          </span>
        </div>
      )
    } else if(this.state.user.username == null){
      return(
        <div>
        <br/><br/><br/>
          <h1 style={{color: "red"}}>User not found.</h1>
        </div>
      )
    } else{
    let sports = []
    let athlete = ""
    let officialSports = []
    let unofficialSports = []
    let initialSports = []
    let officialCard = ""
    let unofficialCard = ""
    let initialCard = ""
    if(this.state.user.sports){
      let sportsList = this.sortedSportsList()
      let officialLength = sportsList.pop()

      // athlete, official(sorted), [""], unofficial(sorted), [""], nothingPlayed(sorted), [official.length])
      //   0    ,   officialLength, officialLength+1, officialLength+2
      sportsList.forEach((sport, i) => {
        if(i === 0){
          athlete = <span className="athlete-statement"><span className="pr-2 athlete-statement-words" style={{color: "#225FBA"}}>Athlete Rating</span> {sport.rating.toFixed(2)}</span>
        } else if (i <= officialLength) {
          officialSports.push(
            <tr className="profile-sport-list-item">
              <td style={{cursor: 'default'}} className="group sport-name">{sport.name}</td>

              <td className="group rating">{`${sport.rating.toFixed(2)}`}</td>
              <td className="group opponents-played">{sport.opponents.length}</td>
              <td className="group games-played">{sport.numGames}</td>
            </tr>
          )} else if(sport === ""){
          } else if(sport.opponents.length > 0){
            unofficialSports.push(
              <tr className="profile-sport-list-item">
              <td style={{cursor: 'default'}} className="group sport-name">{sport.name}</td>

                <td className="group rating">{`${sport.rating.toFixed(2)}`}</td>
                <td className="group opponents-played">{sport.opponents.length}</td>
                <td className="group games-played">{sport.numGames}</td>

              </tr>
            )
          } else{
            initialSports.push(
              <tr className="profile-sport-list-item">
              <td style={{cursor: 'default'}} className="group sport-name">{sport.name}</td>

                <td className="group rating">{`${sport.rating.toFixed(2)}`}</td>
              </tr>
            )
          }



      });

      if (initialSports.length > 0){
        initialCard =
          <Card className="mt-5 initial-card shadow" style={{width: '100%'}}>
          <Card.Body>
            <Card.Title className="initial-title ml-5">Initial Rating Only</Card.Title>
            <Container className="mx-auto w-100">
              <Row>

              <Col className="px-0 mx-0 w-100" xs="12">
              <Table className="pl-0 mx-0" striped hover responsive="sm">
                <thead>
                  <tr>
                    <th/>
                    <th style={{cursor: 'default'}}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                {initialSports}
              </tbody>
              </Table>
              </Col>
              </Row>
              <Row>
              </Row>
              </Container>
            </Card.Body>
          </Card>
      }
      else{
        initialCard =""
      }
      if(unofficialSports.length > 0){
        unofficialCard =

          <Card className="mt-5 unofficial-card shadow" style={{width: '100%'}}>
          <Card.Body>
            <Card.Title className="unofficial-title ml-5">Unofficial Sports <span>
            <OverlayTrigger
       trigger={["hover", "focus"]}
       placement="auto"
       overlay={
         <Popover style={{width: '120%'}}>
           <Popover.Header as="h3" style={{textAlign: "center"}}>Unofficial Sports*</Popover.Header>
           <Popover.Body>
           Sports are unofficial until you have played at least five opponents <b>AND</b> at least five games.
           </Popover.Body>
         </Popover>
       }
     >
       <Button className="unofficial-explanation pb-2">?</Button>
     </OverlayTrigger>
      </span></Card.Title>
      <Container className="mx-auto">
        <Row>
        <Col className="pl-0 ml-0" xs="12">
        <Table className="pl-0 ml-0" striped hover responsive="sm">
          <thead>
            <tr>
              <th/>
              <th style={{cursor: 'default'}}>Rating</th>
              <OverlayTrigger
                      placement="top"
                      key="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          Opponents Played
                        </Tooltip>
                      }
                      ><th style={{cursor: 'default'}}><u style={{borderBottom: "1px dotted #000", textDecoration: "none"}}>OP</u></th></OverlayTrigger>
                      <OverlayTrigger
                              placement="top"
                              key="top"
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Game Played
                                </Tooltip>
                              }
                              ><th style={{cursor: 'default'}}><u style={{borderBottom: "1px dotted #000", textDecoration: "none"}}>GP</u></th></OverlayTrigger>
            </tr>
          </thead>
          <tbody>
          {unofficialSports}
        </tbody>
        </Table>
        </Col>
        </Row>
        </Container>
            </Card.Body>
          </Card>
      }
      else{
        unofficialCard = ""
      }
      if(officialLength > 0){
        officialCard =
          <Card className="mt-5 official-card shadow w-100" >
          <Card.Body>
            <Card.Title style={{textAlign: "left"}} className="official-title ml-5">Ranked Sports</Card.Title>
            <Container className="mx-auto">
              <Row>
              <Col className="pl-0 mx-0" xs="12">
              <Table className="pl-0 ml-0" striped hover responsive="sm">
                <thead>
                  <tr>
                    <th/>
                    <th style={{cursor: 'default'}}>Rating</th>
                    <OverlayTrigger
                            placement="top"
                            key="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Opponents Played
                              </Tooltip>
                            }
                            ><th style={{cursor: 'default'}}><u style={{borderBottom: "1px dotted #000", textDecoration: "none"}}>OP</u></th></OverlayTrigger>
                            <OverlayTrigger
                                    placement="top"
                                    key="top"
                                    overlay={
                                      <Tooltip id={`tooltip-top`}>
                                        Game Played
                                      </Tooltip>
                                    }
                                    ><th style={{cursor: 'default'}}><u style={{borderBottom: "1px dotted #000", textDecoration: "none"}}>GP</u></th></OverlayTrigger>
                  </tr>
                </thead>
                <tbody>
                {officialSports}
              </tbody>
              </Table>
              </Col>
              </Row>
              </Container>
            </Card.Body>
          </Card>
      }
      else{
        officialCard=""
      }
    }
    return(


            <div style={{paddingTop: "3%", paddingBottom: "1%", backgroundColor: "#eee"}}>
            <Container className="d-block d-lg-none pb-5">
              <Row>
                <Col>
                .
                </Col>
              </Row>
            </Container>

                <Container className="ml-0" style={{paddingTop: "5%", paddingBottom: "1%", backgroundColor: "#eee"}}>
                <Row style={{width: '100vw'}}>
                <Col xs="12" md="9" className="px-0 mx-md-auto">
                <Card className="ml-0" style={{width: "100%"}} className="shadow">
                  <Card.Title className="athlete-card-title pt-3 pl-5" style={{fontSize: '4vh'}}><b>{this.state.user.firstname} {this.state.user.lastname}'s <br className="d-block d-md-none"/>Athlete Profile</b><br/><span style={{fontSize: "3vh"}}>@{this.state.user.username}</span></Card.Title>
                  <Card.Body className="pl-5">
                    <span style={{marginBottom: "1%"}}>{athlete}</span>
                  </Card.Body>
                </Card>
                  </Col>
                </Row>
                <Row style={{width: '100vw'}}>
                  <Col xs="12" md="9" className="px-0 mx-md-auto">
                  {officialCard}
                  </Col>
                </Row>
                <Row style={{width: '100vw'}}>
                  <Col xs="12" md="9" className="px-0 mx-md-auto">
                    {unofficialCard}
                  </Col>
                </Row>
                <Row style={{width: '100vw'}}>
                  <Col xs="12" md="9" className="px-0 mx-md-auto">
                    {initialCard}
                  </Col>
                </Row>
                <Row style={{width: '100vw'}}>
                <Col xs="12" md="9" className="px-0 mx-md-auto">

                </Col>
                </Row>
                </Container>


            </div>
  )}
}
}
