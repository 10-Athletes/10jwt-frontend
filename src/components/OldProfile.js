import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'
import { config } from './utility/Constants'
import { Button, Form, Container, Row, Col, Modal, Card, ListGroup } from 'react-bootstrap';
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
    bonusSports: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.fillSportName = this.fillSportName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
// Configure for allowing viewing other users' profiles
  componentDidMount() {
    // let user = {}
    let username = ""
    // let sports = []

    let url = config.url.BASE_URL + 'sports'
    let jwt = window.localStorage.getItem('jwt')
    if(!jwt){
      this.props.history.push('/register', {error: "You must be signed in to view a profile"})
    } else {
      let result = jwtDecode(jwt)
      if (result.username){
        username = result.username
      }
      let url2 = config.url.BASE_URL + 'users/'+result.id

    // console.log(this.props)

  // SAMPLE FETCH
    // fetch("url,
    // { method: 'POST', body: formData })
    // .then(res => res.json()).then(res => (console.log(res.jwt),
    // window.localStorage.setItem('jwt', res.jwt)))
    // .then(() => this.props.history.push('/'))
    // .catch(function(error){console.log('There is an error: ', error.message)})

      Promise.all([fetch(url), fetch(url2)])
      .then(function(responses) {
        return Promise.all(responses.map(function(response) {
          return response.json();
        }));
      }).then(function(data){
        let user = data[1].user
        let detail = 0
        let winner = '0'
        let ratingChange = 0
        if(this.props.location.state){
          detail = this.props.location.state.detail
          winner = this.props.location.state.winner
          if(user.events){
            user.sports.forEach((sport) => {
              // eslint-disable-next-line
              if(sport.id == detail){
                user.events[user.events.length - 1].team1.forEach((player) => {
                  if(player.id  === user.id){
                    ratingChange = Math.abs(player.ratingChange).toFixed(3)
                  }
                });

              }
            });
          }
        }
        this.setState({sports: data[0].sports, user, username, changed: detail, winner, ratingChange})
      }.bind(this)).catch(function(error) {
        console.log(error)
      })
    }
  }

  sortedSportsList(){
    let official = []
    let unofficial = []
    let nothingPlayed = []
    let athlete
    this.state.user.sports.forEach((sport) => {
      if (sport.id !== "10" && sport.opponents.length >=5){

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

 handleChange(event) {
   let sportMatches = [...this.state.sportMatches]
   if(event.target.name === 'sport'){
     sportMatches = this.findSports(event.target.value)
   }

   this.setState({
     [event.target.name]: event.target.value,
     sportMatches,
   });
 }

 findSports(sportName){
   let sportMatches = [];
   if(sportName.length >= 3){
     var list = this.state.sports;
     let user = this.state.user
     list.forEach(function(sport,p){
       let addedSport = false;
       let mismatch;
       [...Array((sport.name.length - sportName.length + 1) > 0 ? (sport.name.length - sportName.length + 1) : 0)].forEach((_, i) => {

          mismatch = 0;
         [...Array(sportName.length)].forEach((_,j) => {
           if(sportName[j].toUpperCase() !== sport.name[i+j].toUpperCase()){
             mismatch = mismatch + 1;
           }
         });
         if(mismatch < 2){
           var duplicate = false
           sportMatches.forEach(function(potentialSport){
             if(sport.id === potentialSport.id){
               duplicate = true
             }
           })
           if(!duplicate && sport.id !== 10){
             addedSport = true
             let alreadyRated = false
             sport.participants.forEach((participant) => {
               if(participant.id === user.id){
                 alreadyRated = true
               }
             });
             if(!alreadyRated)
             sportMatches.push({name: sport.name,id: sport.id});
           }
         }
       });
       if(sport.alternate_name && !addedSport){
         [...Array((sport.alternate_name.length - sportName.length + 1) > 0 ? (sport.alternate_name.length - sportName.length + 1) : 0)].forEach((_, i) => {


           mismatch = 0;
           [...Array(sportName.length)].forEach((_, j) => {


             if(sportName[j].toUpperCase() !== sport.alternate_name[i+j].toUpperCase()){
               mismatch = mismatch + 1;
             }
           });
           if(mismatch < 2){
              var duplicate = false
             sportMatches.forEach(function(potentialSport){
               if(sport.id === potentialSport.id){
                 duplicate = true
               }
             })
             if(!duplicate && sport.id !== 10){
               let alreadyRated = false
               sport.participants.forEach((participant) => {
                 if(participant.id === user.id){
                   alreadyRated = true
                 }
               });
               if (!alreadyRated)
               sportMatches.push({name: sport.name,id: sport.id});
             }
           }
         });
       }

     })
   }
   return sportMatches;
 }

 fillSportName(event){
 let sportMatches = [{
   name: event.target.attributes[2].value,
   id: event.target.attributes[1].value,
 }]
 this.setState({
   sport: event.target.attributes[2].value,
   sportID: event.target.attributes[1].value,
   sportMatches,
 })
}

 handleSubmit(event){
  event.preventDefault();
 const { sportMatches, rating, sportID, sport } = this.state
  var addThisSport
  const addUserToSport =
    {
      id: this.state.user.id,
      rating: parseFloat(rating),
      playerName: this.state.user.firstname + " " + this.state.user.lastname,
      username: this.state.user.username
    }
  let error = ""
  if(sportMatches.length > 0){
    var bold = sportMatches[0].id
    // addThisSport.append('id', sportMatches[0].id)
    // addThisSport.append('name', sportMatches[0].name)
    // addThisSport.append('rating', parseFloat(rating))
    addThisSport =
    {
      id: sportMatches[0].id,
      name: sportMatches[0].name,
      rating: parseFloat(rating)
    }
  } else if (sportID !== 0){
    bold = sportID
    // addThisSport.append('id', sportID)
    // addThisSport.append('name', sport)
    // addThisSport.append('rating', parseFloat(rating))
    addThisSport =
    {
      id: sportID,
      name: sport,
      rating: parseFloat(rating)
    }
  } else {
    error = "Invalid sport name. Verify that you don't already have a rating and haven't misspelled the name of the sport."
    this.setState({error})
  }
  if (error === ""){
    let url = config.url.BASE_URL + "users/" + this.state.user.id
    let url2 = config.url.BASE_URL + "sports/" + bold

    Promise.all([fetch(
      url,
      {method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({newSport: addThisSport})}),
      fetch(
        url2,
        {method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({newUserInSport: addUserToSport})})])
    // fetch(url,
    //   {method: 'PATCH',
    //   headers: {'Accept': 'application/json',
    // 'Content-Type': 'application/json'},
    //   body: JSON.stringify({newSport: addThisSport})})
    .then(function(responses) {
      return Promise.all(responses.map(function(response) {
        return response.json();
      }));
    }).then(function(data){
      let a = this.state.bonusSports

      a.push({
        id: sportID,
        name: sport,
        rating: parseFloat(rating),
        opponents: [],
        official: false
      })
      this.setState({bonusSports: a, changed: sportID, winner: 0, sport: "", rating: ""})
      // eslint-disable-next-line
    }.bind(this))
    .catch(function(error) {
      console.log(error)
    })

    // fetch("url,
    // { method: 'POST', body: formData })
    // .then(res => res.json()).then(res => (console.log(res.jwt),
    // window.localStorage.setItem('jwt', res.jwt)))
    // .then(() => this.props.history.push('/'))
    // .catch(function(error){console.log('There is an error: ', error.message)})
 //    let url3 = config.url.BASE_URL + "/logged_in"
 //    axios.all([axios.patch(url, {newSport: addThisSport}, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true} ), axios.patch(url2, {newUserInSport: addUserToSport}, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true})])
 //      .then(axios.spread((...responses) => {
 //        axios.get(url3, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true})
 //        .then(response => {
 //          const user = response.data.user
 //
 //        this.setState({
 //          sportMatches: [],
 //          rating: "",
 //          sport: "",
 //          error: "",
 //          changed: bold,
 //          winner: '0',
 //          user
 //        })})
 //        // this.props.history.push('/profile')
 //      }))
    }
  }


  render(){
    console.log(this.state)
    let sportsPlayed = []
    let unofficial = "*"
    let official = ""
    let officialOrNot, sOrNot
    let s = "s"
    let athlete = ""
    let sportList = []
    let ratingChange = ""
    let anyUnofficial = false
    let anyUnplayed = false
    let anyOfficial = false
    let officialSportPlayed = [<ListGroup.Item>
      <Row>
      <Col className="group sport-and-rating">Sport Name and Rating</Col>
      <Col style={{textAlign: "center"}} className="group opponents-played">Opponents Played</Col>
      <Col style={{textAlign: "center"}} className="group games-played">Games Played</Col>
      </Row>
    </ListGroup.Item>]
    let unofficialSportPlayed = [<ListGroup.Item>
      <Row>
      <Col className="group sport-and-rating">Sport Name and Rating</Col>
      <Col style={{textAlign: "center"}} className="group opponents-played">Opponents Played</Col>
      <Col style={{textAlign: "center"}} className="group games-played">Games Played</Col>
      </Row>
    </ListGroup.Item>]
    let onlyInitialRating = [<ListGroup.Item>
      <Row>
      <Col className="group sport-and-rating">Sport Name and Rating</Col>

      </Row>
    </ListGroup.Item>]
    let onlyInitialIncluded = false
    let initialCard = ""
    let officialIncluded = false
    let officialCard = ""
    let unofficialIncluded = false
    let unofficialCard = ""



    if((this.state.user.sports && this.state.user.sports.length > 0) || (this.state.bonusSports && this.state.bonusSports.length > 0)){
      // Get list of sports sorted
      let sports = this.sortedSportsList()
      let officialLength = sports.pop()


      sports.forEach((sport, i) => {
        let color = 'black'
        let weight = 'normal'
        let fontSize = 'inherit'
        if(sport){
          // eslint-disable-next-line
          if(sport.id == this.state.changed){
            weight = 'bold'
            fontSize = 'x-large'
            if(this.state.winner === '1'){
              color = 'green'
              ratingChange = `+(${this.state.ratingChange})`
            } else if (this.state.winner === '2') {
              color = 'red'
              ratingChange = `(-${this.state.ratingChange})`
            } else {
              color = 'blue'
            }
          } else {
            ratingChange = ""
          }
          if(i === 0){
            sportsPlayed.push("")
          }
          if(sport === ""){
            sportsPlayed.push(<br key={`skip${i}`}/>)
          } else {
            if ((sport.id === "10" && sport.official === true) || (sport.id !== "10" && i <= officialLength)){

              officialOrNot = official
              fontSize="3vh"
              if(sport.id !== "10"){
                if(anyOfficial === false){
                  anyOfficial = true
                  sportsPlayed.push(<span style={{fontSize: "3.2vh", color: "#435685"}} key="official"><br/><br/><b>Official Sports</b><br/><div style={{height: "1vh"}}></div></span>)
              }
                officialIncluded = true
                officialSportPlayed.push(
                    <ListGroup.Item>
                      <Row >
                      <Col className="group sport-and-rating">{sport.name}: {`${sport.rating.toFixed(2)}`} {ratingChange}</Col>
                      <Col style={{textAlign: "center"}} className="group opponents-played">{sport.opponents.length}</Col>
                      <Col style={{textAlign: "center"}} className="group games-played">{sport.numGames}</Col>
                      </Row>
                    </ListGroup.Item>
                )
                sportsPlayed.push(
                  <div
                  className="officialSportsPlayedListItem"
                  data-sportid={sport.id}
                  key={`sport${sport.id}`}
                  sport={sport.name}
                  style={{fontWeight: 'bold', color: "#435685", fontSize}}>
                  {sport.name}: {`${sport.rating.toFixed(2)}`} {ratingChange}
                  </div>
                )

              }
            } else {
              if(sport.id !== "10"){
                officialOrNot = unofficial
                if (sport.opponents.length > 1){
                  sOrNot = s
                } else {
                  sOrNot = official
                }
                let games
                if(!sport.numGames){
                  games = 0
                } else {
                  games = sport.numGames
                }
                if(games > 0){
                  unofficialIncluded = true
                  unofficialSportPlayed.push(
                    <ListGroup.Item>
                      <Row >
                      <Col className="group sport-and-rating">{sport.name}: {`${sport.rating.toFixed(2)}`} {ratingChange}</Col>
                      <Col style={{textAlign: "center"}} className="group opponents-played">{sport.opponents.length}</Col>
                      <Col style={{textAlign: "center"}} className="group games-played">{games}</Col>
                      </Row>
                    </ListGroup.Item>
                  )
                } else {
                  onlyInitialIncluded = true
                  onlyInitialRating.push(
                    <ListGroup.Item>
                      <Row >
                      <Col className="group sport-and-rating">{sport.name}: {`${sport.rating.toFixed(2)}`} {ratingChange}</Col>
                      </Row>
                    </ListGroup.Item>
                  )
                }
                let text = <div><span>{sport.name}: {sport.rating.toFixed(2)}{officialOrNot} {ratingChange}</span><span style={{float: 'right'}}>{sport.opponents.length} opponent{sOrNot} played</span></div>
                if(sport.opponents.length > 0){
                  if(!anyUnofficial){
                    anyUnofficial = true
                    sportsPlayed.push(<span style={{fontSize: "3vh"}} key="unofficial"><br/><br/><b>Unofficial Sports</b><br/> <span style={{fontSize: "large"}}>Play 5 or more opponents to earn an official rating</span>  <br/><br/></span>)
                  }

                } else {
                  if(!anyUnplayed){
                    anyUnplayed = true
                    sportsPlayed.push(<div><br/><span style={{fontSize: "3vh"}} key="initial"><br/><b>Initial Rating Only</b></span><br/><br/></div>)
                    sOrNot = s
                  }
                  text = <div>{sport.name}: {sport.rating.toFixed(2)}{officialOrNot} {ratingChange}</div>
                }

                sportsPlayed.push(
                  <div
                  className="sportsPlayedListItem"
                  data-sportid={sport.id}
                  key={`sport${sport.id}`}
                  style={{color, fontWeight: weight, fontSize: 'x-large'}}
                  sport={sport.name}>
                  {text}
                  </div>
              )
              }
            }

            if(sport.id === "10"){
              athlete = <span style={{fontSize: "3.5vh", color: "teal"}} className="AthleteRating" key={sport.id}><b>Athlete Rating: {sport.rating.toFixed(2)}{officialOrNot}{officialOrNot}</b></span>
            }}
        }});
    }

    this.state.sportMatches.forEach((sport) => {
      sportList.push(<div className="sportsListItem" id={sport.id} key={`sport${sport.id}`} name={sport.name}>{sport.name}</div>)
    });

    if (onlyInitialIncluded){
      initialCard =
        <Card className="mt-5 initial-card">
        <Card.Body>
          <Card.Title className="initial-title ml-3">Initial Rating Only</Card.Title>
            <ListGroup variant="flush">
              {onlyInitialRating}
            </ListGroup>
          </Card.Body>
        </Card>
    }
    if(unofficialIncluded){
      unofficialCard =
        <Card className="mt-5 unofficial-card">
        <Card.Body>
          <Card.Title className="unofficial-title ml-3">Unofficial Sports</Card.Title>
            <ListGroup variant="flush">
              {unofficialSportPlayed}
            </ListGroup>
          </Card.Body>
        </Card>
    }
    if(officialIncluded){
      officialCard =
        <Card className="mt-5 official-card">
        <Card.Body>
          <Card.Title className="official-title ml-3">Official Sports</Card.Title>
            <ListGroup variant="flush">
              {officialSportPlayed}
            </ListGroup>
          </Card.Body>
        </Card>
    }
    return(

      <div style={{paddingTop: "5%"}}>

      <br/><br/>
        <span style={{paddingLeft: '10%', paddingRight: '30%', textAlign: "center", fontSize: "4vh"}}><b>{this.state.user.firstname} {this.state.user.lastname}'s Athlete Profile</b><br/><span style={{paddingLeft: '10%', paddingRight: '30%', fontSize: "3vh"}}>@{this.state.user.username}</span></span>
        <ul style={{fontSize: 'larger', paddingLeft: '10%', paddingRight: '30%'}}>
          {athlete}
          {officialCard}
          {unofficialCard}
          {initialCard}
          <Card className="mt-5 add-sport">
            <Card.Body>
              <Card.Title className="add-sport-title ml-3">Pick a sport that you want to play and set your initial rating out of 10</Card.Title>
              <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col xs="12" lg="auto">
                  <Form.Control
                    size="lg"
                    className="mb-2"
                    name="sport"
                    placeholder="  Sport Name"
                    onChange = {this.handleChange}
                    value={this.state.sport}
                    required
                  />
                </Col>
                <Col xs="12" lg="auto">
                  <Form.Control
                    size="lg"
                    className="mb-2"
                    id="passwordInput"
                    placeholder="  Password"
                    type="password"
                    name="password"
                    required
                  />
                </Col>
                <Col lg="auto">
                  <Button type="submit" size="lg" variant="success" block className="mb-2 px-3">
                    Add Rating
                  </Button>
                </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </ul>
        <br/>
        <br/>

        <ul>
        <span style={{fontSize: "x-large"}}>Pick a sport that you want to play and set your initial rating out of 10</span><br/>
        <br />
        <form onSubmit={this.handleSubmit}>
          <input
            type="name"
            name="sport"
            placeholder="   Sport Name"
            value={this.state.sport}
            onChange = {this.handleChange}
            style={{float: "center", width: '10%', height: '3.5vh', fontSize: 'x-large', marginRight: "1%"}}
            required
          />
          <input
            type="number"
            step=".1"
            name="rating"
            min="1.0"
            max="10.00000000000"
            placeholder="   Rating out of 10"
            value={this.state.rating}
            onChange = {this.handleChange}
            style={{float: "center", width: '15%', height: '3.5vh', fontSize: 'x-large'}}
            required
          />
          <div className="sportSearchList" onClick={this.fillSportName}
          >{sportList}</div>
          <br/>
          <br />
          <button type="submit" style={{width: '12%', backgroundColor: "#42B729", color: "white", height: '4.25vh', fontSize: 'x-large'}}><b>Add Rating</b></button>
          <br /> <br />
          <h2 style={{color: "red"}}>{this.state.error}</h2>
        </form>
        <br/>
        <div style={{fontSize: 'x-large'}}>* : Unofficial rating. Fewer than 5 opponents or 5 games played.<br />
        ** : For your athlete rating to be official you must have at least one official sport.</div>
        </ul>
      </div>
    )}
}
