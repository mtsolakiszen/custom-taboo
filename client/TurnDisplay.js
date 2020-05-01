import React from 'react';
import { Button } from '@zendeskgarden/react-buttons';
import Timer from './Timer';

const TurnDisplay = ({
  endTurn,
  nextCard,
  startTimer,
  clearTimer,
  gameState: {
    playing, redPlayers, redLeader, blueLeader, currentTurn, finishTime,
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
      <Timer start={startTimer} clear={clearTimer} finishTime={finishTime} />
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
    <Button onClick={nextCard}>Next Card</Button>
    <Button onClick={endTurn}>End turn</Button>
  </div>
);

export default TurnDisplay;
