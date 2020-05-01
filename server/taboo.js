const shuffle = require('shuffle-array');
const _ = require('lodash');
const atob = require('atob');
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
    if (this.winner || this.playing) { return; }
    if (this.redPlayers.indexOf(player) >= 0) {
      if (!this.redLeader) {
        this.redLeader = player;
      }
    } else if (this.bluePlayers.indexOf(player) >= 0) {
      if (!this.blueLeader) {
        this.blueLeader = player;
      }
    }

    if (!this.winner && this.redLeader && this.blueLeader && this.redPlayers.length > 1 && this.bluePlayers.length > 1) {
      this.playing = true;
    }
  }

  endTurn() {
    this.turn = new Turn();
    this.currentTurn = this.currentTurn === 'red' ? 'blue' : 'red';
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
      turn: this.turn
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
