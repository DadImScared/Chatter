
import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { container } from '../styles/container.css';

const styles = theme => ({
  root: {
    extend: 'container',
    padding: theme.spacing.unit * 2
  },
  fieldStyle: {
    margin: theme.spacing.unit * 2
  },
  container: {
    extend: container,
    margin: theme.spacing.unit * 2
  }
});

const passwordValidator = (props, { form: { password, confirmPass }, formErrors }, id, setState) => {
  const newErrors = { ...formErrors };
  if (password !== confirmPass && confirmPass && password) {
    newErrors['password'] = 'passwords must match';
    newErrors['confirmPass'] = 'passwords must match';

  }
  else {
    newErrors['password'] = '';
    newErrors['confirmPass'] = '';
  }
  setState({ formErrors: newErrors });
};

const formFields = [
  { id: 'username', labelText: 'Username',
    validator: async (props, state, id, setState) => {
      const newErrors = { ...state.formErrors };
      try {
        const { data: { message } } = await axios.post(
          '/api/v1/userexists', { username: state.form.username }, { headers: { contentType: 'application/json' } }
        );
        if (message) {
          newErrors[id] = 'Username taken';
        }
        else {
          newErrors[id] = '';
        }
      }
      catch(e) {
        console.error(e.response);
      }
      setState({ formErrors: newErrors });
    }
  },
  { id: 'password', labelText: 'Password', fieldType: 'password', validator: passwordValidator },
  { id: 'confirmPass', labelText: 'Confirm password', fieldType: 'password', validator: passwordValidator }
];


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      formErrors: {}
    };
  }

  validateDebounce = _.debounce((props, state, id, setState, validator) => {
    validator(props, state, id, setState);
  }, 500);

  updateForm = ({ target: { value } }, id, validator) => {
    const newForm = { ...this.state.form };
    newForm[id] = value;
    this.setState({ form: newForm });
    if (validator) {
      this.validateDebounce(this.props, this.state, id, this.setState.bind(this), validator);
    }
  };

  registerUser = async () => {
    const { username, password, confirmPass } = this.state.form;
    try {
      const { data: { token } } = await axios.post(
        '/api/v1/register',
        { username, password, confirmPass },
        { headers: { contentType: 'application/json' } }
      );
      this.props.setLogin(true, token);
      this.props.history.push('/rooms');
    }
    catch(e) {
      const { data: { error } } = e.response;
      const errors = { ...this.state.formErrors };
      for (const key of Object.keys(error)) {
        errors[key] = error[key].msg;
      }
      this.setState({ formErrors: errors });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper elevation={6} className={classes.container}>
          {
            formFields.map(({ id, labelText, validator, fieldType = 'text' }, index) => {
              return (
                <div key={index} className={classes.fieldStyle}>
                  <TextField
                    id={id}
                    error={!!this.state.formErrors[id]}
                    label={labelText}
                    type={fieldType}
                    onChange={(event) => {this.updateForm(event, id, validator)}}
                    helperText={this.state.formErrors[id] || ''}
                  />
                </div>
              );
            })
          }
          <Button className={classes.fieldStyle} raised color='primary' onClick={this.registerUser}>
            Submit
          </Button>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Register);
