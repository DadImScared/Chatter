
import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Badge from 'material-ui/Badge';
import PeopleIcon from 'material-ui-icons/People';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Cookie from 'js-cookie';
import axios from 'axios';
import _ from 'lodash';
import ResponsiveDrawer from './responsive-drawer';
import Room from '../components/room';
import { container } from '../styles/container.css';

const drawerWidth = 240;

const styles = theme => ({
  roomHeight: {
    height: 'calc(100vh - 180px)',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%'
  },
  appBar: {
    position: 'absolute',
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
      overflowY: 'auto'
    }
  },
  inputSpacing: {
    margin: theme.spacing.unit * 2
  },
  inputWrapper: {
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing.unit * 2
    }
  },
  roomWrapper: {
    marginTop: '56px',
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 242px)',
      marginTop: '65px'
    }
  },
  activeLink: {
    backgroundColor: theme.palette.common.faintBlack
  },
  hideMenuIcon: {
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  },
  toolBar: {
    justifyContent: 'space-between'
  },
  breakWord: {
    wordBreak: 'break-all'
  },
});


class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      mobileNavOpen: false,
      userNavOpen: false,
      inputVal: '',
      inputError: '',
      currentRoom: '',
      currentRoomUserCount: 0
    };
  }

  updateRoom = (room) => {
    this.setState({ currentRoom: room });
  };

  updateRoomUserCount = (userListLength) => {
    this.setState({ currentRoomUserCount: userListLength });
  };

  createRoom = async () => {
    try {
      const { data } = await axios.post(
        '/api/v1/rooms',
        { room: this.state.inputVal },
        {
          headers: {
            'Authorization': `JWT ${Cookie.get('token')}`,
            'Content-Type': 'application/json'
          }
        }
        );
      this.setState({ inputVal: '' });
    } catch (e) {
      const { data: { error } } = e.response;
      this.setState({ inputError: error['room'].msg })
    }
  };

  mobileNavToggle = () => {
    this.setState({ mobileNavOpen: !this.state.mobileNavOpen });
  };

  toggleUserNav = () => {
    this.setState({ userNavOpen: !this.state.userNavOpen });
  };

  async componentDidMount() {
    const { socket } = this.props;
    try {
      const { data } = await axios.get('/api/v1/rooms');
      this.setState({ rooms: _.sortBy(data, [function(obj) {return obj.name.toLowerCase()}]) });
    } catch (e) {
      console.log(e);
    }
    socket.on('newRoom', room => {
      const allRooms = [...this.state.rooms, room];
      const sortedRooms = _.sortBy(allRooms, [function(obj) {return obj.name.toLowerCase()}]);
      this.setState({ rooms: sortedRooms });
    });
  }

  renderUsersButton = () => {
    const buttonContent = (
      <Badge color={"secondary"} badgeContent={this.state.currentRoomUserCount}>
        <PeopleIcon />
      </Badge>
    );
    return [
      <Hidden lgUp key={'mobile-visible-nav'}>
        <IconButton onClick={this.toggleUserNav} aria-label={"Room members button mobile"} color={"accent"}>
          {buttonContent}
        </IconButton>
      </Hidden>,
      <Hidden lgDown key={'desktop-visible-nav'}>
        <IconButton aria-label={"Room members button"} color={"accent"}>
          {buttonContent}
        </IconButton>
      </Hidden>
    ]
  };

  renderRooms = () => {
    const { classes } = this.props;
    const rooms = this.state.rooms.map((room, index) => {
      return (
        <ListItem onClick={this.mobileNavToggle} component={NavLink} className={classes.breakWord} activeClassName={`${classes.activeLink} `} to={`/rooms/${room.name}`} key={index}>
          <ListItemText primary={room.name} />
        </ListItem>
      )
    });
    return (
      <List style={{ height: "50vh" }}>
        {rooms}
      </List>
    )
  };

  render() {
    const { match, classes, socket, openPrivateChat } = this.props;
    return (
      <Grid className={classes.root}>
        <Grid item xs={10} xl={8}>
          <div className={classes.inputWrapper}>
            <TextField
              placeholder="Create a new room"
              error={!!this.state.inputError}
              value={this.state.inputVal}
              helperText={this.state.inputError}
              onChange={(e) => this.setState({ inputVal: e.target.value, inputError: '' })}
            />
            <Button color={'primary'} onClick={this.createRoom} raised className={classNames(classes.inputSpacing)}>
              Submit
            </Button>
          </div>
          <Grid container style={{ position: 'relative'}}>
            <AppBar className={classes.appBar}>
              <Toolbar className={classes.toolBar}>
                <IconButton onClick={this.mobileNavToggle} className={classes.hideMenuIcon} aria-label={"Room list menu"} color="contrast">
                  <MenuIcon />
                </IconButton>
                <Typography className={classes.breakWord} type="title" color="contrast">
                  {this.state.currentRoom}
                </Typography>
                {this.renderUsersButton()}
              </Toolbar>
            </AppBar>
            <ResponsiveDrawer
              isOpen={this.state.mobileNavOpen}
              handleClose={this.mobileNavToggle}
              drawerClasses={{
                  paper: classes.drawerPaper
                }}
              id={'room-nav'}
            >
              {this.renderRooms()}
            </ResponsiveDrawer>
            <Grid className={classes.roomWrapper}>
              <Switch >
                <Route
                  exact
                  path={`${match.url}/:room`}
                  render={
                    (props) =>
                      <Room
                        {...props}
                        openPrivateChat={openPrivateChat}
                        userNavOpen={this.state.userNavOpen}
                        closeUserNav={this.toggleUserNav}
                        updateRoom={this.updateRoom}
                        updateUsers={this.updateRoomUserCount}
                        socket={socket}
                      />
                  }
                />
              </Switch>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Rooms);
