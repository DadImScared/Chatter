
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';

const styles = theme => ({
  activeClass: {
    color: theme.palette.secondary['A100']
  }
});

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { loggedIn, logout, classes } = this.props;

    return (
      <AppBar position={'static'}>
        <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
          {
            loggedIn ?
              [
                <Button key={'room-loggedin'} activeClassName={classes.activeClass} component={NavLink} to='/rooms'>Rooms</Button>,
                <Button key={'logout'} onClick={logout}>Logout</Button>
              ]
              :
              [
                <Button component={NavLink} key={'login-link'} activeClassName={classes.activeClass} to='/login'>Login</Button>,
                <Button component={NavLink} key={'register-link'} activeClassName={classes.activeClass} to='/register'>Register</Button>
              ]
          }
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Navbar);
