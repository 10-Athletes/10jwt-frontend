import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'
import { config } from './utility/Constants'
import { Button, Form, Collapse, Container, Row, Col, Modal, Spinner, Card, ListGroup, Popover, OverlayTrigger, Tooltip, Table, Accordion } from 'react-bootstrap';
import styles from './Profile.css'
import InfiniteScroll from 'react-infinite-scroll-component';


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    user: {},
    users: {},
    rating: "",
    sport: "",
    sports: [],
    sportID: 0,
    sportMatches: [],
    error: "",
    changed: 0,
    username: "",
    bonusSports: [],
    loading: true,
    collapsed: [],
    recentEvents: [],
    items: Array.from({length: 1}),
    hasMore: true
    }
    this.fetchMoreData = this.fetchMoreData.bind(this);
  }

  componentDidMount(){
    let userID = window.location.pathname.split("/")[2]
    let url = config.url.BASE_URL + 'users' + "/" + userID
    let url2 = config.url.BASE_URL + 'users'

    Promise.all([fetch(url), fetch(url2)])
    .then(function(responses) {
      return Promise.all(responses.map(function(response) {
        return response.json();
      }));
    }).then(function(data){
      let user = data[0].user
      let users = data[1].users
      let recentEvents = user.events.slice(-10000)
      recentEvents.reverse()
      this.setState({user, users, recentEvents})
    }.bind(this))
    .then(() => this.setState({loading: false}))
    .catch(() => this.setState({loading: false}))
  }

  fetchMoreData(){
    if(this.state.items.length >= this.state.recentEvents.length / 10){
      this.setState({hasMore: false})
    }
    setTimeout(() => {
      this.setState({
        items: this.state.items.concat(Array.from({ length: 1 }))
      });
    }, 500);
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

 individualGames(event, i, sportName){
   if(sportName !== ""){
     sportName = <td>{sportName}</td>
   }
   let row
   let team1 = []
   let team2 = []
   this.state.users.forEach((user, k) => {
     event.team1.forEach((player, l) => {

       if(user.id === player.id){
         team1[l] = k
       }
     });

     event.team2.forEach((player, l) => {
       if(user.id === player.id){
         team2[l] = k
       }
     });

   });

   let playerTeam = ["team2", -1]
   let date = ""
   let changeDirection = ""
   let changeColor = "green"
   if(event["created_at"]){
     date = String(new Date(event.created_at)).split(" ")
     date = date[1] + " " + date[2] + " '" + date[3][2] + date[3][3]

   }
   event.team1.forEach((player, j) => {
     if(player.id === this.state.user.id){
       playerTeam = ["team1", j]
     }
   });
   if(playerTeam[0] === "team2"){
     event.team2.forEach((player, j) => {
       if(player.id === this.state.user.id){
         playerTeam[1] = j
       }
     });
   }
   let winner
   if(playerTeam[0] === "team1"){
     let opponents = this.state.users[team2[0]].firstname + " " + this.state.users[team2[0]].lastname[0]
     if(event.team2.length > 1){
       opponents = opponents + "'s Team (" + event.team2InitialRating.toFixed(2) + ")"
       let oppList = []
       team2.forEach((i, j) => {
         let link = "/profile/"
         oppList.push(<tr><td><a href={link}>{this.state.users[i].firstname + " " + this.state.users[i].lastname[0]}</a></td><td>{event.team2[j].initialRating.toFixed(2)}</td></tr>)
       });

       opponents =
         <Accordion>
           <Accordion.Header className="sport-individual-games">{opponents}</Accordion.Header>
           <Accordion.Body>
             <Table>
               <thead>
                 <tr>
                   <th>Name</th>
                   <th>Rating</th>
                 </tr>
               </thead>
               <tbody>
                 {oppList}
               </tbody>
             </Table>
             </Accordion.Body>
         </Accordion>

     } else {
       let link = "/profile/" + event.team2[0].id
       opponents = <span><a href={link}>{opponents}</a> ({event.team2[0].initialRating.toFixed(2)})</span>
     }
     let teammates = ""
     if(event.team1.length > 1){
       let team = []
       team1.forEach((i, j) => {
         if(this.state.users[i].id !== this.state.user.id){
           let link = "/profile/"
           link += this.state.users[i].id
           team.push(<tr><td><a href={link}>{this.state.users[i].firstname + " " + this.state.users[i].lastname[0]}</a></td><td>{event.team1[j].initialRating.toFixed(2)}</td></tr>)
         }
       });
       if(team.length > 1){
         teammates =
           <Accordion>
             <Accordion.Header> </Accordion.Header>
             <Accordion.Body>
               <Table>
                 <thead>
                   <tr>
                     <th>Name</th>
                     <th>Rating</th>
                   </tr>
                 </thead>
                 <tbody>
                   {team}
                 </tbody>
               </Table>
               </Accordion.Body>
           </Accordion>
         }
         else{
           teammates = team[0]
         }
     }
     if(event.winner === "1"){
       winner = this.state.user.firstname + " " + this.state.user.lastname[0] + "'s Team"
       changeDirection = "+"
     } else {
       changeColor = "red"
     }


     row =
       <tr>
         <td>{date}</td>
         {sportName}
         <td>{event.team1[playerTeam[1]].initialRating.toFixed(2)}</td>
         <td style={{color: changeColor}}>{changeDirection + event.team1[playerTeam[1]].ratingChange.toFixed(2)}</td>
         <td>{opponents}</td>
         <td>{teammates}</td>
       </tr>

   } else {
     let opponents = this.state.users[team1[0]].firstname + " " + this.state.users[team1[0]].lastname[0]
     if(event.team1.length > 1){

       opponents = opponents + "'s Team (" + event.team1InitialRating.toFixed(2) + ")"
     } else {
       let link = "/profile/" + event.team1[0].id
       opponents = <span><a href={link}>{opponents}</a> ({event.team1[0].initialRating.toFixed(2)})</span>
     }
     let teammates = ""
     if(event.team2.length > 1){
       let team = []
       team2.forEach((i, j) => {
         if(this.state.users[i].id !== this.state.user.id){
           let link = "/profile/"
           link += this.state.users[i].id
           team.push(<tr><td><a href={link}>{this.state.users[i].firstname + " " + this.state.users[i].lastname[0]}</a></td><td>{event.team2[j].initialRating.toFixed(2)}</td></tr>)
         }
       });
       if(team.length > 1){
         teammates =
           <Accordion>
             <Accordion.Header> </Accordion.Header>
             <Accordion.Body>
               <Table>
                 <thead>
                   <tr>
                     <th>Name</th>
                     <th>Rating</th>
                   </tr>
                 </thead>
                 <tbody>
                   {team}
                 </tbody>
               </Table>
               </Accordion.Body>
           </Accordion>
         }
         else{
           teammates = team[0]
         }
     }
     if(event.winner === "2"){
       winner = this.state.user.firstname + " " + this.state.user.lastname[0] + "'s Team"
       changeDirection = "+"
     } else {
       winner = "User " + event.team2[playerTeam[1]].id + "'s Team"
       changeColor = "red"
     }

     row =
       <tr>
         <td>{date}</td>
         {sportName}
         <td>{event.team2[playerTeam[1]].initialRating.toFixed(2)}</td>
         <td style={{color: changeColor}}>{changeDirection + event.team2[playerTeam[1]].ratingChange.toFixed(2)}</td>
         <td>{opponents}</td>
         <td>{teammates}</td>
       </tr>


   }
   // <tr>
   //   <td>{date}</td>
   //   <td>{event.team2InitialRating.toFixed(2)}</td>
   //   <td style={{color: changeColor}}>{event.team2[playerTeam[1]].ratingChange.toFixed(2)}</td>
   //   <td>{"User " + event.team1[playerTeam[1]].id + "'s Team " + event.team2InitialRating.toFixed(2)}</td>
   //   <td></td>
   // </tr>


   return row
 }

 toggle(i){
   let arr = this.state.collapsed
   arr[i] = !this.state.collapsed[i]
   this.setState({collapsed: arr})
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
    let cards = []
    let sports = []
    let athlete = ""
    let officialSports = []
    let unofficialSports = []
    let initialSports = []
    let officialCard = ""
    let unofficialCard = ""
    let initialCard = ""
    let recentCard = ""
    if(this.state.user.sports){
      let sportsList = this.sortedSportsList()
      let officialLength = sportsList.pop()
      let events = {}
      if(this.state.user.events && this.state.user.events.length > 0){
        let eventTable = []
        this.state.recentEvents.forEach((game, i) => {
          let sportName = ""
          this.state.user.sports.forEach((sport) => {
            if(game.sport == sport.id){
              sportName = sport.name
            }
          });
          let row = this.individualGames(game, i, sportName)
          eventTable.push(row)
        });
        let eventsPerCard = 10
        let result = eventTable.reduce((resultArray, item, index) => {
          const cardIndex = Math.floor(index/eventsPerCard)

          if(!resultArray[cardIndex]) {
            resultArray[cardIndex] = []
          }

          resultArray[cardIndex].push(item)

          return resultArray
        }, [])

        result.forEach((item, i) => {
          let recentText = ""
          if(i === 0){
            recentText = "Recent Games"
          }
          cards.push(
        <Card className="mt-3 recent-card shadow" style={{width: '100%'}}>
        <Card.Body>
          <Card.Title className="recent-title ml-5">{recentText}</Card.Title>
          <Container className="mx-auto w-100">
            <Row>

            <Col className="px-0 mx-0 w-100" xs="12">
            <Table className="pl-0 mx-0" striped hover responsive="sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sport</th>
                  <th style={{cursor: 'default'}}>Rating</th>
                  <th>Chg</th>
                  <th>Opponents</th>
                  <th>Teammates</th>
                </tr>
              </thead>
              <tbody>
                {item}
              </tbody>
            </Table>
            </Col>
            </Row>
            <Row>
            </Row>
            </Container>
          </Card.Body>
        </Card>
        )});
      //   <InfiniteScroll
      //     dataLength = {this.state.items.length}
      //     next = {this.fetchMoreData}
      //     hasMore = {this.state.hasMore}
      //     loader = <h4>Loading...</h4>
      //     height = {400}
      //   >
      // </InfiniteScroll>
        this.state.user.events.forEach((event) => {
          if(events[event.sport]){
            events[event.sport].push(event)
          } else{
            events[event.sport] = [event]
          }
        });
      }

      // athlete, official(sorted), [""], unofficial(sorted), [""], nothingPlayed(sorted), [official.length])
      //   0    ,   officialLength, officialLength+1, officialLength+2
      sportsList.forEach((sport, i) => {
        if(sport != undefined){
        let collapseChar = '►'
        if(this.state.collapsed[i]){
          collapseChar = '▼'
        }
        if(i === 0 ){
          athlete = <span className="athlete-statement"><span className="pr-2 athlete-statement-words" style={{color: "#225FBA"}}>Athlete Rating</span> {sport.rating.toFixed(2)}</span>
        } else if (i <= officialLength) {
          events[sport.id].reverse()
          let eventTable = []
          events[sport.id].forEach((game, i) => {
            let row = this.individualGames(game, i, "")
            eventTable.push(row)
          })

          eventTable =
          <td colSpan="4" className="py-0 my-0" style={{height: '0px'}}>
            <Collapse in={this.state.collapsed[i]} className="w-100">
              <Table striped>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Chg</th>
                    <th>Opponents</th>
                    <th>Teammates</th>
                  </tr>
                </thead>
                <tbody>
                {eventTable}
                </tbody>
              </Table>
            </Collapse>
            </td>
          officialSports.push(
            <tr className="profile-sport-list-item">
              <td onClick={() => this.toggle(i)} style={{cursor: 'default', width: '100%', whiteSpace: "nowrap"}} className="group sport-name"><span className="pr-2 pr-sm-3">{collapseChar}</span> {sport.name}</td>
              <td onClick={() => this.toggle(i)} className="group rating">{`${sport.rating.toFixed(2)}`}</td>
              <td onClick={() => this.toggle(i)} className="group opponents-played">{sport.opponents.length}</td>
              <td onClick={() => this.toggle(i)} className="group games-played">{sport.numGames}</td>
            </tr>
          )
          officialSports.push(eventTable)
        } else if(sport === ""){
          } else if(sport.opponents.length > 0){
            events[sport.id].reverse()
            let eventTable = []
            events[sport.id].forEach((game, i) => {
              let row = this.individualGames(game, i, "")
              eventTable.push(row)
            })
            eventTable =
            <td colSpan="4" className="py-0 my-0" style={{height: '0px'}}>
              <Collapse in={this.state.collapsed[i]} className="w-100">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Rating</th>
                      <th>Chg</th>
                      <th>Opponents</th>
                      <th>Teammates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventTable}
                  </tbody>
                </Table>
              </Collapse>
              </td>
            unofficialSports.push(
              <tr className="profile-sport-list-item">
                <td onClick={() => this.toggle(i)} style={{cursor: 'default', width: '100%', whiteSpace: "nowrap"}} className="group sport-name"><span className="pr-2 pr-sm-3">{collapseChar}</span> {sport.name}</td>
                <td onClick={() => this.toggle(i)} className="group rating">{`${sport.rating.toFixed(2)}`}</td>
                <td onClick={() => this.toggle(i)} className="group opponents-played">{sport.opponents.length}</td>
                <td onClick={() => this.toggle(i)} className="group games-played">{sport.numGames}</td>
              </tr>
            )
            unofficialSports.push(eventTable)
          } else{
            initialSports.push(
              <tr className="profile-sport-list-item">
              <td style={{cursor: 'default'}} className="group sport-name">{sport.name}</td>

                <td className="group rating">{`${sport.rating.toFixed(2)}`}</td>
              </tr>
            )
          }


}
      });

      if (initialSports.length > 0){
        initialCard =
          <Card className="mt-3 initial-card shadow" style={{width: '100%'}}>
          <Card.Body>
            <Card.Title className="initial-title ml-5">Initial Rating Only</Card.Title>
            <Container className="mx-auto w-100">
              <Row>

              <Col className="px-0 mx-0 w-100" xs="12">
              <Table className="pl-0 mx-0" striped hover responsive="sm">
                <thead>
                  <tr>
                    <th style={{textAlign: "left"}}>Sport</th>
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

          <Card className="mt-3 unofficial-card shadow" style={{width: '100%'}}>
          <Card.Body>
      <Container className="mx-auto">
        <Row>
        <Col className="pl-0 ml-0" xs="12">
        <Table className="pl-0 ml-0" striped hover responsive="sm">
          <thead>
            <tr>
              <th style={{textAlign: "left"}}>Sport</th>
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
                                  Games Played
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
          <Card className="mt-3 official-card shadow w-100" >
          <Card.Body>
            <Card.Title style={{textAlign: "left"}} className="official-title ml-5">Ranked Sports</Card.Title>
            <Container className="mx-auto">
              <Row>
              <Col className="pl-0 mx-0" xs="12">
              <Table className="pl-0 ml-0" striped hover responsive="sm">
                <thead>
                  <tr>
                    <th style={{textAlign: "left"}}>Sport</th>
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
                                        Games Played
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
                <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
        >
          {this.state.items.map((i, index) => (
            <div key={index}>
              {cards[index]}
            </div>
          ))}
        </InfiniteScroll>
                </Col>
                </Row>

                </Container>



            </div>
  )}
}
}
