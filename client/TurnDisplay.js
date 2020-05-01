import React from 'react';
import { Button } from '@zendeskgarden/react-buttons';

const TurnDisplay = ({
  endTurn,
  nextCard,
  gameState: {
    playing, redPlayers, redLeader, blueLeader, currentTurn,
  },
}) => {
  if (!playing) { return null; }

  const playerId = window.socket.id;
  const playersColor = redPlayers.indexOf(playerId) >= 0 ? 'red' : 'blue';
  const playersTurn = playersColor === currentTurn;
  const playersLeader = playersColor == 'red' ? redLeader : blueLeader;
  const isLeader = playerId === playersLeader;

  return (
    <div className="turn-display">
      <p className="turn-text">
        Current turn:
        {' '}
        <span className={`${currentTurn}-text`}>{currentTurn}</span>
      </p>
      { playersTurn && isLeader && (
        <CurrentPlayerDisplay
          endTurn={() => endTurn(playerId)}
          nextCard={() => nextCard(playerId)}
        />
      )}
    </div>
  );
};

const CurrentPlayerDisplay = ({
  nextCard,
  endTurn,
}) => (
  <div>
    <button onClick={nextCard}>Next Card</button>
    <button onClick={endTurn}>End turn</button>
  </div>
);

export default TurnDisplay;
