import React, { Component } from 'react';

import { config } from './utility/Constants'

export default class Rankings extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sports: [],
      user: {},
      sport: "",
      sportMatches: [],
      sportID: 10,
      unsetID: 0,
      official: '2'
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fillSportName = this.fillSportName.bind(this);
    this.findSports = this.findSports.bind(this);
  }

  componentDidMount() {
    let user = {}
    let url = config.url.BASE_URL + 'sports'
    let url2 = config.url.BASE_URL + 'logged_in'
    const requestSports = axios.get(url, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true});
    const getUser = axios.get(url2, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true})
    axios.all([requestSports, getUser])
    .then(axios.spread((...responses) => {
      const sports = responses[0].data.sports
      if (responses[1].data.logged_in) {
        user = responses[1].data.user
      }
        this.setState({
          sports,
          user
        });
      })
    );
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
    let sportID = this.state.sportID
    if(sportName.length >= 3){
      var list = this.state.sports;
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
            if(!duplicate && sport.id !== sportID){
              addedSport = true
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
              if(!duplicate && sport.id !== sportID){
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
    unsetID: parseInt(event.target.attributes[1].value),
    sportMatches,
  })
 }

 handleSubmit(event){
  event.preventDefault();
  this.state.sports.forEach((sport) => {
    if(sport.id === this.state.unsetID){
      this.setState({sportID: sport.id, unsetID: 0})
    } else if (this.state.unsetID === 0 && this.state.sportMatches.length > 0) {
      this.setState({sportID: this.state.sportMatches[0].id})
    }
  });

}

  quickSort(participants) {
      if (participants.length <= 1) {
         return participants;
         } else {
               var left = [];
               var right = [];
               var newArr = [];
               var pivot = participants[participants.length - 1];
               var length = participants.length - 1;
               for (var i = 0; i < length; i++) {
                  if (participants[i]["rating"] >= pivot["rating"]) {
                     left.push(participants[i]);
               } else {
                       right.push(participants[i]);
             }
           }
         return newArr.concat(this.quickSort(left), pivot, this.quickSort(right));
      }
   }

  render() {
    let participants = []
    let nextSport = ""
    let sportName = ""
    let unofficial = this.state.official === '1' ? "Unofficial " : ""
    let sportList = []
    if(this.state.sportMatches.length > 0){
      nextSport = this.state.sportMatches[0].name
    }
    this.state.sports.forEach((sport, i) => {
      if(sport.id === this.state.sportID){
        sportName = sport.name
        let sorted = this.quickSort(sport.participants)
        sorted.forEach((participant) => {
          let fontWeight = 'normal'
          if(participant.id === this.state.user.id){
            fontWeight = 'bold'
          }
          let officialOrNot = "*"
          if((sport.id !== 10 && participant.opponents.length >= 5) || (sport.id === 10 && participant.official)){
            officialOrNot = ""
          }
          if((this.state.official === '2' && ((sport.id !== 10 && participant.opponents.length >= 5) || (sport.id === 10 && participant.official))) || this.state.official === '1'){
            participants.push(<li style={{fontWeight: fontWeight}} key={participant.id} ><div style={{float: 'left'}}>{participant.name}</div><div style={{float: 'right'}}>{officialOrNot}{participant.rating.toFixed(2)}</div></li>)
          }
        });

      }
      if(sport.id === this.state.unsetID){
        let unsetIncluded = false
        this.state.sportMatches.forEach((match) => {
          // console.log(`matchid: ${match.id}, unsetID: ${this.state.unsetID}, same: ${match.id === this.state.unsetID}`)
          if(parseInt(match.id) === this.state.unsetID){
            unsetIncluded = true
          }
        });
        if(!unsetIncluded) {
          sportList.push(<div className="sportsListItem" id={sport.id} key={`sport${sport.id}`} name={sport.name}>{sport.name}</div>)
        }
        nextSport = sport.name
      }
    });
    if(nextSport === ""){
      nextSport = sportName

    }
    this.state.sportMatches.forEach((sport) => {
      sportList.push(<div className="sportsListItem" id={sport.id} key={`sport${sport.id}`} name={sport.name}>{sport.name}</div>)
    });


    return(
      <div>
      <form style={{float: 'left', paddingLeft: "5%"}}>
        <br/>
          <h3>Sport:</h3>
          <input
            type="name"
            name="sport"
            placeholder="Sport Name"
            value={this.state.sport}
            onChange = {this.handleChange}
            required
          />
          <ul className="sportSearchList" onClick={this.fillSportName}
          >{sportList}</ul>
          <br />
          <input type="radio" id="Not Included" defaultChecked="checked" name="official" onClick={this.handleChange} value= '2' /> <b>Official</b>
          <br />
          <input type="radio" id="Included" name="official" onClick={this.handleChange} value= '1' /> <b>Unofficial</b>
          <br /><br /><br/>
          <button type="submit" onClick={this.handleSubmit}>See {nextSport} Rankings</button>


          <br/>
          <br/>
        </form>
        <h1 style={{textAlign: 'center', paddingLeft: '30%', paddingRight: '30%'}}>{unofficial}{sportName} Rankings</h1>
        <ol style={{paddingLeft: '30%', paddingRight: '30%'}}> {participants} </ol>
      </div>
    )
  }
}
