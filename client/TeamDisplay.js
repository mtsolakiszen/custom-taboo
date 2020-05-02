import React from 'react';
import { Button } from '@zendeskgarden/react-buttons';

const TeamDisplay = ({
  usernames,
  gameState: {
    redPlayers, bluePlayers, redLeader, blueLeader, currentTurn, scores
  }, chooseLeader,
}) => {
  if (!redPlayers) { return null; } // TODO: add default props above and remove these checks
  const playerId = window.socket.id;

  const listPlayers = (players) => (
    players.map((p) => (
      <div key={p}>
        {usernames[p] || p}
        {' '}
        {(p === redLeader || p === blueLeader) && '(clue-giver)'}
      </div>
    ))
  );

  const playersColor = redPlayers.indexOf(playerId) >= 0 ? 'red' : 'blue';
  const playersTurn = playersColor === currentTurn;
  const playersLeader = playersColor == 'red' ? redLeader : blueLeader;
  const isLeader = playerId === playersLeader;

  return (
    <div className="players">
      <div className="red-team">
        <h3>Red team ({ scores.red }):</h3>
        { listPlayers(redPlayers) }
      </div>
      <div className="blue-team">
        <h3>Blue team ({scores.blue}):</h3>
        { listPlayers(bluePlayers) }
      </div>
      { ((!isLeader && (!redLeader || !playersTurn) && redPlayers.indexOf(playerId) >= 0) || (!isLeader && (!blueLeader || !playersTurn) && bluePlayers.indexOf(playerId) >= 0))
        && <Button onClick={() => { chooseLeader(playerId); }}>Become the clue-giver!</Button>}
    </div>
  );
};

export default TeamDisplay;
