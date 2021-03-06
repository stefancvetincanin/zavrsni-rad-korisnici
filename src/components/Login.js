import React from 'react'
import LoginInstructions from './LoginInstructions';

export default class Login extends React.Component {
  state = {
    username: '', 
    password: '',
    showInstructions: false
  }

  componentDidMount() {
    this.props.changeLinkActive(2)
  }

  handleChange = e => {
    const {name, value} = e.target
    this.setState({
      [name]: value
    })
  }

  handleReset = () => {
    this.setState({
      username: '',
      password: ''
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    
    // alert('form submitted!')
    if(this.state.username === 'admin' && this.state.password === 'password') {
      this.props.isSendingData(true)
      fetch('https://reqres.in/api/login', {
        method: "POST",
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'email': this.state.username,
          'password': this.state.password
        })
      })
        .then(response => response.json())
        .then(data => {
          const authToken = data.token
          this.props.logIn(authToken)
          this.handleReset()
          this.props.isSendingData(false)
        }).catch(error => {
          this.props.isSendingData(false)
          this.props.showServerError()
          console.error("CUSTOM ERROR: " + error)
        })
    } else {
      alert('Your username and/or password were incorrect')
    }    
  }

  showInstructions = status => {
    this.setState({
      showInstructions: status
    })
  }

  render() {
    return(
      <main className="container login-container">
        <form onSubmit={this.handleSubmit}
          style={{display: this.props.isLoggedIn && 'none'}}>
          <h2>
            Login&nbsp;&nbsp;&nbsp;
            <i className="fas fa-info-circle login-instructions-button" onClick={() => this.showInstructions(true)}></i>
          </h2>
          <input 
            type="text" 
            placeholder="Username" 
            name="username" 
            value={this.state.username}
            onChange={this.handleChange}
            required
          /> <br />
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={this.state.password}
            onChange={this.handleChange}
            required
          /> <br />
          <button>Log in</button>
          <input type="reset" onClick={this.handleReset} />
        </form>
        <div style={{display: !this.props.isLoggedIn && 'none'}}>
          <h3>You are logged in.</h3>
          <button onClick={() => {this.props.logOut()}}>
            Log out
          </button>
        </div>
        <LoginInstructions 
          showInstructions={this.state.showInstructions}
          hideInstructions={this.showInstructions}
        />
      </main>
    )
  }
}