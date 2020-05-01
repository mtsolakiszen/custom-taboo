import React from 'react';
import {
  XXXL, LG,
} from '@zendeskgarden/react-typography';
import { Button } from '@zendeskgarden/react-buttons';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';

const AppHeader = ({
  gameState, socketId, roomName, usernames, changeTeam
}) => {
  const updateName = () => {
    const name = window.prompt('Enter your name');

    if (name !== null && name !== '') {
      window.socket.emit('setUsername', name);
    }
  };
  const color = (gameState.redPlayers || []).indexOf(window.socket.id) >= 0 ? 'playerRed' : 'playerBlue';

  return (
    <div className="app-header">
      <Grid>
        <Row justifyContent="center">
          { gameState.winner ? (
            <XXXL>
              { `Winner: ${gameState.winner} team!` }
            </XXXL>
          )
            : (
              <XXXL>
                Taboo!
              </XXXL>
            ) }

        </Row>

        <Row alignItems="center" justifyContent="center">
          <Col md={3}><div><Button onClick={updateName}>Change name</Button></div></Col>
          <Col md={6}><LG style={{'text-align': 'center'}} className={color}>{ `You are ${usernames[socketId] || socketId}` }</LG></Col>
          <Col md={3}><div><Button onClick={() => { changeTeam(window.socket.id); }}>Change team</Button></div></Col>
        </Row>
        { !gameState.playing
                && (
                <Row justifyContent="center">
                  <LG>
                    Game is
                    {' '}
                    <b>waiting to start</b>
                  </LG>
                </Row>
                )}
      </Grid>
    </div>
  );
};

export default AppHeader;
