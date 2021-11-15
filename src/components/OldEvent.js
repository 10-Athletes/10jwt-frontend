import React, { Component } from 'react';
import jwtDecode from 'jwt-decode'
import { Button, Form, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import styles from './NewEvent.css'

import { config } from './utility/Constants'

export default class NewEvent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sports: [],
      user: {},
      users: [],
      sport: "",
      opponent: "",
      sportMatches: [],
      opponentMatches: [],
      sportID: 0,
      opponentID: 0,
      initial: "",
      opponentRating: 0,
      error: "",
      opponentName: "",
      opponentUsername: "",
      teammate: "",
      teammateMatches: [],
      teammates: [],
      teamRating: 0,
      opponents: [],
      opponentTeamRating: 0,
      winnerChanged: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.fillSportName = this.fillSportName.bind(this);
    this.fillOpponent = this.fillOpponent.bind(this);
    this.fillTeammate = this.fillTeammate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findSports = this.findSports.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
  }

  componentDidMount() {
    let user = {}
    let jwt = window.localStorage.getItem('jwt');
    if(jwt){
      let result = jwtDecode(jwt)
      if(result.username){
        user = result
      }
    }
    let url1 = config.url.BASE_URL + 'sports'
    let url2 = config.url.BASE_URL + 'users'

    Promise.all([fetch(url1), fetch(url2)])
    .then(function(responses) {
      return Promise.all(responses.map(function(response) {
        return response.json();
      }));
    }).then(function(data){
      this.setState({sports: data[0].sports, users: data[1].users, user})

    }.bind(this)).catch(function(error) {
      // console.log(error)
    })

    // const requestSports = axios.get(url1, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true});
    // const requestUsers = axios.get(url2, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true})
    // axios.all([requestSports, requestUsers])
    // .then(axios.spread((...responses) => {
    //   const sports = responses[0].data.sports
    //   const users = responses[1].data.users
    //     this.setState({
    //       sports,
    //       users
    //     });
    //   })
    // );
  }

  handleChange(event) {
    let sportMatches = [...this.state.sportMatches]
    let opponentMatches = [...this.state.opponentMatches]
    let teammateMatches = [...this.state.teammateMatches]
    let winnerChanged = this.state.winnerChanged
    if(event.target.name === 'sport'){
      sportMatches = this.findSports(event.target.value)
    } else if (event.target.name === 'opponent') {
      opponentMatches = this.findOpponent(event.target.value)
    }
    if(event.target.name === 'teammate'){
      teammateMatches = this.findOpponent(event.target.value)
    }
    if(event.target.name === 'winner'){
      winnerChanged = true
    }
    this.setState({
      [event.target.name]: event.target.value,
      sportMatches,
      opponentMatches,
      teammateMatches,
      winnerChanged
    });
  }
  removePlayer(position, teammateOrOpponent){
    let teammates = []
    if(teammateOrOpponent === 'teammate'){
      teammates = [...this.state.teammates]
      let tmp = teammates;
      tmp.splice(position, 1);
      this.setState({teammates: tmp})
    } else {
      teammates = [...this.state.opponents]
      let tmp = teammates;
      tmp.splice(position, 1);
      this.setState({opponents: tmp})
    }
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
        //   console.log(i)
        // });

        // for(var i = 0; i < (sport.name.length - sportName.length + 1); i++){
           mismatch = 0;
          [...Array(sportName.length)].forEach((_,j) => {
          // for(var j = 0; j < sportName.length; j++){
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
              let rating = 0
              // console.log(user)
              sport.participants.forEach((participant) => {
                if(participant.id === user.id){
                  rating = participant.rating
                }
              });
              sportMatches.push({name: sport.name,id: sport.id, participants: sport.participants, listPos: p, rating});
            }
          }
        });
        if(sport.alternate_name && !addedSport){
          [...Array((sport.alternate_name.length - sportName.length + 1) > 0 ? (sport.alternate_name.length - sportName.length + 1) : 0)].forEach((_, i) => {

          // });

          // for( var i = 0; i < (sport.alternate_name.length - sportName.length + 1); i++){
            mismatch = 0;
            [...Array(sportName.length)].forEach((_, j) => {


            // for(var j = 0; j < sportName.length; j++){
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
                let rating = 0
                sport.participants.forEach((participant) => {
                  if(participant.id === user.id){
                    rating = participant.rating
                  }
                });
                sportMatches.push({name: sport.name,id: sport.id, participants: sport.participants, listPos: p, rating});
              }
            }
          });
        }
        if (sport.id === 10){
          // athleteRating = {name: sport.name, id: sport.id, participants: sport.participants, listPos: p};
        }
      })
    }
    // sportMatches.push(athleteRating)
    return sportMatches;
  }

  fillSportName(event){
  var rating = 0
  var gamesPlayed = -2
  var error = ""
  // console.log(this.state.user)

  this.state.sportMatches.forEach((sport) => {
    if(sport.id === parseInt(event.target.attributes[0].value)){
      rating = sport.rating
      // gamesPlayed = sport.gamesPlayed
    }
  });
  // if (rating === -42){
  //   error = "You must set an initial rating before you can submit results for this sport"
  // }
  //               sportMatches.push({name: sport.name,id: sport.id, participants: sport.participants, listPos: p, rating});
  let sportMatches = [{
    name: event.target.attributes[1].value,
    id: parseInt(event.target.attributes[0].value),
    participants: this.state.sports[event.target.attributes[2].value].participants,
    listPos: event.target.attributes[2].value,
    rating
  }]
  this.setState({
    sport: event.target.attributes[1].value,
    sportID: parseInt(event.target.attributes[0].value),
    sportPos: event.target.attributes[2].value,
    sportMatches,
    // athleteRatingPos: event.target.attributes[4].value,
    opponentPlaceholder: "Opponent",
    backgroundColor: "white",
    currentUserRating: rating,
    currentUserGamesPlayed: gamesPlayed,
    error: error
  })
}

  findOpponent(opponentSearch){
    let sportSet = this.state.sportID !== 0
    let teammates = this.state.teammates
    let opponents = this.state.opponents
    var userID = this.state.user.id
    var opponentMatches = [];
    if(opponentSearch.length >= 3){
      var list = this.state.users;
      list.forEach(function(opponent){
        let name = `${opponent.firstname} ${opponent.lastname}`
        let mismatch = false

        Array.from(Array((name.length-opponentSearch.length + 1) > 0 ? name.length-opponentSearch.length + 1 : 0).keys()).forEach((i) => {

          mismatch = false;
            [...Array(opponentSearch.length)].forEach((_,j) => {
            if(opponentSearch[j].toUpperCase() !== name[i+j].toUpperCase()){
              mismatch = true;
            }
          });
          if(!mismatch){
            var duplicate = false;
            opponentMatches.forEach(function(potential){
              if(potential.id === opponent.id){
                duplicate = true;
              }
            })
            teammates.forEach((teammate) => {
              if(teammate.id === opponent.id){
                duplicate = true
              }
            });
            opponents.forEach((person) => {
              if(person.id === opponent.id){
                duplicate = true
              }
            });
            if(!duplicate && opponent.id !== userID){
              let rating = 0
              if(sportSet) {
                opponent.sports.forEach((sport) => {
                  if(sport.id === sportSet){
                    rating = sport.rating
                  }
                });

              }
              opponentMatches.push({username: opponent.username, name: name, id: opponent.id, sports: opponent.sports, events: opponent.events, rating });
            }
          }
        });
        Array.from(Array((opponent.username.length - opponentSearch.length + 1) > 0 ? opponent.username.length - opponentSearch.length + 1 : 0).keys()).forEach((_, i) => {


        // for(i = 0; i < (opponent.username.length - opponentSearch.length + 1); i++){
          mismatch = false;
          for(var j = 0; j < opponentSearch.length; j++){
            if(opponentSearch[j].toUpperCase() !== opponent.username[i+j].toUpperCase()){
              mismatch = true;
            }
          }
          if(!mismatch){
            var duplicate = false;
            opponentMatches.forEach(function(potential){
              if(potential.id === opponent.id){
                duplicate = true;
              }
            })
            teammates.forEach((teammate) => {
              if(teammate.id === opponent.id){
                duplicate = true
              }
            });
            opponents.forEach((person) => {
              if(person.id === opponent.id){
                duplicate = true
              }
            });
            if(!duplicate && opponent.id !== userID){
              let rating = 0
              if(sportSet) {
                opponent.sports.forEach((sport) => {
                  if(sport.id === sportSet){
                    rating = sport.rating
                  }
                });

              }
              opponentMatches.push({username: opponent.username, name: name, id: opponent.id, sports: opponent.sports, events: opponent.events, rating});
            }
          }
        });
      })

    }
    return opponentMatches
  }

  fillOpponent(event){
    // var temp = this.state.sports[this.state.sportPos]
    // var opponentRating = 0
    // // var athleteRating = this.state.sports[this.state.athleteRatingPos]
    // this.state.users.forEach((opponent) => {
    //   if (opponent.id === event.target.attributes[0].value) {
    //     opponent.sports.forEach((sport) => {
    //       if (sport.id === this.state.sportID) {
    //         opponentRating = sport.rating
    //       }
    //     });
    //
    //   }
    // });

    let opponents = [...this.state.opponents]
    opponents.push({name: event.target.attributes[1].value, username: event.target.attributes[2].value, id: parseInt(event.target.attributes[0].value), sports: this.state.opponentMatches[parseInt(event.target.attributes[3].value)].sports})


    this.setState({
      opponent: "",
      opponents,
      opponentMatches: []
    });
  }

  fillTeammate(event){
    // let teammateRating = 0
    // this.state.users.forEach((teammate) => {
    //
    //   if (teammate.id === parseInt(event.target.attributes[0].value)) {
    //     teammate.sports.forEach((sport) => {
    //       if (sport.id === this.state.sportID) {
    //         teammateRating = sport.rating
    //       }
    //     });
    //
    //   }
    // });
    let teammates = [...this.state.teammates]
    teammates.push({name: event.target.attributes[1].value, username: event.target.attributes[2].value, id: parseInt(event.target.attributes[0].value), sports: this.state.teammateMatches[parseInt(event.target.attributes[3].value)].sports})

    this.setState({
      teammate: "",
      teammates,
      teammateMatches: []
    });
  }

//   handleSelectWinner(event){
//   this.setState({
//     [event.target.name]: event.target.value
//   })
// }

ratingChange(player){
  let { sportMatches, opponentMatches, initial, winner, sports, sportID } = this.state
  let currentUserRating = -5
  let opponentRating = -5
  let opponentID
  if(opponentMatches.length > 0){
    opponentID = opponentMatches[0].id
  } else {
    opponentID = this.state.opponentID
  }
  if(sportMatches.length > 0){
    currentUserRating = (sportMatches[0].rating === 0) ? initial : sportMatches[0]
  } else {
    sports.forEach((sport) => {
      if (sport.id === sportID){
        sport.participants.forEach((participant) => {
          if(participant.id === this.state.user.id){
            currentUserRating = participant.rating
          } else if (participant.id === opponentID) {
            opponentRating = participant.rating
          }
        });
        if(currentUserRating === -5){
          currentUserRating = initial
        }

      }
    });

  }
  if(opponentRating === -5){
    opponentRating = currentUserRating
  }
  // let opponentID = (opponentMatches[0] ? opponentMatches[0].id : this.state.opponentID)
  // let opponentRating = currentUserRating
  // sportMatches[0].participants.forEach((participant) => {
  //   if(participant["id"] === opponentID){
  //     opponentRating = participant["rating"]
  //   }
  // });
  // console.log(`currentuserrating: ${currentUserRating}`)
  // console.log(`opponentRating: ${opponentRating}`)
    var amountChanged = (Math.abs(currentUserRating-opponentRating) / 2) + 1
    if (currentUserRating > opponentRating){
      var higherRated = '1'
    } else {
       higherRated = '2'
    }

    if (higherRated === winner){
      amountChanged = .05 / amountChanged
    } else {
      amountChanged = .05 * amountChanged
    }

    var opponents = []
    var currentOpponent = 0

    if (player === 1) {
      opponents.push(opponentID)
      // console.log(this.state.user.events)
      this.state.user.events.forEach((event) => {
        if (event.sport === this.state.sportID){
          if(event.p2ID === this.state.user.id){
            // console.log("I'm player 2")
            currentOpponent = event.p1ID
          } else {
            // console.log("p2 ID")
            // console.log(event.p2ID)
            currentOpponent = event.p2ID
          }
          var duplicateOpponent = false
          if(opponents.length < 5){
            opponents.forEach((opponent) => {
            if (opponent === currentOpponent) {
              duplicateOpponent = true
            }
          });
          if(!duplicateOpponent){
            opponents.push(currentOpponent)
          }
        }

        }
      });

      if(opponents.length < 5){
        amountChanged = amountChanged * (6-opponents.length)
      }

      if (winner === '1') {
        if (parseFloat(currentUserRating) + parseFloat(amountChanged) > 10 && opponents.length < 5){
          return 10
        } else {
          if(parseFloat(currentUserRating) >= 10){
            amountChanged = amountChanged / 2
          } else if (parseFloat(currentUserRating) + parseFloat(amountChanged) > 10) {
            return ((parseFloat(currentUserRating) + parseFloat(amountChanged) - 10) / 2 + 10)
          }
          return parseFloat(currentUserRating) + parseFloat(amountChanged)
        }
      } else {
        if (currentUserRating - amountChanged < 1){
          return 1
        } else if (currentUserRating > 10) {
          if(currentUserRating - (amountChanged / 2) > 10) {
            return currentUserRating - (amountChanged / 2)
          } else {
            var belowTen = 10 - (currentUserRating - (amountChanged / 2))
            return 10 - belowTen * 2
          }
        } else {
          return currentUserRating - amountChanged
        }
      }
    }
    let opponent
    if (player === 2) {
      opponents.push(this.state.user.id)
      this.state.users.forEach((user) => {
        if(user.id === opponentID){
          opponent = user
        }
      });

      opponent.events.forEach((event) => {
        if(event.sport === this.state.sportID){
          if (event.p2ID === this.state.opponentID) {
            currentOpponent = event.p1ID
          } else {
            currentOpponent = event.p2ID
          }
          var duplicateOpponent = false
          if(opponents.length < 5){
            opponents.forEach((opponent) => {
              if(opponent === currentOpponent){
                duplicateOpponent = true
              }
            });
            if(!duplicateOpponent){
              opponents.push(currentOpponent)
            }

          }


        }
      });
      if(opponents.length < 5){
        amountChanged = amountChanged * (6-opponents.length)
      }


      if (winner === '2') {
        if(parseFloat(opponentRating) + amountChanged > 10){
          return 10
        } else{
          if(parseFloat(opponentRating) >= 10){
            amountChanged = amountChanged / 2
          } else if (parseFloat(opponentRating) + parseFloat(amountChanged) > 10) {
            return ((parseFloat(opponentRating) + parseFloat(amountChanged) - 10) / 2 + 10)
          }
        return parseFloat(opponentRating) + amountChanged
        }
      } else {
        if( opponentRating - amountChanged < 1){
          return 1
        }  else if (opponentRating > 10) {
          if(opponentRating - (amountChanged / 2) > 10) {
            return opponentRating - (amountChanged / 2)
          } else {
            belowTen = 10 - (opponentRating - (amountChanged / 2))
            return 10 - belowTen * 2
          }
        }
        else {
          return opponentRating - amountChanged
        }
      }
    }
  }

  addEventsToEventsDatabase(event){
    const { winner, opponents, teammates } = this.state;
    let url = config.url.BASE_URL + 'events'
    fetch(
      url,
      {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sport: parseFloat(event.sport),
          p1ID: this.state.user.id,
          p1InitialRating: event.p1InitialRating,
          p2ID: event.p2ID,
          p2InitialRating: event.p2InitialRating,
          winner: winner,
          opponents,
          teammates
        })
      }
    )
    // const addToEventDB = axios.post
    // (
    //   url,
    //   {
    //     sport: parseFloat(event.sport),
    //     p1ID: this.state.user.id,
    //     p1InitialRating: event.p1InitialRating,
    //     p2ID: event.p2ID,
    //     p2InitialRating: event.p2InitialRating,
    //     winner: winner,
    //     opponents,
    //     teammates
    //   }, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true}
    // )
    // return addToEventDB;
  }

  updateCurrentUser(event, team){
    const { winner, opponents, teammates } = this.state;
    let userID = this.state.user.id
    // if(team === 1){
    //   userID = this.state.user.id
    // } else {
    //   userID = event.p2ID
    // }
    let url = config.url.BASE_URL + 'users/' + userID

    // let updatedSport = {
    //   sport: event.sport,
    //   // name: event.sportName,
    //   rating
    // }

    let newEvent = {
      newEvent: {
        sport: event.sport,
        // sportName: event.sportName,
        // p1ID: this.state.user.id,
        // p1Name: event.p1Name,
        // p1Username: event.p1Username,
        p1InitialRating: parseFloat(event.p1InitialRating),
        // p2ID: event.p2ID,
        // p2Name: event.p2Name,
        // p2Username: event.p2Username,
        winner,
        opponents,
        teammates
      }
    }
    // let user = {
    //   username: this.state.user.username
    // }


    // fetch(
    //   url,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       sport: parseFloat(event.sport),
    //       p1ID: this.state.user.id,
    //       p1InitialRating: event.p1InitialRating,
    //       p2ID: event.p2ID,
    //       p2InitialRating: event.p2InitialRating,
    //       winner: winner,
    //       opponents,
    //       teammates
    //     })
    //   }
    // )
    fetch(
      url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify
        // ({
          (newEvent),
        //   user
        // })
      }
    )
    .then(response => {
      console.log(response)
      if(response.status === 200){
        this.props.history.push('/profile', {detail: event.sport, winner: winner})
      }
    })

  }

  handleSubmit(event) {
    event.preventDefault();
    const { opponentMatches, winner, sportMatches, opponentID, sportID, sports, opponentName, opponentUsername, opponents, teammates, winnerChanged } = this.state
    let oppName = opponentName
    let oppUsername = opponentUsername
    if((opponentMatches.length > 0 || opponentID !== 0 || opponents.length > 0) && (sportMatches.length > 0 || sportID !== 0)){
      let actualSportID, p1InitialRating, p2ID, p2InitialRating, sportName
      if(opponentMatches.length > 0){
        p2ID = opponentMatches[0].id
        oppName = opponentMatches[0].name
        oppUsername = opponentMatches[0].username
      } else {
        let p2IDs = []
        opponents.forEach((opponent) => {
          p2IDs.push(opponent.id)
        });

        // p2ID = opponentID
      }
      if(sportMatches.length > 0){
        actualSportID = sportMatches[0].id
        sportName = sportMatches[0].name
        let ratingSet = false
        let opponentRatingSet = false
        sportMatches[0].participants.forEach((participant) => {
          if(this.state.user.id === participant.id) {
            p1InitialRating = participant.rating
            ratingSet = true
          } else if (p2ID === participant.id) {
            p2InitialRating = participant.rating
            opponentRatingSet = true
          }
        });
        if (!ratingSet) {
          p1InitialRating = this.state.initial
        }
        if (!opponentRatingSet) {
          p2InitialRating = p1InitialRating
        }

      } else {
        actualSportID = sportID
        sports.forEach((game) => {
          if(game.id === sportID) {
            let ratingSet = false
            let opponentRatingSet = false
            game.participants.forEach((participant) => {
              if(participant.id === this.state.user.id) {
                p1InitialRating = participant.rating
                ratingSet = true
              } else if (participant.id === p2ID) {
                p2InitialRating = participant.rating
                opponentRatingSet = true
              }
            });
            if (!ratingSet) {
              p1InitialRating = this.state.initial
            }
            if (!opponentRatingSet) {
              p2InitialRating = p1InitialRating
            }

          }
        });

      }
      if(p1InitialRating === undefined){
        this.setState({error: "You need to set an initial skill level."})
      } else if (!winnerChanged) {
        this.setState({error: "You need to select a winner."})
      }else {
        // let event =
        // {
        //   sport: actualSportID,
        //   p1ID: this.state.user.id,
        //   p1Name: this.state.user.firstname + ' ' + this.state.user.lastname,
        //   p1Username: this.state.user.username,
        //   p1InitialRating,
        //   p2ID,
        //   p2Name: oppName,
        //   p2Username: oppUsername,
        //   p2InitialRating,
        //   sportName,
        //   opponents,
        //   teammates
        // }
        let event =
        {
          sport: actualSportID,
          p1InitialRating,
          opponents,
          teammates,
          winner
        }
        // console.log(event)
        // console.log("p1:")
        // console.log(this.state.user)
        // console.log("sport id: ", actualSportID)
        // console.log("p1ID: ", this.state.user.id)
        // console.log("p1 Name: ", this.state.user.firstname, ' ', this.state.user.lastname,)
        // console.log("p1Username: ", this.state.user.username)
        // console.log("p1 rating: ", p1InitialRating)
        // // console.log("p2ID: ", p2ID)
        // // console.log("p2name: ", oppName)
        // // console.log("p2user: ", oppUsername)
        // // console.log("p2 initial: ", p2InitialRating)
        // console.log("sportname: ", sportName)
        // console.log("opponents", opponents)
        // this.addEventsToEventsDatabase(event)
        this.updateCurrentUser(event, 1)
      }
    } else {
      this.setState({ error: "You need to select a valid opponent and a valid sport."})
    }
  }

  teammateList(sport, teammateOrOpponent, homeTeamRating){
    let team = []
    let teammates = []
    let teamText = ""
    let teamRating = 0
    if(teammateOrOpponent === 'teammate'){
      teammates = [...this.state.teammates]
      teamText = "My "
    } else{
      teammates = [...this.state.opponents]
      teamText = "Opposing "
    }
    if(this.state.sportMatches.length > 0 || this.state.sportID !== 0){
      let ratedMembers = 0
      let unratedTeammates = []
      teammates.forEach((teammate, i) => {
        let rating = 0
        teammate.sports.forEach((sportPlayed) => {
          if(parseInt(sportPlayed.id) === parseInt(sport) && sportPlayed.rating){
            rating = sportPlayed.rating
          }
        });
        if(rating !== 0){
          teamRating += rating
          ratedMembers += 1
          team.push(<ListGroup.Item action style={{listStyle: 'none', color: '#0046C4'}} key={`${teammateOrOpponent}#${i}`}><button onClick={() => this.removePlayer(i, teammateOrOpponent)}>X</button>{teammate.name}: {rating.toFixed(2)}</ListGroup.Item>)
        } else {
          unratedTeammates.push(i)
          team.push(<ListGroup.Item action style={{listStyle: 'none', color: '#0046C4'}} key={`${teammateOrOpponent}#${i}`}><button onClick={() => this.removePlayer(i, teammateOrOpponent)}>X</button>{teammate.name}</ListGroup.Item>)
        }
      });
      if(teammateOrOpponent === 'teammate'){
        let rating = 0
        let a = team.length
        if (this.state.sportMatches[0] && this.state.sportMatches[0].rating && this.state.sportMatches[0].rating > 0){
          teamRating += this.state.sportMatches[0].rating
          ratedMembers += 1
          rating = this.state.sportMatches[0].rating
          team.push(<ListGroup.Item action style={{listStyle: 'none', color: '#0046C4'}} key='player'><b>{this.state.user.firstname + ' ' + this.state.user.lastname}: {rating.toFixed(2)}</b></ListGroup.Item>)
        }
        if(rating === 0) {
          unratedTeammates.push(unratedTeammates.length)
          team.push(<ListGroup.Item action style={{listStyle: 'none', color: '#0046C4'}} key='player'><b>{this.state.user.firstname + ' ' + this.state.user.lastname}</b></ListGroup.Item>)
        }
      }
      if(ratedMembers > 0){
        teamRating = teamRating / ratedMembers
        unratedTeammates.forEach((position) => {
          team[position] = <ListGroup.Item action style={{listStyle: 'none'}} key={`${teammateOrOpponent}#${position}`}><button onClick={() => this.removePlayer(position, teammateOrOpponent)}>X</button>{team[position]}: {teamRating.toFixed(2)}*</ListGroup.Item>
        });

      } else {
        teamRating = homeTeamRating
      }
      team = [<div style={{float: 'left', paddingLeft: '10%'}}><h3>{teamText}Team: Average rating: {teamRating.toFixed(2)}</h3>{team}</div>, teamRating]
    } else{
      teammates.forEach((teammate, i) => {
        team.push(<ListGroup.Item action style={{listStyle: 'none'}} key={`${teammateOrOpponent}-${i}`}><button style={{color: "#0046C4", marginRight: "1vh", border: "1px solid #0046C4"}} onClick={() => this.removePlayer(i, teammateOrOpponent)}>X</button>{teammate.name}</ListGroup.Item>)
      });
      if(teammateOrOpponent === 'teammate'){
        team.push(<ListGroup.Item action style={{listStyle: 'none', color: "#0046C4"}} key={'player'}><b>{this.state.user.firstname} {this.state.user.lastname}</b></ListGroup.Item>)
      }
      team = [<div style={{float: 'left', paddingLeft: '10%', color: "#0046C4"}}><h3>{teamText}Team:</h3>{team}</div>, teamRating]
    }
    return team
  }

  render() {
    let sportList = []
    let opponentList = []
    let setInitialRating = ""
    let teammateMatchList = []
    // let sportMatches = this.findSports()
    // let opponentMatches = this.findOpponent()
    let initialRating = false
    this.state.sportMatches.forEach((sport) => {
      if(sport.rating !== 0){
        initialRating = true
      }
      sportList.push(
        <ListGroup.Item
        action
        className="sportsListItem"
        data-sportid={sport.id}
        style={{listStyle: 'none'}}
        key={`sport${sport.id}`}
        sport={sport.name}
        arrayposition={sport.listPos}>{sport.name} {initialRating ? ` - ${sport.rating.toFixed(2)}` : ''}
        </ListGroup.Item>)

    });

    if(this.state.sportMatches.length >= 1 && this.state.sportMatches[0].rating === 0){
      // console.log("start")
      // console.log(this.state.sportMatches[0])
      // console.log("end")
      // console.log(this.state.sportMatches[0].participants)
      setInitialRating =
      <Form.Group controlID="formInitialRating">
      <Form.Label>Rate Your {this.state.sportMatches[0].name} Skill Between 1 and 10:</Form.Label>
        <Form.Control
          type="number"
          name="initial"
          step='.1'
          min='1.0'
          max="10.0"
          size="lg"
          placeholder="   Set Skill Level 1-10"
          value={this.state.initial}
          onChange={this.handleChange}

          required
        />
      </Form.Group>
        // <h3>Rate Your {this.state.sportMatches[0].name} Skill Between 1 and 10:</h3>
        // <input
        // type="number"
        // name="initial"
        // style={{float: "center", borderColor: "1px solid #979797", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
        // value={this.state.initial}
        // onChange={this.handleChange}
        // placeholder="   Set Skill Level 1-10"
        // step='.1'
        // min='1.0'
        // max="10.00000000000000"
        // required
        // />
    }
    if(this.state.opponentMatches){
    this.state.opponentMatches.forEach((user, i) => {
      opponentList.push(<ListGroup.Item action data-opponentid={user.id} style={{listStyle: 'none'}} key={user.id} opponent={user.name} username={user.username} position={i}>{user.name} {user.rating === 0 ? '' : `- ${user.rating.toFixed(2)}`}</ListGroup.Item>)
    });
  }

    this.state.teammateMatches.forEach((match, i) => {
      teammateMatchList.push(<ListGroup.Item action data-teammateid={match.id} style={{listStyle: 'none'}} key={`teammateid-${match.id}`} opponent={match.name} username={match.username} position={i}>{match.name} {match.rating === 0 ? '' : `- ${match.rating.toFixed(2)}`}</ListGroup.Item>)
    });
    teammateMatchList = <ListGroup className="teammateSearchList" key={`teammateSlot${1}`} onClick={this.fillTeammate} > {teammateMatchList} </ListGroup>
    let sport = 0
    if(this.state.sportMatches.length > 0){
      sport = this.state.sportMatches[0].id
    } else {
      sport = this.state.sportID
    }
    let team = []
    let opponents = []
    let homeTeamRating = 0
    if(this.state.teammates.length > 0){
      team = this.teammateList(sport, 'teammate', 0)
      homeTeamRating = team.pop()
      team = team[0]
    }
    if(this.state.opponents.length > 0){
      opponents = this.teammateList(sport, 'opponent', homeTeamRating)
      opponents = opponents[0]
    }

// NON-BOOTSTRAP FORM STYLING
// <input
//   style={{float: "center", border: "1px solid #979797", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
//   type="name"
//   name="sport"
//   placeholder="   Sport Name"
//   value={this.state.sport}
//   onChange = {this.handleChange}
//   minLength= '3'
//   required
// />

// <h3>Teammates (optional)</h3>
//   <input
//     style={{float: "center",  border: "1px solid #979797", width: '60%', height: '3.5vh', fontSize: 'x-large'}}
//     type="text"
//     key="teammate"
//     name="teammate"
//     minLength = '3'
//     placeholder="   Teammate Name"
//     value={this.state.newTeammate}
//     onChange = {this.handleChange}
//   />

// <h3>Opponent(s)</h3>
// <input
//   type="text"
//   name="opponent"
//   minLength = '3'
//   style={{float: "center", width: '60%',  border: "1px solid #979797", height: '3.5vh', fontSize: 'x-large'}}
//   placeholder="   Opponent Name"
//   value={this.state.opponent}
//   onChange = {this.handleChange}
//
// />

    return(
    <div style={{backgroundColor: "#EEE", height: '110vh'}}>
    <br/>
    <br/>
    <br/>
    <div style={{position: 'absolute', width: '25%', paddingLeft: '5%'}}>
      <ListGroup>
        {team}
      </ListGroup>
    </div>
    <div style={{position: 'absolute', paddingLeft: '70%', width: '25%', paddingRight: '5%'}}>
    <ListGroup>
      {opponents}
    </ListGroup>
    </div>
    <u>
    <h2 style={{textAlign: 'center'}}> Report Results </h2>
    </u>
    <Card className="shadow" style={{marginLeft: '37.5%', marginRight: '37.5%', width: "25%"}}>
    <Form className="pt-4" style={{textAlign: 'center'}} onSubmit={this.handleSubmit}>

      <Row className="mx-3">
        <Col xs="12">
        <Form.Group controlID="formSportName">
          <Form.Control
            type="name"
            name="sport"
            placeholder="   Sport Name"
            value={this.state.sport}
            onChange={this.handleChange}
            minLength='3'
            required
            size="lg"
          />
        </Form.Group>
        </Col>
        </Row>
        <Row className="mx-3">
        <Col>
        <ListGroup className="sportSearchList mb-3" onClick={this.fillSportName}
        >{sportList}</ListGroup>
        </Col>
        </Row>
        <Row className="mx-3">
          <Col xs="12">
            {setInitialRating}
          </Col>
        </Row>
        <Row className="mx-3">
          <Col xs="12">
        <Form.Group controlID="formTeammateName">
        <Form.Label style={{fontSize: "125%"}}>Teammates (optional)</Form.Label>
          <Form.Control
            type="text"
            name="teammate"
            placeholder="   Teammate Name"
            value={this.state.teammate}
            onChange={this.handleChange}
            minLength='3'
            size="lg"
          />
        </Form.Group>
        </Col>
        </Row>
        <Row className="mx-3 mb-3">
          <Col xs="12">
            {teammateMatchList}
          </Col>
        </Row>
        <Row className="mx-3">
          <Col xs="12">
        <Form.Group>
          <Form.Label style={{fontSize: "125%"}}>Opponents</Form.Label>
          <Form.Control
            type="text"
            name="opponent"
            placeholder="   Opponent Name"
            value={this.state.opponent}
            onChange={this.handleChange}
            minLength='3'
            size="lg"
          />
        </Form.Group>
        </Col>
        </Row>

        <Row className="mx-3">
          <Col xs="12">
        <ListGroup className="opponentSearchList" onClick={this.fillOpponent}
        >{opponentList}</ListGroup>
          </Col>
        </Row>
        <br/>
    <div key='winner' className="mb-3 match-winner">
      <Form.Check
        type='radio'
        name="winner"
        id="I won"
        label='I won'
        value="1"
        onClick={this.handleChange}
        required
      />

      <Form.Check
        name="winner"
        type='radio'
        label='I lost'
        id="I lost"
        value="2"
        className="mr-1"
        onClick={this.handleChange}
        required

      />
    </div>

            {this.state.error}

            <br />

        <Button className="text-white btn-lg" variant="success" type="submit"><b>Submit</b></Button>

        <br/>
        <br/>
      </Form>
      </Card>

    </div>
  )}
}
