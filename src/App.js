import './App.css';
import React, { Component } from "react";
const { hooks } = require('./webhooks.json');

class App extends Component {

  state = {
    ircnick: "",
    timezone: "",
    jumprange: "",
    homebase: "",
    availability: ""
  }

  _handleChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value
      }
    )
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    if (this.state.ircnick === "" || this.state.timezone === "" || this.state.jumprange === "" || this.state.availability === "") {
      const input1 = document.getElementById("input1");
      const input2 = document.getElementById('input2');
      const input3 = document.getElementById('input3');
      const input5 = document.getElementById('input5');
      input1.classList.add('border_red');
      input2.classList.add('border_red');
      input5.classList.add('border_red');
      return input3.classList.add('border_red');
    }
    var timezone;
    var jumprange;
    var homebase;
    var request;
    var re = /[.*+?^${}():"|[\]\\]/g;

    if (this.state.timezone.toLowerCase().includes("-")) {
      timezone = this.state.timezone
    } else {
      timezone = `+${this.state.timezone}`;
    }

    if (timezone > 12 || timezone < -12) {
      const input2 = document.getElementById('input2');
      return input2.classList.add('border_red');
    }

    var nick = this.state.ircnick.replace(re, "");

    if (this.state.jumprange.toLowerCase().includes("ly")) {
      jumprange = this.state.jumprange.toLowerCase().replace("ly", "");
    } else {
      jumprange = this.state.jumprange;
    }

    if (this.state.homebase === "") {
      homebase = "No homebase";
    } else {
      homebase = this.state.homebase.replace(re, "");
    }

    if (this.state.request) {
      request = "YES";
    } else {
      request = "NO";
    }

    var params = {
      username: "Drill Request",
      avatar_url: "https://media.istockphoto.com/vectors/cartoon-power-drill-tool-vector-id513532371",
      embeds: [
        {          
          "title": "New drill request",
          "color": 15258703,
          "thumbnail": {
            "url": "https://announcer-dev.fuelrats.com/pyramid-static/drillrat.jpg",
          },
          "fields": [
            {
              "name": "IRC nick",
              "value": nick.replace(/\s/g, "_"),
              "inline": true
            },
            {
              "name": "Timezone",
              "value": `UTC ${timezone}`,
              "inline": true
            },
            {
              "name": "Usually available",
              "value": `${this.state.availability} UTC`
            },
            {
              "name": "Jumprange of ratship",
              "value": `${jumprange}ly`,
            },
            {
              "name": "Homebase",
              "value": homebase
            },
            {
              "name": "Drillrequest submitted",
              "value": request
            }
          ]
        }
      ]
    }
    
    hooks.forEach(element => {
      fetch(element, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
      }).then(res => {
        if (res.status === 204) {
          const form = document.getElementById("form");
          const message = document.getElementById('success_message');
          const img = document.getElementById('img');
          img.style.display = 'block';
          form.style.display = 'none';
          message.style.display = 'block';
        } else {
          const form = document.getElementById("form");
          const message = document.getElementById('failure_message');
          form.style.display = 'none';
          message.style.display = 'block';
        }
      })
        .catch(err => {
          console.log(err)
        })
    })
  }


  render() {
    return (
      <React.Fragment>
        <form className="modal-content" id='form'>
          <div className="container">
            <h2 style={{ color: "white" }}>Overseer Poking Stick</h2>

            <label htmlFor="ircnick"><b style={{ color: "white" }}>IRC Nick *</b></label>
            <input id="input1" type="text" placeholder="IRC Nick" maxLength="30" name="ircnick" onChange={this._handleChange} required />

            <label htmlFor="timezone"><b className="tooltip" style={{ color: "white" }}>Timezone in UTC *<span className="tooltiptext">UTC is ingame time</span></b></label>
            <br/>
            <input id="input2" type="number" placeholder="UTC" maxLength="3" min="-12" max="12" name="timezone" onChange={this._handleChange} required />
            <br/>
            <br/>
            <label htmlFor="availability"><b className="tooltip" style={{ color: "white" }}>When are you usually available? (in UTC) *<span className="tooltiptext">This is military time. Example: 1pm is 13:00</span></b></label>
            <br/>
            <input id="input5" type="time" placeholder="Your availability" name="availability" onChange={this._handleChange} />
            <br/>
            <br/>
            <label htmlFor="jumprange"><b className="tooltip" style={{ color: "white" }}>The jumprange of your ratship in lightyears (LY) *<span className="tooltiptext">Should be at least 20ly</span></b></label>
            <br/>
            <input id="input3" type="text" placeholder="LY" maxLength="2" name="jumprange" onChange={this._handleChange} required />
            <br/>
            <br/>
            <label htmlFor="homebase"><b className="tooltip" style={{ color: "white" }}>Your Homesystem<span className="tooltiptext">If you have one</span></b></label>
            <input id="input4" type="text" placeholder="Homesystem" maxLength="30" name="homebase" onChange={this._handleChange} />
            <label htmlFor="request"><b className="tooltip" style={{ color: "white" }}>Drillrequest submitted<span className="tooltiptext">You submitted a drillrequest on JIRA</span></b></label>
            <input type="checkbox" name="request" className="input05" onChange={this._handleChange}/>

            <button onClick={this.handleFormSubmit}>Submit</button>
            <p style={{ color: "white" }}><i>* is required</i></p>
            <p style={{ color: "white" }}><i>Disclaimer: Filing this does not mean you won't actively have to look for an Overseer! It's just meant to increase your chances of an Overseer finding you!</i></p>

          </div>
        </form>
        <h2 id='success_message' style={{ textAlign: 'center', display: "none", color: "white" }}>Thank you for using this system. Your request has been filed.</h2>
        <h2 id='failure_message' style={{ textAlign: 'center', display: "none", color: "red" }}>Something went wrong. Please reload the page and make sure to enter all required information!</h2>
        <div id="img" className="imgcontainer" style={{ textAlign: 'center', display: "none", color: "white" }}>
          <img src="https://announcer-dev.fuelrats.com/pyramid-static/drillrat.jpg" className="avatar" alt='' />
        </div>
      </React.Fragment>
    )
  }

}

export default App;
