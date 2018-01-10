
import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Hidden from 'material-ui/Hidden';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Slide from 'material-ui/transitions/Slide';
import List, { ListItem, ListItemText } from 'material-ui/List';
import ResponsiveDrawer from './responsive-drawer';
import MessageArea from './message-area';

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    position: 'absolute',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
      overflowY: 'auto'
    }
  },
  messageList: {
    height: '100%',
    overflowY: 'auto',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  messageListItem: {
    wordBreak: 'break-all'
  },
  activeChat: {
    backgroundColor: theme.palette.common.faintBlack
  }
});

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

class PrivateChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
      messageVal: ''
    };
  }

  toggleMobileNav = () => {
    this.setState({ mobileNavOpen: !this.state.mobileNavOpen });
  };

  renderChatList = () => {
    const { chat, activeChat, switchChat, classes } = this.props;

    const chatList = Object.keys(chat).map((key, i) => {
      return (
        <ListItem onClick={() => switchChat(key)} className={`${key === activeChat ? classes.activeChat:''}`} key={i}>
          <ListItemText primary={`${chat[key].username}`} secondary={`${chat[key].unread ? `unread ${chat[key].unread}`:''}`} />
        </ListItem>
      );
    });

    return (
      <List>
        {chatList}
      </List>
    );
  };

  sendMessage() {
    const { sendMessage } = this.props;
    sendMessage(this.state.messageVal);
    this.setState({ messageVal: '' });
  }

  render() {
    const { isOpen, closeChat, classes, activeChat, chat } = this.props;
    return (
      <Dialog
        fullScreen
        open={isOpen}
        transition={Transition}
      >
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Hidden mdUp>
                <IconButton onClick={this.toggleMobileNav} color="contrast" aria-label="">
                  <MenuIcon />
                </IconButton>
              </Hidden>
              <IconButton onClick={closeChat}>
                <CloseIcon />
              </IconButton>
              {
                activeChat ?
                  <Typography type="title" color="contrast">
                    {chat[activeChat].username}
                  </Typography> : null
              }
            </Toolbar>
          </AppBar>
          <ResponsiveDrawer
            isOpen={this.state.mobileNavOpen}
            handleClose={this.toggleMobileNav}
            drawerClasses={{
              paper: classes.drawerPaper
            }}
            id={'private-chat-list'}
          >
            {this.renderChatList()}
          </ResponsiveDrawer>
          <div style={{ width: '100%', marginTop: '100px' }}>
            <div style={{ height: '300px', width: '100%' }}>
              <MessageArea
                classes={{
                  list: classes.messageList,
                  listItem: classes.messageListItem
                }}
                messages={chat[activeChat] ? chat[activeChat].messages:[]}
                listId={'private-messages'}
              />
            </div>
            {
              activeChat ?
                <div>
                  <div>
                    <TextField
                      value={this.state.messageVal}
                      onChange={({ target: { value } }) => this.setState({ messageVal: value })}
                    />
                  </div>
                  <Button raised color={'primary'} onClick={() => this.sendMessage()}>Click</Button>
                </div> : null
            }
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(PrivateChat);
