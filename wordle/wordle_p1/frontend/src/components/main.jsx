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

class Main extends React.Component {
  constructor(props) {
    super(props);
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
      active: false
    };
  }

  componentDidMount() {
    api_getUsername((data) => {
      this.setState({ username: data.username, wins: data.wins, losses: data.losses });
    });
  }

  makeGuess = (username, guess) => {
    api_guess(username, guess, (data) => {
      this.setState({ data });
      this.handleGuessResult(data);
    });
  };

  resetGame = () => {
    const { username } = this.state;
    api_newgame(username, (data) => {});
    this.setState({
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
      active: true
    });
  };

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
  

  updateGrid = (rowIndex, colIndex, value) => {
    const { gameGrid } = this.state;
    const updatedGrid = gameGrid.map((row, i) =>
      i === rowIndex ? row.map((col, j) =>
        j === colIndex ? value : col
      ) : row
    );
    this.setState({ gameGrid: updatedGrid });
  };

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

  handleKeyPress = key => {
    const { active } = this.state;
    if (key === 'DEL') {
      this.delCharacter();
    } else if (key === 'ENTER' && active) {
      const { username, guess } = this.state;
      const currentGuess = guess.join('');
      this.makeGuess(username, currentGuess);
    } else if (active) {
      this.putCharacter(key);
    }
  };

  handleKeyboardKeyClick = key => {
    const { active } = this.state;
    if (active) {
      this.handleKeyPress(key);
    }
  };

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
        active: data.state !== "lost"
      }));
      if (data.state === "lost") {
        toast("You " + data.state + "! The correct word was " + data.target);
      } else if (data.state === "won") {
        toast.success("Congratulations, you " + data.state + "!", {
          position: "top-right",
          autoClose: 5000,
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
        this.setState({ username: userData.username, wins: userData.wins, losses: userData.losses });
      });
    } else {
      toast(data.error);
    }
  };

  handleHeaderClick = (componentName) => {
    this.setState({ activeComponent: componentName });
  }

  handleSoloClick = () => {
    this.setState({ activeComponent: 'grid' }); 
  };

  render() {
    const { activeComponent, username, data, gameGrid, gameColors, keyboardKeyColors, active, wins, losses } = this.state;

    return (
      <div>
        <Header activeItem={activeComponent} onHeaderClick={this.handleHeaderClick} />
        {activeComponent === 'home' && <GameHome onSoloClick={this.handleSoloClick}/>}
        {activeComponent === 'username' && <GameUsername username={username} />}
        {activeComponent === 'grid' && <GameGrid 
          username={username} 
          resetGame={this.resetGame} 
          active={active} 
          gameGrid={gameGrid} 
          gameColors={gameColors} 
          keyboardKeyColors={keyboardKeyColors} 
          handleKeyboardKeyClick={this.handleKeyboardKeyClick} 
        />}
        {activeComponent === 'stats' && <GameStats wins={wins} losses={losses}/>}
        {activeComponent === 'instructs' && <GameInstructs />}
      </div>
    );
  }
}

export { Main };
