import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import { Button, Form, Container, Table, InputGroup, OffCanvas, Row, Col, Card, ListGroup, Popover, OverlayTrigger, CloseButton, Tooltip } from 'react-bootstrap';
import styles from './Rankings.css'



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
      official: '1',
      error: "",
      searchResultsClass: "d-none",
      officialChecked: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fillSportName = this.fillSportName.bind(this);
    this.findSports = this.findSports.bind(this);
    this.showSearchResults = this.showSearchResults.bind(this);
    this.hideSearchResults = this.hideSearchResults.bind(this);
  }

  componentDidMount() {
    let jwt = window.localStorage.getItem('jwt');
    let user = {}
    if(jwt){
      let result = jwtDecode(jwt)
      if(result){
        user = result
      }
    }
    let url = config.url.BASE_URL + 'sports'
    // let url2 = config.url.BASE_URL + 'logged_in'
    // SAMPLE FETCH
      // fetch("url,
      // { method: 'POST', body: formData })
      // .then(res => res.json()).then(res => (console.log(res.jwt),
      // window.localStorage.setItem('jwt', res.jwt)))
      // .then(() => this.props.history.push('/'))
      // .catch(function(error){console.log('There is an error: ', error.message)})
    fetch(url)
    .then(response => response.json())
    .then(function(data){
      this.setState({sports: data.sports, user})
    }.bind(this)).catch(function(error) {
      console.log(error)
    })
    // const requestSports = axios.get(url, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true});
    // const getUser = axios.get(url2, {headers: {'Access-Control-Allow-Origin': '*'}}, {withCredentials: true})
    // axios.all([requestSports, getUser])
    // .then(axios.spread((...responses) => {
    //   const sports = responses[0].data.sports
    //   if (responses[1].data.logged_in) {
    //     user = responses[1].data.user
    //   }
    //     this.setState({
    //       sports,
    //       user
    //     });
    //   })
    // );
  }

  handleChange(event) {
    let sportMatches = [...this.state.sportMatches]
    let officialChecked = this.state.officialChecked
    if(event.target.name === 'sport'){
      sportMatches = this.findSports(event.target.value)
    }
    if(event.target.name === 'official'){
      if(event.target.value === "2"){
        officialChecked = true
      } else {
        officialChecked = false
      }
    }


    this.setState({
      [event.target.name]: event.target.value,
      sportMatches,
      officialChecked
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
    event.preventDefault()
  let sportMatches = [{
    name: event.target.attributes[1].value,
    id: event.target.attributes[0].value,
  }]
  this.setState({
    sport: event.target.attributes[1].value,
    unsetID: parseInt(event.target.attributes[0].value),
    sportMatches,
    searchResultsClass: "d-none"
  })
 }

 showSearchResults(){
   this.setState({searchResultsClass: "mb-3 sport-search-list"})
 }

 hideSearchResults(e){
     this.setState({searchResultsClass: "d-none"})
 }

 handleSubmit(event){
  event.preventDefault();
  if(this.state.sport !== ""){
    this.state.sports.forEach((sport) => {
      if(sport.id === this.state.unsetID){
        this.setState({sportID: sport.id, unsetID: 0, sport: "", error: ""})
      } else if (this.state.unsetID === 0 && this.state.sportMatches.length > 0) {
        this.setState({sportID: this.state.sportMatches[0].id, sport: "", sportMatches: [], error: ""})
      }
    });
  } else {
    this.setState({error: "Sport field can't be blank"})
  }
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
    let sportsListClassName = this.state.searchResultsClass
    let nextSport = ""
    let sportName = ""
    let unofficial = this.state.official === '1' ? "*" : ""
    let sportList = []
    if(this.state.sportMatches.length > 0){
      nextSport = this.state.sportMatches[0].name
    }
    let officialCount = 0
    this.state.sports.forEach((sport, i) => {
      if(sport.id === this.state.sportID){
        sportName = sport.name
        let sorted = this.quickSort(sport.participants)
        sorted.forEach((participant, i) => {
          let fontWeight = 'normal'
          let link = '/profile/' + participant.id.toString()
          if(participant.id === this.state.user.id){
            fontWeight = 'bold'
            link = '/profile'
          }
          let officialOrNot = "*"
          if((sport.id !== 10 && participant.opponents.length >= 5) || (sport.id === 10 && participant.official)){
            officialOrNot = ""
            officialCount = officialCount + 1
          }
          if((this.state.official === '2' && ((sport.id !== 10 && participant.opponents.length >= 5) || (sport.id === 10 && participant.official))) || this.state.official === '1'){
            let count = i+1
            if(this.state.official === '2'){
              count = officialCount
            }
            let best = ""
            if(officialCount === 1 && officialOrNot === ""){
              best = <span><br/>Best {sport.wordForPlayer} in the World</span>
              if(sport.id === 268){
                best = <span><br/>Strongest Man in the World</span>
              }
            }
            participants.push(
              <tr style={{fontWeight: fontWeight}} key={participant.id}>
                <td className="text-center">{count}</td>
                <td><a href={link}>{participant.name}</a>{best}</td>
                <td className="text-center">{participant.rating.toFixed(2)}{officialOrNot}</td>
              </tr>
            )
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
          sportList.push(<ListGroup.Item action className="text-center sports-list-item" id={sport.id} key={`sport${sport.id}`} name={sport.name}>{sport.name}</ListGroup.Item>)
        }
        nextSport = sport.name
      }
    });
    if(nextSport === ""){
      nextSport = sportName

    }
    this.state.sportMatches.forEach((sport) => {
      sportList.push(<ListGroup.Item action className="text-center sports-list-item" id={sport.id} key={`sport${sport.id}`} name={sport.name}>{sport.name}</ListGroup.Item>)
    });


    return(
      <div style={{paddingTop: "3%", paddingBottom: "1%", fontSize: "larger"}}>
      <Container className="d-block d-lg-none pb-3">
        <Row>
          <Col>
          .
          </Col>
        </Row>
      </Container>
      <Container fluid className="my-5">
        <Row className="d-block d-lg-none">
          <Card className="pb-3 mb-3 ">
          <Form className="">
            <Col xs="12">
              <InputGroup className="mb-3" controlId="sport">
                <Form.Control
                  name="sport"
                  type="text"
                  placeholder="   Sport Name"
                  value={this.state.sport}
                  onChange={this.handleChange}
                  onFocus={this.showSearchResults}
                  onBlur={()=> setTimeout(() => this.hideSearchResults(), 1500)}
                  required />
                  <Button type="submit" className="ml-3"  variant="success" onClick={this.handleSubmit}><b>View {nextSport}</b></Button>

              </InputGroup>
              <ListGroup className={sportsListClassName} onClick={this.fillSportName}
            >{sportList}</ListGroup>

              <div key='small-screen-official' className="text-center official-or-not">
                <Form.Check
                  inline
                  type='radio'
                  name="official"
                  id="Not Included"
                  label='Official'
                  value="2"
                  onClick={this.handleChange}
                  className="mb-2"
                />

                <Form.Check
                  inline
                  name="official"
                  type='radio'
                  label='Unofficial*'
                  id="Included"
                  value="1"
                  onClick={this.handleChange}
                  defaultChecked="checked"
                />
              </div>
            </Col>

          </Form>
          </Card>
        </Row>
        <Row>
        <Col className="d-none d-lg-block">
          <Form className="mx-3 mt-5" >
            <Form.Group className="mb-3" controlId="sport">
              <Form.Control
                size="lg"
                name="sport"
                type="text"
                placeholder="   Sport Name"
                value={this.state.sport}
                onChange={this.handleChange}
                required />

              </Form.Group>
            <ListGroup className="sportSearchList" onClick={this.fillSportName}
          >{sportList}</ListGroup>
          <br />
          <div key='official' style={{marginLeft: '30%', marginRight: '20%'}} className="mb-5 official-or-not">
            <Form.Check
              type='radio'
              name="official"
              id="Not Included"
              label='Official'
              value="2"
              onClick={this.handleChange}
              className="mb-2"
              checked={this.state.officialChecked}
            />

            <Form.Check
              name="official"
              type='radio'
              label='Unofficial*'
              id="Included"
              value="1"
              onClick={this.handleChange}
              checked={!  this.state.officialChecked}

            />
          </div>

          <Button type="submit" variant="success" size="lg" className="w-100" onClick={this.handleSubmit}><b>View {nextSport}</b></Button> <br/> <br/>
          <span style={{color: "red"}}><b>{this.state.error}</b></span>


          <br/>
          <br/>
        </Form>
        </Col>
        <Col xs="12" lg="9" >
        <h1 style={{textAlign: 'center'}}>{sportName} World Rankings{unofficial}</h1>
        <Table className="rankings-list" bordered striped hover>
          <thead>
            <tr>
              <th className="px-3" style={{width: '1px'}}>Rank</th>
              <th>Name</th>
              <th className="px-3" style={{width: '1px'}}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {participants}
          </tbody>
        </Table>
        </Col>
        </Row>
        </Container>
      </div>
    )
  }
}
