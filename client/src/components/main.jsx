
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { Switch, Route } from 'react-router-dom'
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Home from './home';
import Login from './login';
import Register from './register';
import Rooms from "./rooms";


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  mainArea: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing.unit * 2
  },
  paperBackground: {
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 64px)',

    },
    [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
      minHeight: 'calc(100vh + 80px)',
    },
    // [`${theme.breakpoints.up('xs')}`]: {
    //   minHeight: '100vh'
    // },
    minHeight: 'calc(100vh - 56px)',
    backgroundColor: theme.palette.shades.dark.background.paper,
  }
});


class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loggedIn, setLogin, classes, socket, openPrivateChat } = this.props;
    return (
      <div className={classes.paperBackground}>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route
            exact
            path='/login'
            render={(props) => <Login {...props} setLogin={setLogin} /> } />
          <Route
            exact
            path='/register'
            render={(props) => <Register {...props} loggedIn={loggedIn} setLogin={setLogin} />}
          />
          <Route path='/rooms' render={(props) => <Rooms {...props} openPrivateChat={openPrivateChat} socket={socket} />} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(Main);
