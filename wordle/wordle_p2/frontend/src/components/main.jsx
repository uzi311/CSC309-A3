import React from 'react';
import Header from './header';
import GameHome from './gameHome';
import GameUsername from './gameUsername';
import GameGrid from './gameGrid';
import GameStats from './gameStats';
import GameInstructs from './gameInstructs';
import { api_getUsername, api_guess, api_newgame } from './api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Main component of the application
class Main extends React.Component {
  // constructor for the main component
  constructor(props) {
    super(props);
    // Initializing the state
    this.state = {
      activeComponent: 'home',
      username: '',
      wins: 0,
      losses: 0,
      data: '',
      gameGrid: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      gameColors: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      keyboardKeyColors: { Q: '', W: '', E: '', R: '', T: '', Y: '', U: '', I: '', O: '', P: '', A: '', S: '', D: '', F: '', G: '', H: '', J: '', K: '', L: '', Z: '', X: '', C: '', V: '', B: '', N: '', M: '', DEL: '', ENTER: '' },
      row: 0,
      col: 0,
      guess: Array(5).fill(''),
      remainingTime: 0,
      playerCount: 0,
      isActive: true,
      hasWon: false,
      winners: [],
    };
  }

  // Fetch username, wins, and losses data when the component mounts
  componentDidMount() {
    api_getUsername((data) => {
      this.setState({ username: data.username, wins: data.wins, losses: data.losses });
    });

    // Fetch real-time updates
    this.getDataUpdates();
  }

  // Establish WebSocket connection for real-time updates
  getDataUpdates = () => {
      const socket = new WebSocket(`ws://${window.location.hostname}:8581`);
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'playerCount') {
          // Update with the number of players
          this.setState({ playerCount: message.count });
        } else if (message.type === 'timerUpdate') {
          // Update with the remaining time
          this.setState({ remainingTime: message.remainingTime });
        } else {
          console.log("Unknown message type:", message.type);
        }
        // Handle game over
        if (message.remainingTime === 0) {
          this.resetGame()
          toast("The timer ran out! Play again when the timer resets!", {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { backgroundColor: 'rgba(128, 128, 128, 0.8)', color: 'white' }
          });
          // Increment losses if the player didn't win
          if (!this.state.hasWon) {
            this.setState(prevState => ({
              losses: prevState.losses + 1,
            }))
          }
          this.setState({ isActive: false })
        } else {
          this.setState({ isActive: true })
        }

      };
  };

  // Submit user's guess to the server
  makeGuess = (username, guess) => {
    api_guess(username, guess, (data) => {
      this.setState({ data });
      this.handleGuessResult(data);
    });
  };

  // Reset the game state
  resetGame = () => {
    const { username } = this.state;
    api_newgame(username, (data) => {});
    this.setState({
      hasWon: false,
      gameGrid: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      gameColors: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      keyboardKeyColors: { Q: '', W: '', E: '', R: '', T: '', Y: '', U: '', I: '', O: '', P: '', A: '', S: '', D: '', F: '', G: '', H: '', J: '', K: '', L: '', Z: '', X: '', C: '', V: '', B: '', N: '', M: '', DEL: '', ENTER: '' },
      col: 0,
      row: 0,
      guess: Array(5).fill(''),
    });
  };

  // Color the game board and keyboard based on the score
  colorBoardAndKeyboard = (score) => {
    const { row, gameColors, guess } = this.state;
    const newColors = [...gameColors];
    for (let i = 0; i < score.length; i++) {
      switch (score[i].score) {
        case 0:
          newColors[row][i] = 'black';
          break;
        case 1:
          newColors[row][i] = 'gray';
          break;
        case 2:
          newColors[row][i] = 'yellow';
          break;
        case 3:
          newColors[row][i] = 'green';
          break;
        default:
          break;
      }
    }
    this.setState({ gameColors: newColors });
    for (let i = 0; i < guess.length; i++) {
      this.setKeyboardColor(guess[i], newColors[row][i]);
    }
  };

  // Set color for a keyboard key
  setKeyboardColor = (key, color) => {
    this.setState(prevState => {
      const currentColor = prevState.keyboardKeyColors[key];
      if (currentColor === 'green') {
        return null;
      } else {
        const updatedKeyboardKeyColors = { ...prevState.keyboardKeyColors, [key]: color };
        return { keyboardKeyColors: updatedKeyboardKeyColors };
      }
    });
  };
  
  // update the game grid
  updateGrid = (rowIndex, colIndex, value) => {
    const { gameGrid } = this.state;
    const updatedGrid = gameGrid.map((row, i) =>
      i === rowIndex ? row.map((col, j) =>
        j === colIndex ? value : col
      ) : row
    );
    this.setState({ gameGrid: updatedGrid });
  };

  // remove a character
  delCharacter = () => {
    const { col, row } = this.state;
    if (col > 0) {
      this.setState(prevState => ({
        col: prevState.col - 1,
        guess: prevState.guess.map((letter, index) => index === col - 1 ? '' : letter)
      }));
      this.updateGrid(row, col - 1, '');
    }
  };

  // add a character
  putCharacter = c => {
    const { col, row } = this.state;
    if (col < 5) {
      this.setState(prevState => ({
        guess: prevState.guess.map((letter, index) => index === col ? c : letter),
        col: prevState.col + 1
      }));
      this.updateGrid(row, col, c);
    }
  };

  // Handle key press events
  handleKeyPress = key => {
    if (key === 'DEL') {
      this.delCharacter();
    } else if (key === 'ENTER') {
      const { username, guess } = this.state;
      const currentGuess = guess.join('');
      this.makeGuess(username, currentGuess);
    } else {
      this.putCharacter(key);
    }
  };

  handleKeyboardKeyClick = key => {
    if (this.state.isActive) {
      this.handleKeyPress(key);
    }
  };

  // Handle guess result from the server
  handleGuessResult = (data) => {
    if (data.success) {
      this.colorBoardAndKeyboard(data.score);
      this.state.guess.map((letter, index) => {
        this.setKeyboardColor(letter, this.state.gameColors[this.state.row][index]);
      })
      this.setState(prevState => ({
        guess: Array(5).fill(''),
        row: prevState.row + 1,
        col: 0,
      }));
      if (data.state === "lost") {
        toast("You " + data.state + "! The correct word was " + data.target + "\nPlay again by waiting for the next iteration of the game to start!");
      } else if (data.state === "won") {
        this.setState({ hasWon: true, winners: data.winners })
        let position = data.winners.length
        toast.success(
          <>
            {"Congratulations, you " + data.state + "!,"}
            <br />
            {"You placed " + position + " out of " + this.state.playerCount + " players!"}
            <br />
            {"Play again by waiting for the next iteration of the game to start!"}
          </>, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { backgroundColor: 'rgba(0, 255, 0, 0.8)', color: 'white' }
        });
      }
      api_getUsername((userData) => {
        this.setState({ username: userData.username, wins: userData.wins });
      });
    } else {
      toast(data.error);
    }
  };

  // Handle click on the header
  handleHeaderClick = (componentName) => {
    this.setState({ activeComponent: componentName });
  }

  handleSoloClick = () => {
    this.setState({ activeComponent: 'grid', isPlaying: true, }); 
    this.getDataUpdates();
  };

  render() {
    const { activeComponent, username, data, gameGrid, gameColors, keyboardKeyColors, wins, losses, playerCount, remainingTime } = this.state;

    return (
      <div>
        <Header activeItem={activeComponent} onHeaderClick={this.handleHeaderClick} />
        {activeComponent === 'home' && <GameHome onSoloClick={this.handleSoloClick}/>}
        {activeComponent === 'username' && <GameUsername username={username} />}
        {activeComponent === 'grid' && <GameGrid 
          username={username} 
          resetGame={this.resetGame} 
          gameGrid={gameGrid} 
          gameColors={gameColors} 
          keyboardKeyColors={keyboardKeyColors} 
          handleKeyboardKeyClick={this.handleKeyboardKeyClick} 
          playerCount={playerCount}
          remainingTime={remainingTime}
        />}
        {activeComponent === 'stats' && <GameStats wins={wins} losses={losses}/>}
        {activeComponent === 'instructs' && <GameInstructs />}
      </div>
    );
  }
}

export { Main };
