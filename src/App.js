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
    if (this.state.timezone.toLowerCase().includes("utc")) {
      timezone = this.state.timezone.toLowerCase().replace("utc", "");
    } else {
      timezone = this.state.timezone;
    }

    if (this.state.jumprange.toLowerCase().includes("ly")) {
      jumprange = this.state.jumprange.toLowerCase().replace("ly", "");
    } else {
      jumprange = this.state.jumprange;
    }

    if (this.state.homebase === "") {
      homebase = "No homebase";
    } else {
      homebase = this.state.homebase;
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
              "value": this.state.ircnick,
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
          console.log("err")
        })
    })
  }


  render() {
    return (
      <React.Fragment>
        <form className="modal-content" id='form'>
          <div className="container">

            <label htmlFor="ircnick"><b style={{ color: "white" }}>IRC Nick *</b></label>
            <input id="input1" type="text" placeholder="Enter Your IRC Nick" name="ircnick" onChange={this._handleChange} required />

            <label htmlFor="timezone"><b style={{ color: "white" }}>Timezone in <abbr title="This is the ingame Time">UTC</abbr> *</b></label>
            <br/>
            <input id="input2" type="number" placeholder="UTC" name="timezone" onChange={this._handleChange} required />
            <br/>
            <br/>
            <label htmlFor="availability"><b style={{ color: "white" }}>When are you usually available? (in <abbr title="This is the ingame Time">UTC</abbr>) *</b></label>
            <br/>
            <input id="input5" type="time" placeholder="Your availability" name="availability" onChange={this._handleChange} />
            <br/>
            <br/>
            <label htmlFor="jumprange"><b style={{ color: "white" }}>The jumprange of your ratship in lightyears (ly) *</b></label>
            <br/>
            <input id="input3" type="text" placeholder="Enter Jumprange" name="jumprange" onChange={this._handleChange} required />
            <br/>
            <br/>
            <label htmlFor="homebase"><b style={{ color: "white" }}>Your Homesystem</b></label>
            <input id="input4" type="text" placeholder="Enter Homebase" name="homebase" onChange={this._handleChange} />

            <button onClick={this.handleFormSubmit}>Submit</button>
            <p style={{ color: "white" }}><i>* is required</i></p>

          </div>
        </form>
        <h2 id='success_message' style={{ textAlign: 'center', display: "none", color: "white" }}>Thank you for using this system. Your Overseer will contact you regarding a drill.</h2>
        <h2 id='failure_message' style={{ textAlign: 'center', display: "none", color: "red" }}>Something went wrong. Please reload the page and make sure to enter all required information!</h2>
      </React.Fragment>
    )
  }

}

export default App;
