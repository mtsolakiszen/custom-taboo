const shuffle = require('shuffle-array');
const cards = Object.values(require('./tabooCards'));
const Turn = require('./turn.js').default;

class TabooGame {
  constructor() {
    // generate a list of 25 tiles. we don't need to track order, just
    // remember which words belong to which team and sort it out at runtime.
    this.cards = shuffle(cards);
    this.cardPosition = 0;

    this.redPlayers = [];
    this.bluePlayers = [];
    this.redLeader = undefined;
    this.blueLeader = undefined;
    this.playing = false;
    this.winner = undefined;
    this.finishTime = 0;
    this.currentTurn = 'red'; // red goes first
    this.turn = new Turn();
  }

  // add a new player to the team with the fewest players
  addPlayer(player) {
    console.log(`Adding: ${player}`);
    if (this.redPlayers.length < this.bluePlayers.length) {
      this.redPlayers = this.redPlayers.concat(player);
      console.log(`red team: ${player}`);
    } else {
      this.bluePlayers = this.bluePlayers.concat(player);
      console.log(`blue team: ${player}`);
    }

    if (!this.winner && this.redLeader && this.blueLeader && this.redPlayers.length > 1 && this.bluePlayers.length > 1) {
      this.playing = true;
    }
  }

  removePlayer(player) {
    this.redPlayers = this.redPlayers.filter((p) => p !== player);
    this.bluePlayers = this.bluePlayers.filter((p) => p !== player);
    if (this.redLeader === player) { this.redLeader = undefined; }
    if (this.blueLeader === player) { this.blueLeader = undefined; }
  }

  assignLeader(player) {
    if (this.redPlayers.indexOf(player) >= 0) {
      this.redLeader = player;
    } else if (this.bluePlayers.indexOf(player) >= 0) {
      this.blueLeader = player;
    }

    if (!this.winner && this.redLeader && this.blueLeader && this.redPlayers.length > 1 && this.bluePlayers.length > 1) {
      this.playing = true;
    }
  }

  changeTeam(player) {
    const redPlayerIndex = this.redPlayers.indexOf(player);
    const bluePlayerIndex = this.bluePlayers.indexOf(player);

    if (redPlayerIndex >= 0) {
      if(this.redLeader == player) { this.redLeader = null; }
      this.redPlayers.splice(redPlayerIndex, 1);
      this.bluePlayers = this.bluePlayers.concat(player);
    } else if (bluePlayerIndex >= 0) {
      if(this.blueLeader == player) { this.blueLeader = null; }
      this.bluePlayers.splice(bluePlayerIndex, 1);
      this.redPlayers = this.redPlayers.concat(player);
    }
  }

  endTurn() {
    this.turn = new Turn();
    this.currentTurn = this.currentTurn === 'red' ? 'blue' : 'red';
  }

  startTimer(time) {
    console.log(time)
    this.finishTime = time + (60000 * 2);
  }

  clearTimer() {
    this.finishTime = 0;
  }

  nextCard() {
    this.cardPosition += 1;
  }

  getPlayerColor(player) {
    if (this.redPlayers.indexOf(player) >= 0) {
      return 'red';
    }
    if (this.bluePlayers.indexOf(player) >= 0) {
      return 'blue';
    }
  }

  // what the client needs to render the game
  serialize(player) {
    const output = {
      currentCard: this.cards[this.cardPosition],
      currentTurn: this.currentTurn,
      redPlayers: this.redPlayers,
      bluePlayers: this.bluePlayers,
      redLeader: this.redLeader,
      blueLeader: this.blueLeader,
      playing: this.playing,
      winner: this.winner,
      turn: this.turn,
      finishTime: this.finishTime
    };

    // // leaders see all tiles revealed; everyone else only sees picked ones
    // if (player === this.redLeader || player === this.blueLeader) {
    //   output.redTiles = this.redTiles;
    //   output.blueTiles = this.blueTiles;
    //   output.assassinTile = this.assassinTile;
    // } else {
    //   output.redTiles = this.redTiles.filter((t) => this.revealedTiles.indexOf(t) >= 0);
    //   output.blueTiles = this.blueTiles.filter((t) => this.revealedTiles.indexOf(t) >= 0);
    //   output.assassinTile = this.revealedTiles.indexOf(this.assassinTile) >= 0 ? this.assassinTile : undefined;
    // }

    return output;
  }
}

exports.default = TabooGame;
