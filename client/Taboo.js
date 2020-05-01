import React from 'react';

class Taboo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    const { gameState } = this.props;
    if (!gameState) { return null; }
    const { currentCard, redPlayers, currentTurn, redLeader, blueLeader } = gameState;
    if (!currentCard) { return null; }

    console.log(currentCard);


    const playerId = window.socket.id;
    const playersColor = redPlayers.indexOf(playerId) >= 0 ? 'red' : 'blue';
    const playersTurn = playersColor === currentTurn;
    const playersLeader = playersColor == 'red' ? redLeader : blueLeader;
    const isLeader = playerId === playersLeader;

    const guessStyle = {
      fontSize: '50px',
      margin: '0 auto',
      height: '200px',
      width: '100%',
      textAlign: 'center',
      marginTop: '50px',
      fontSize: '50px'
    };

    if(playersTurn && !isLeader) { return <div style={guessStyle}>Guess!</div>}

    return (
      <div className="game">
        <div className="tiles" style={{fontSize: '25px'}}>
          <div style={{display: 'block', width: '100%'}}><b>Word:</b> { currentCard['word'] }</div>
          <div style={{display: 'block'}}>
          <b>Taboo:</b>
          <div>
          {
            currentCard['taboo'].map((tabooWord) => <span style={{display: 'block'}} key={tabooWord}>{tabooWord}</span>)
          }
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Taboo;
