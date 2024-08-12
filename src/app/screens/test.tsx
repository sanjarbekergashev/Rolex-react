// @ts-nocheck
import React, { Component } from "react";

class Test extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         brand: "Ford",
         model: "Mustang",
         color: "red",
         year: 1964,
      };
   }
   changeDetail = () => {
      this.setState({
         brand: "Tesla",
         model: "Model S",
         color: "White",
         year: 2024,
      });
   };
   //    componentDidMount() {
   //       console.log("componentDidMount");
   //       //runs after first render ==> RETRIVE DATA FROM BACKEND SERVER
   //    }
   //    componentWillUnmount() {
   //       console.log("componentWillUnmount");
   //       //runs before component unmount
   //    }
   //    componentDidUpdate() {
   //       console.log("componentDidUpdate");
   //    }
   render() {
      return (
         <div>
            <h1>My {this.state.brand}</h1>
            <p>
               It is a {this.state.color}, Model: {this.state.model}
               from {this.state.year}.
            </p>
            <button type="button" onClick={this.changeDetail}>
               Change deatil
            </button>
         </div>
      );
   }
}

export default Test;
