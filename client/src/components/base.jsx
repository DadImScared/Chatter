
import React, { Component } from 'react';
import _ from 'lodash'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { createMuiTheme } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import deepPurple from 'material-ui/colors/deepPurple';
import teal from 'material-ui/colors/teal';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import { Close } from 'material-ui-icons';
import ChatIcon from 'material-ui-icons/Chat';
import io from 'socket.io-client';
import Cookie from 'js-cookie';
import Navbar from './navbar';
import Main from './main';
import PrivateChat from './private-chat';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepPurple,
    secondary: teal,
  }
});

const styles = them => ({
  root: {
    textAlign: 'center',
    paddingTop: 200,
  },
  floatingButton: {
    position: "fixed",
    bottom: "10vh",
    right: "10vw"
  },
  hide: {
    display: "none"
  },
  badgeColor: {
    backgroundColor: theme.palette.primary[800]
  }
});

const socket = io({ host: 'http://127.0.0.1:4000/', autoConnect: false });

class Base extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      loggedIn: false,
      currentRoom: '',
      unreadMessages: 0,
      isChatOpen: false,
      activeChat: '',
      privateChat: {}
    };
  }

  getChatHistory = async () => {
    try {
      const { data } = await axios.get(
        '/api/v1/conversations',
        {
          headers: {
            'Authorization': `JWT ${Cookie.get('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(data);
      const privateChat = {};
      for (const obj of data) {
        privateChat[obj.otherUser._id] = {
          username: obj.otherUser.username,
          recentMessage: obj.lastMessage,
          messages: obj.messages,
          unread: 0
        }
      }
      this.setState({ privateChat})
    } catch (e) {
      console.log(e);
    }
  };

  sendPrivateMessage = (message) => {
    const newChat = {...this.state.privateChat};
    const newMessage = { message, sender: "me", createdAt: Date.now() };
    newChat[this.state.activeChat] = {
      ...newChat[this.state.activeChat],
      messages: [
        ...newChat[this.state.activeChat].messages,
        newMessage
      ],
      recentMessage: newMessage
    };
    this.setState({ privateChat: newChat });
    console.log('here');
    socket.emit('privateMessage', { message, userId: this.state.activeChat });
  };

  switchActiveChat = (newId) => {
    const newChat = {...this.state.privateChat};
    newChat[newId] = {
      ...newChat[newId],
      unread: 0
    };
    this.setState({ activeChat: newId, privateChat: newChat });
  };

  openChat = (userId, username) => {
    const { privateChat } = this.state;
    const newChat = {...privateChat};
    if (!newChat[userId]) {
      newChat[userId] = {
        username,
        messages: [],
        unread: 0,
        recentMessage: {
          createdAt: Date.now(),
          message: ''
        }
      };
    }
    // const sortedChat = _.sortBy(newChat, [function(obj) {return obj.recentMessage.createdAt}]);
    this.setState({
      privateChat: newChat,
      activeChat: userId,
      isChatOpen: true,
    });
  };

  setLogin = (isLoggedIn, token='') => {
    this.setState({
      loggedIn: isLoggedIn
    });
    if (isLoggedIn && token) {
      Cookie.set('token', token);
    }
    socket.io.opts.query = {
      token
    };
    socket.connect();
  };

  logout = () => {
    this.setState({ loggedIn: false });
    Cookie.remove('token');
    socket.disconnect();
    this.props.history.push('/');
  };

  togglePrivateChat = () => {
    this.setState({ isChatOpen: !this.state.isChatOpen, unreadMessages: 0 });
  };

  renderBadge = () => {
    const { unreadMessages } = this.state;
    const { classes } = this.props;
    let content;
    if (unreadMessages) {
      content = <Badge
        classes={{ colorPrimary: classes.badgeColor }}
        color={"primary"}
        badgeContent={unreadMessages}
      >
        <ChatIcon />
      </Badge>
    } else {
      content = <ChatIcon />
    }
    return (content);
  };

  componentDidMount() {
    const token = Cookie.get('token');
    if (token) {
      this.setLogin(true, token);
      this.getChatHistory();
    }
    socket.on('privateMessage', data => {
      const { privateChat, isChatOpen, activeChat } = this.state;
      const newChat = {...privateChat};
      const newMessages = newChat[data.sender._id] && newChat[data.sender._id].messages || [];
      newChat[data.sender._id] = {
        username: data.sender.username,
        messages: [...newMessages, data],
        unread: activeChat === data.sender._id ?
          0
          :
          privateChat[data.sender._id] && privateChat[data.sender._id].unread ?
            privateChat[data.sender._id].unread + 1
            :
            1
        ,
        recentMessage: data
      };
      // const sortedChat = _.sortBy(newChat, [function(obj) {return obj.recentMessage.createdAt}]);
      this.setState({
        unreadMessages: isChatOpen ? 0:this.state.unreadMessages + 1,
        privateChat: newChat
      })
    });
  }

  componentWillUnmount() {
    socket.removeListener('privateMessage');
  }

  render() {
    const { classes } = this.props;
    const { privateChat, activeChat, isChatOpen } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Navbar logout={this.logout} loggedIn={this.state.loggedIn} />
          <Main socket={socket} openPrivateChat={this.openChat} loggedIn={this.state.loggedIn} setLogin={this.setLogin} />
          <PrivateChat
            chat={{...privateChat}}
            isOpen={isChatOpen}
            closeChat={this.togglePrivateChat}
            activeChat={activeChat}
            sendMessage={this.sendPrivateMessage}
            switchChat={this.switchActiveChat}
          />
          <Button
            onClick={this.togglePrivateChat}
            className={classNames(
              classes.floatingButton,
              {
                [classes.hide]: !this.state.loggedIn
              }
            )}
            fab
            color={"primary"}
            aria-label={"message"}
          >
            {this.renderBadge()}
          </Button>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withRouter(withStyles(styles)(Base));
