
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import axios from 'axios';
import { container } from '../styles/container.css';

const styles = (theme) => ({
  root: {
    extend: container,
    padding: theme.spacing.unit * 2
  },
  fieldStyle: {
    margin: theme.spacing.unit * 2
  },
  container: {
    extend: container,
    margin: theme.spacing.unit * 2,
  },
  errorMessage: {
    marginTop: theme.spacing.unit * 2,
  }
});

class Login extends Component{

  constructor(props) {
    super(props);
    this.state = {
      loginError: ''
    };
  }

  loginUser = async () => {
    const { setLogin } = this.props;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const { data: { token } } = await axios.post(
        '/api/v1/login',
        { username, password },
        { headers: { contentType: 'application/json' } }
      );
      setLogin(true, token);
      this.props.history.push('/rooms');
    } catch (e) {
      // display login error
      console.log(e.response);
      if (e.response.status === 400) {
        this.setState({ loginError: username ? "Password required":"Username required" });
      } else if (e.response.status === 401) {
        this.setState({ loginError: "Bad username or password" });
      } else {
        this.setState({ loginError: e.response.data });
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper elevation={1} className={classes.container}>
          {
            this.state.loginError ?
              <Typography className={classes.errorMessage} color="error">
                {this.state.loginError}
              </Typography>

              :
              null
          }
          <div className={classes.fieldStyle}>
            <TextField
              id={'username'}
              label={'Username'}
              error={!!this.state.loginError}
            />
          </div>
          <div className={classes.fieldStyle}>
            <TextField
              id={'password'}
              label={'Password'}
              type={'password'}
              error={!!this.state.loginError}
            />
          </div>
          <Button onClick={this.loginUser} className={classes.fieldStyle} raised color={'primary'}>
            Login
          </Button>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(Login);
