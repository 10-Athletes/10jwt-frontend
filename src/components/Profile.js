import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'
import { Chart } from "react-charts";
import { config } from './utility/Constants'

import {
  Container,
  Row,
  Col,
  Button,
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
let errorObj = {
  errorMsg:
    "Invalid sport name. Verify that you don't already have a rating and haven't misspelled the name of the sport.",
};

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
    username: ""
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
    
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    let url = config.url.BASE_URL + 'sports'
    let jwt = window.localStorage.getItem('jwt')
    let result = jwtDecode(jwt)
    let url2 = config.url.BASE_URL + 'users/'+result.id
    if (result.username){
      username = capitalizeFirstLetter(result.username);
    }
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
            if(sport.id === detail){
              ratingChange = Math.abs(sport.rating - user.events[user.events.length - 1].p1InitialRating).toFixed(3)
            }
          });
        }
      }
      this.setState({sports: data[0].sports, user, username, changed: detail, winner, ratingChange})
    }.bind(this)).catch(function(error) {
      console.log(error)
    })
  }

  sortedSportsList(){
    let official = []
    let unofficial = []
    let nothingPlayed = []
    let athlete
    this.state.user.sports.forEach((sport) => {
      if (sport.id !== 10 && sport.opponents.length >=5){
        official.push(sport)
      } else if (sport.id !== 10 && sport.opponents.length > 0) {
        unofficial.push(sport)
      } else if (sport.id !== 10){
        nothingPlayed.push(sport)
      }
      else {
        athlete = sport
      }
    })
    let sports = [athlete]
    return sports.concat(this.quickSort(official), [""], this.quickSort(unofficial), [""], this.quickSort(nothingPlayed))
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
  //restructing example
  
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
    error = errorObj.errorMsg
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
      console.log(data)
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
    
    //let photos = [
    //  'sibVwORYqs0',
    //  'd2MSDujJl2g',
    //  'i4OHxtxiMtk'
    //];
    //let getPhoto = photos[Math.floor(Math.random() * photos.length)];
    //let userPhoto = `https://source.unsplash.com/${getPhoto}/150x150`;

    if(this.state.user.sports && this.state.user.sports.length > 0){

      let sports = this.sortedSportsList()

      sports.forEach((sport, i) => {
        let color = 'black'
        let weight = 'normal'
        let fontSize = 'inherit'
        if(sport){
          if(sport.id === this.state.changed){
            weight = 'bold'
            fontSize = '14px'
            if(this.state.winner === '1'){
              color = 'green'
              ratingChange = `+(${this.state.ratingChange})`
            } else if (this.state.winner === '2') {
              color = 'red'
              fontSize = '14px'
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
            if ((sport.id === 10 && sport.official === true) || (sport.id !== 10 && sport.opponents.length >= 5)){
              officialOrNot = official
              fontSize="larger"
              if(sport.id !== 10){

                sportsPlayed.push(
                  <div
                  className="officialSportsPlayedListItem"
                  data-sportid={sport.id}
                  key={`sport${sport.id}`}
                  sport={sport.name}
                  style={{fontWeight: 'bold', color, fontSize}}>
                  {sport.name}: {`${sport.rating.toFixed(2)}`} {ratingChange}
                  </div>
                )
              }
            } else {
              if(sport.id !== 10){
                officialOrNot = unofficial
                if (sport.opponents.length > 1){
                  sOrNot = s
                } else {
                  sOrNot = official
                }
                let text = <div><span>{sport.name}: {sport.rating.toFixed(2)}{officialOrNot} {ratingChange}</span><span style={{float: 'right'}}>{sport.opponents.length} opponent{sOrNot} played</span></div>
                if(sport.opponents.length > 0){
                  if(!anyUnofficial){
                    anyUnofficial = true
                    sportsPlayed.push(<h3 key="unofficial">Unofficial Sports: play 5 or more opponents to earn an official rating.</h3>)
                  }

                } else {
                  if(!anyUnplayed){
                    anyUnplayed = true
                    sportsPlayed.push(<h3 key="initial">Initial Rating Only</h3>)
                    sOrNot = s
                  }
                  text = <div>{sport.name}: {sport.rating.toFixed(2)}{officialOrNot} {ratingChange}</div>
                }

                sportsPlayed.push(
                  <div
                  className="sportsPlayedListItem"
                  data-sportid={sport.id}
                  key={`sport${sport.id}`}
                  style={{color, fontWeight: weight, fontSize}}
                  sport={sport.name}>
                  {text}
                  </div>
              )
              }
            }

            if(sport.id === 10){
              athlete = <h2 className="AthleteRating" key={sport.id}>Athlete Rating: {sport.rating.toFixed(2)}{officialOrNot}{officialOrNot}</h2>
            }}
        }});
    }

    this.state.sportMatches.forEach((sport) => {
      sportList.push(<div className="sportsListItem" id={sport.id} key={`sport${sport.id}`} name={sport.name}>{sport.name}</div>)
    });


    return (
      <div>
        <Container fluid style={{marginTop:'1rem', width:'100%'}}>
          <Row>
            <Col>
              <Card>
                <CardImg top height="150px" width="150px" style={{width: '150px', height: '150px', margin: '15px auto'}} src="../logo2.png" alt="Card image cap" />
        <CardBody>
          <CardTitle tag="h5">{this.state.username}'s Profile</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">{athlete || 'Type of Athlete'}</CardSubtitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">{sportsPlayed || 'Sports played'}</CardSubtitle>
        </CardBody>
        <CardBody>
                </CardBody>
              </Card>
                </Col>
              <Col>
              <Card style={{ padding: "30px", backgroundColor:'#eee' }}>
                  <CardTitle className="text-dark">
                  * : Unofficial rating. You must play at least five unique
                  opponents in a sport before your rating is official.
                    </CardTitle>
                    <br />
                    <CardTitle className="text-dark">
                  ** : For your athlete rating to be official you must have at
                  least one official sport.
                  </CardTitle>
                  
                  <legend className="text-dark"> Pick a sport that you want to play and set your initial rating
                  out of 10</legend>
                  <Form onSubmit={this.handleSubmit}>
                  <Input
                    type="name"
                    name="sport"
                    placeholder="Sport Name"
                    value={this.state.sport}
                    onChange={this.handleChange}
                    style={{ color: "black" }}
                    required
                  />
                  <Input
                    type="number"
                    step=".5"
                    name="rating"
                    min="1.0"
                    max="10.00000000000"
                    placeholder="Rating out of 10"
                    value={this.state.rating}
                    onChange={this.handleChange}
                    style={{ color: "black", marginTop: "15px" }}
                    required
                  />
                  <ListGroup
                    className="sportSearchList"
                    onClick={this.fillSportName}
                  >
                    {/*each (sports in sportList){" "}
                    {<ListGroupItem>{sportList}</ListGroupItem>}*/}
                    {sportList}
                  </ListGroup>
                  <Button style={{ marginTop: "30px" }} type="submit">
                    Add Rating
                  </Button>
                  <h3 style={{ color: "red", fontSize: "14px" }}>
                    {this.state.error}
                  </h3>
                </Form>
                  
                </Card>
                    
            </Col>
            
          </Row>
          <Row>
          <Col>
                    <br />
              <Card style={{ backgroundColor:'#444', marginRight:'-15px', textAlign:'center', marginLeft:'-15px', minWidth: '90%' }}>
                    <br />
                <CardTitle className="text-white" style={{padding: '15px'}}>
                 Chart data
                    </CardTitle>
                    <br />
                    
              </Card>
            </Col>

          </Row>
        </Container>
      </div>
    );}
}
