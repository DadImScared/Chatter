
import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';

class MessageArea extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      lockScroll: true
    };
  }

  handleScroll = () => {
    if (Math.ceil(this.listEle.scrollHeight - this.listEle.scrollTop) === this.listEle.clientHeight) {
      // bottom of div
      if (!this.state.lockScroll) this.setState({ lockScroll: true });
    }
    else {
      // not bottom of div
      if (this.state.lockScroll) this.setState({ lockScroll: false });
    }
  };

  renderMessages = () => {
    const { messages, listId, classes } = this.props;
    return messages.map((message, i) => {
      return (
        <ListItem className={classes.listItem} key={`${listId}-item-${i}`}>
          <ListItemText primary={`${message.sender && message.sender === 'me' ? 'me':message.sender.username}: ${message.message}`}/>
        </ListItem>
      );
    });
  };

  componentDidUpdate(prevProps) {
    const { messages: oldMessages } = prevProps;
    const { messages: newMessages } = this.props;
    if (oldMessages.length !== newMessages.length) {
      if (this.state.lockScroll) {
        // force scroll to bottom of list
        this.listEle.scrollTop = this.listEle.scrollHeight;
      }
    }
  }

  componentDidMount() {
    this.listEle.scrollTop = this.listEle.scrollHeight;
  }

  render() {
    return (
      <List id={`dummy-${this.props.listId}`} rootRef={(el) => this.listEle = el} onWheel={this.handleScroll} className={this.props.classes.list}>
        {this.renderMessages()}
      </List>
    );
  }
}

export default MessageArea;
