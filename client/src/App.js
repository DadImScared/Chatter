import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withStyles } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import io from 'socket.io-client';





class App extends Component {
  render() {
    const socket = io({query: { token: 'taco' }, host: 'http://127.0.0.1:4000/'});
    socket.on('connect', function(data) {
      console.log('connected');
    });
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar position="fixed">
            <Toolbar>
              <Button raised>Click here</Button>
              <Button>Other button</Button>
            </Toolbar>
          </AppBar>
          <header className="App-header">
            <Button raised label="Default" color="primary">Text here</Button>
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
