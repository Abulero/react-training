import React from "react";

class RegisterProcess extends React.Component {
  constructor() {
    super({});

    this.state = false;
  }

  SetReadyToShow() {
    this.setState(true);
  }

  render() {
    return (
      <>
        {this.state ? (
          <>
            <label htmlFor="fullName">What's your full name?</label>
            <input type="text" id="fullName" name="fullName"></input>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default RegisterProcess;
