import React from 'react';
import { v4 as uuid } from 'uuid';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';
import ChatPanel from './ChatPanel';
import Taboo from './Taboo';
import TeamDisplay from './TeamDisplay';
import AppHeader from './AppHeader';
import TurnDisplay from './TurnDisplay';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      tiles: [],
      usernames: {},
      gameState: {},
    };
  }

  componentDidMount() {
    if (!this.props.roomName) { return; }

    window.socket.on('chat message', (msg, color) => {
      this.setState({ messages: [...this.state.messages, { message: msg, color }] });
    });

    window.socket.on('usernames', (msg) => {
      this.setState({ usernames: msg });
    });

    window.socket.on('game state update', (gameState) => {
      console.log('got update', gameState);
      this.setState({ gameState });
    });
  }

  sendMessage(msg) {
    window.socket.emit('chat message', msg);
  }

  // request a new copy of the state from the server. called after the
  // component loads
  syncState() {
    window.socket.emit('sync');
  }

  endTurn(player) {
    console.log('ending turn', player);
    window.socket.emit('endTurn');
  }

  nextCard(player) {
    console.log('changing card', player);
    window.socket.emit('nextCard');
  }

  startTimer(player) {
    console.log('starting timer', player);
    window.socket.emit('startTimer', new Date().getTime());
  }

  clearTimer(player) {
    console.log('clearing timer', player);
    window.socket.emit('clearTimer');
  }

  chooseLeader(player) {
    console.log('choosing leader', player);
    window.socket.emit('chooseLeader', player);
  }

  render() {
    const { roomName, socketId } = this.props;
    const {
      messages, gameState, currentCard,
    } = this.state;
    const id = uuid();

    if (!roomName) {
      // TODO: extract to landing page component
      return (
        <div>
          <h1>Welcome!</h1>

          <p>To invite others to your game, just share the URL of your game with them</p>
          <a href={`?new#${id}`}>Start a random game</a>
        </div>
      );
    }
    console.log(gameState);

    return (
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <AppHeader gameState={gameState} socketId={socketId} roomName={roomName} usernames={this.state.usernames} />
        <Taboo gameState={gameState} />
        <TurnDisplay gameState={gameState} nextCard={this.nextCard.bind(this)} endTurn={this.endTurn.bind(this)} startTimer={this.startTimer.bind(this)} clearTimer={this.clearTimer.bind(this)}/>
        <TeamDisplay gameState={gameState} chooseLeader={this.chooseLeader.bind(this)} usernames={this.state.usernames} />
        <ChatPanel messages={messages} sendMessage={this.sendMessage.bind(this)} gameState={gameState} />
      </ThemeProvider>
    );
  }
}

export default App;
