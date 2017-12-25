
import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Button from 'material-ui/Button';
import ResponsiveDrawer from './responsive-drawer';
import IconButton from 'material-ui/IconButton';
import CommentIcon from 'material-ui-icons/Comment';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

import MessageArea from './message-area';

const drawerWidth = 240;

const styles = theme => ({
  chatArea: {
    position: 'relative',
    height: '40vh',
    width: '100%',
    overFlowY: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '50vh'
    }
  },
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'absolute',
      height: '100%',
      overflowY: 'auto'
    }
  },
  fieldStyle: {
    margin: theme.spacing.unit * 2
  },
  messageList: {
    height: '100%',
    overflowY: 'auto',
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    }
  },
  messageListItem: {
    wordBreak: 'break-all'
  }
});

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      roomMembers: [],
      inputVal: '',
      isUsersOpen: false
    };
  }

  async componentDidMount() {
    const { match: { params: { room } }, socket, updateRoom, updateUsers } = this.props;
    socket.emit('joinRoom', room);
    try {
      const { data } = await axios.get(`/api/v1/rooms/${room}/onlineusers`);
      this.setState({ roomMembers: [...this.state.roomMembers, ...data] }, () => {
        updateRoom(room);
        updateUsers(this.state.roomMembers.length);
      });
    } catch (e) {
      console.log(e);
    }
    socket.on('roomMessage', data => {
      this.setState({ messages: [...this.state.messages, data] });
    });
    socket.on('userJoinedRoom', user => {
      this.setState({
        roomMembers: _.sortBy([...this.state.roomMembers, user], [function(obj) {return obj.username}])
        }, () => {updateUsers(this.state.roomMembers.length)});
    });
    socket.on('userLeftRoom', user => {
      this.setState({
        roomMembers: _.uniqBy(_.filter(this.state.roomMembers, ({ _id }) => _id !== user._id), ({ _id }) => _id)
      }, () => updateUsers(this.state.roomMembers.length));
    });
  };

  sendMessage = () => {
    const { socket, match: { params: { room } } } = this.props;
    if (this.state.inputVal) {
      const { inputVal: message } = this.state;
      const newRoomMessage = {
        sender: "me",
        createdAt: Date.now(),
        message
      };
      this.setState({
        messages: [...this.state.messages, newRoomMessage],
        inputVal: ''
      });
      socket.emit('roomMessage', { room, message });
    }
  };

  componentWillUnmount() {
    const { socket, updateRoom, updateUsers } = this.props;
    updateRoom('');
    updateUsers(0);
    socket.removeListener('roomMessage');
    socket.removeListener('userJoinedRoom');
    socket.removeListener('userLeftRoom');
  }

  async componentWillReceiveProps(newProps) {
    const { match: { params: { room: oldRoom } }, socket, updateRoom, updateUsers } = this.props;
    const { match: { params: { room: newRoom } } } = newProps;
    if (newProps.match.params.room !== oldRoom) {
      socket.emit('leaveRoom', oldRoom);
      socket.emit('joinRoom', newProps.match.params.room);
      try {
        const { data: roomMembers } = await axios.get(`/api/v1/rooms/${newRoom}/onlineusers`);
        updateRoom(newRoom);
        updateUsers(roomMembers.length);
        this.setState({ messages: [], roomMembers })
      } catch (e) {
        console.error(e);
      }
    }
  }

  renderMessages = () => {
    const { classes } = this.props;
    const messages = this.state.messages.map((message, i) => {
      return (
        <ListItem className={classes.messageListItem} key={i}>
          <ListItemText primary={`${message.creator === 'me' ? 'me':message.creator.username}: ${message.message}`}/>
        </ListItem>
      )
    });
    return (
      <List className={classes.messageList}>{messages}</List>
    );
  };

  renderRoomMembers = () => {
    const users = this.state.roomMembers.map((user, i) => {
      return (
        <ListItem key={i}>
          <ListItemText primary={`${user.username}`} />
          <ListItemSecondaryAction>
            <IconButton onClick={() => this.props.openPrivateChat(user._id, user.username)}>
              <CommentIcon/>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    });
    return (
      <List >
        {users}
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
        <ListItem>awdawd</ListItem>
      </List>
    )
  };

  render() {
    const { classes, userNavOpen, closeUserNav } = this.props;
    return (
      <div style={{ position: 'relative'}}>
        <div className={classNames(classes.chatArea)}>
          <MessageArea
            classes={{
              list: classes.messageList,
              listItem: classes.messageListItem
            }}
            messages={this.state.messages}
            listId={'room-messages'}
          />
          <ResponsiveDrawer
            isOpen={userNavOpen}
            handleClose={closeUserNav}
            drawerClasses={{
              paper: classes.drawerPaper
            }}
            anchor={'right'}
            id={'room-users-nav'}
          >
            {this.renderRoomMembers()}
          </ResponsiveDrawer>
        </div>
        <div className={classes.fieldStyle}>
          <TextField
            id="message-input"
            label="Message input"
            placeholder="Enter your message here"
            value={this.state.inputVal}
            onChange={(e) => {this.setState({ inputVal: e.target.value })}}
          />
        </div>
        <div className={classes.fieldStyle}>
          <Button raised color={'primary'} onClick={this.sendMessage}>Send message</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Room);
