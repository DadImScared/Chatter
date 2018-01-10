
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30
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
      height: 'calc(100% - 64px)'
    },
    height: 'calc(100% - 56px)'
  }
});


const Home = (props) => {
  const { classes } = props;
  return (
    <Paper className={`taco ${classes.paperBackground}`} square={true}>
      <Grid className={classes.mainArea}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>xs=122</Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Home);
