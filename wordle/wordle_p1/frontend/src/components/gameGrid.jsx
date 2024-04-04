import React from 'react';
import KeyboardKey from './keyboardKey';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameGrid = ({
  username,
  resetGame,
  active,
  gameGrid,
  gameColors,
  keyboardKeyColors,
  handleKeyboardKeyClick,
}) => {
  return (
    <div>
      <center>
        <table className="letterbox">
          {gameGrid.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((col, colIndex) => (
                <td key={`col-${colIndex}`} style={{ backgroundColor: gameColors[rowIndex][colIndex] }}>
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </center>
      <br />
      <br />
      <center>
          <table className="keyboardrow">
            <tr>
            <KeyboardKey value="Q" onClick={() => handleKeyboardKeyClick("Q")} color={keyboardKeyColors.Q}/> 
            <KeyboardKey value="W" onClick={() => handleKeyboardKeyClick("W")} color={keyboardKeyColors.W}/> 
            <KeyboardKey value="E" onClick={() => handleKeyboardKeyClick("E")} color={keyboardKeyColors.E}/> 
            <KeyboardKey value="R" onClick={() => handleKeyboardKeyClick("R")} color={keyboardKeyColors.R}/> 
            <KeyboardKey value="T" onClick={() => handleKeyboardKeyClick("T")} color={keyboardKeyColors.T}/> 
            <KeyboardKey value="Y" onClick={() => handleKeyboardKeyClick("Y")} color={keyboardKeyColors.Y}/> 
            <KeyboardKey value="U" onClick={() => handleKeyboardKeyClick("U")} color={keyboardKeyColors.U}/> 
            <KeyboardKey value="I" onClick={() => handleKeyboardKeyClick("I")} color={keyboardKeyColors.I}/> 
            <KeyboardKey value="O" onClick={() => handleKeyboardKeyClick("O")} color={keyboardKeyColors.O}/> 
            <KeyboardKey value="P" onClick={() => handleKeyboardKeyClick("P")} color={keyboardKeyColors.P}/>
            </tr>
          </table>
          <table className="keyboardrow">
            <tr>
              <KeyboardKey value="A" onClick={() => handleKeyboardKeyClick("A")} color={keyboardKeyColors.A}/> 
              <KeyboardKey value="S" onClick={() => handleKeyboardKeyClick("S")} color={keyboardKeyColors.S}/> 
              <KeyboardKey value="D" onClick={() => handleKeyboardKeyClick("D")} color={keyboardKeyColors.D}/> 
              <KeyboardKey value="F" onClick={() => handleKeyboardKeyClick("F")} color={keyboardKeyColors.F}/> 
              <KeyboardKey value="G" onClick={() => handleKeyboardKeyClick("G")} color={keyboardKeyColors.G}/> 
              <KeyboardKey value="H" onClick={() => handleKeyboardKeyClick("H")} color={keyboardKeyColors.H}/> 
              <KeyboardKey value="J" onClick={() => handleKeyboardKeyClick("J")} color={keyboardKeyColors.J}/> 
              <KeyboardKey value="K" onClick={() => handleKeyboardKeyClick("K")} color={keyboardKeyColors.K}/> 
              <KeyboardKey value="L" onClick={() => handleKeyboardKeyClick("L")} color={keyboardKeyColors.L}/> 
            </tr>
          </table>
          <table className="keyboardrow">
            <tr>
              <KeyboardKey value="DEL" onClick={() => handleKeyboardKeyClick("DEL")} color='black'/> 
              <KeyboardKey value="Z" onClick={() => handleKeyboardKeyClick("Z")} color={keyboardKeyColors.Z}/> 
              <KeyboardKey value="X" onClick={() => handleKeyboardKeyClick("X")} color={keyboardKeyColors.X}/> 
              <KeyboardKey value="C" onClick={() => handleKeyboardKeyClick("C")} color={keyboardKeyColors.C}/> 
              <KeyboardKey value="V" onClick={() => handleKeyboardKeyClick("V")} color={keyboardKeyColors.V}/> 
              <KeyboardKey value="B" onClick={() => handleKeyboardKeyClick("B")} color={keyboardKeyColors.B}/> 
              <KeyboardKey value="N" onClick={() => handleKeyboardKeyClick("N")} color={keyboardKeyColors.N}/> 
              <KeyboardKey value="M" onClick={() => handleKeyboardKeyClick("M")} color={keyboardKeyColors.M}/> 
              <KeyboardKey value="ENTER" onClick={() => handleKeyboardKeyClick("ENTER")} color='black'/> 
            </tr>
          </table>
      </center>
      <br />
      <br />
      <center>
        {!active && (
          <button id="play_newgame_button" style={{ background: 'red' }} onClick={() => resetGame(username)}>
            NEW GAME
          </button>
        )}
      </center>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ width: '350px' }}
        toastStyle={{ backgroundColor: 'rgba(255, 0, 0, 0.8)', color: 'white' }}
      />
    </div>
  );
};

export default GameGrid;
