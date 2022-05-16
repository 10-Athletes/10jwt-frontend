import React, { Component } from 'react';
import Ticker from 'react-ticker';
import { Navbar, Nav, Card, NavDropdown, Container, Row, Col, Form, Button, Modal, ListGroup, CloseButton} from 'react-bootstrap';
import styles from './Header.css'

import { config } from './utility/Constants'

class TickerFooter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: ""
    }

  }

  componentDidMount(){
    this.update()
  }

  quickSort(events, sports) {
      if (events.length <= 1) {
         return events;
         } else {
               var left = [];
               var right = [];
               var newArr = [];
               var pivot = events[events.length - 1];
               var length = events.length - 1;
               for (var i = 0; i < length; i++) {
                  if (events[i].sport <= pivot.sport) {
                     left.push(events[i]);
               } else {
                       right.push(events[i]);
             }
           }
         return newArr.concat(this.quickSort(left), pivot, this.quickSort(right));
      }
   }

   update(){
     let url = config.url.BASE_URL + 'events'
     let url2 = config.url.BASE_URL + 'usersloggedout'
     let url3 = config.url.BASE_URL + 'sports'
     Promise.all([fetch(url), fetch(url2), fetch(url3)])
     .then(function(responses) {
       return Promise.all(responses.map(function(response) {
         return response.json();
       }));
     })
     .then(function(data){
       let users = data[1].users
       let sports = data[2].sports
       let events = this.quickSort(data[0].events, sports)
       let eventsTickerData = []
       let sportsTicker = []
       events.forEach((event) => {
         if(event.team2.length > 0){
           let date = new Date(event.created_at)
           let formatDate = String(date).split(' ')
           date = formatDate[0] + ", " + formatDate[1] + " " + formatDate[2]
           let team1 = ""
           let team2 = ""
           let team1Members = [""]
           let team2Members = [""]
           users.forEach((user) => {
             event.team1.forEach((teammate, i) => {
               if(teammate.id === user.id){
                 let plusOrMinus = ""
                 if(teammate.ratingChange > 0){
                   plusOrMinus = "+"
                 }
                 if(i === 0){
                   team1Members[0] = user.firstname + " " + user.lastname + " " + parseFloat(teammate.initialRating + teammate.ratingChange).toFixed(2) + "(" + plusOrMinus + parseFloat(teammate.ratingChange).toFixed(2) + ")"
                 } else{
                 team1Members.push(user.firstname + " " + user.lastname  + " " + parseFloat(teammate.initialRating + teammate.ratingChange).toFixed(2) + "(" + plusOrMinus + parseFloat(teammate.ratingChange).toFixed(2) + ")")
                 }
               }
             });
             event.team2.forEach((opponent, i) => {
               if(opponent.id === user.id){
                 let plusOrMinus = ""
                 if(opponent.ratingChange > 0){
                   plusOrMinus = "+"
                 }
                 if(i === 0){
                   team2Members[0] = user.firstname + " " + user.lastname + " " + parseFloat(opponent.initialRating + opponent.ratingChange).toFixed(2) + "(" + plusOrMinus + parseFloat(opponent.ratingChange).toFixed(2) + ")"
                 } else{
                 team2Members.push(user.firstname + " " + user.lastname + " " + parseFloat(opponent.initialRating + opponent.ratingChange).toFixed(2) + "(" + plusOrMinus + parseFloat(opponent.ratingChange).toFixed(2) + ")")
                 }
               }
             });
             if(team1Members.length + team2Members.length === event.team1.length + event.team2.length){
               return
             }
           });


            if(team1Members.length >= 2){
              team1 = team1Members[0] + "'s team"
            } else{
              team1 = team1Members[0]
            }
            if(team2Members.length >= 2){
              team2 = team2Members[0] + "'s team"
            }  else{
              team2 = team2Members[0]
            }
            let eventText = ""
            if(event.winner === 1){
              eventText = team1 + " beat " + team2
            } else {
              eventText = team2 + " beat " + team1
            }
            sports.forEach((sport) => {
              if(sport.id === event.sport){
               sportsTicker.push(sport.name + " - " + date)
               return
              }
            });


            eventsTickerData.push(eventText)}
       });

       this.setState({
         events:     <Ticker speed="7" className="px-3 d-none d-md-block" style={{backgroundColor: "black"}}>
             {({ index }) => (
               <>
                 <h4 className="px-5 my-0 d-none d-md-block" style={{marginRight: "-4px", backgroundColor: "black", color: "white"}}>{sportsTicker[index% sportsTicker.length]}</h4>
                 <h4 className="px-5 my-0 d-none d-md-block" style={{marginRight: "-4px", backgroundColor: "#004095", color: "white" }}>
                   {eventsTickerData[index % eventsTickerData.length]}
                 </h4>
                 <h5 className="px-5 my-0 d-block d-md-none" style={{marginRight: "-4px", backgroundColor: "black", color: "white"}}>{sportsTicker[index% sportsTicker.length]}</h5>
                 <h5 className="px-5 my-0 d-block d-md-none" style={{marginRight: "-4px", backgroundColor: "#004095", color: "white" }}>
                   {eventsTickerData[index % eventsTickerData.length]}
                 </h5>
               </>
             )}
           </Ticker>
         })}.bind(this))
   }

  render(){
    return(
      <div className="fixed-bottom text-center">
      {this.state.events}
      </div>




    )
  }

}

export default TickerFooter;
