import React from 'react';

const GameInstructs = () => {
  return (
    <div>
      <div className="textblock"> 
        Join a single player lobby, and try to guess the correct word in 6 tries. <br/><br/>
        Only a valid 5 letter word can be submitted. <br/><br/>
        After hitting ENTER, the colors of the letters will change to reflect how accurate your guess was. <br/><br/>
        Green indicates a correct letter in the correct position. <br/><br/>
        Yellow indicates a correct letter in the wrong position. <br/><br/>
        Gray indicates that letter is not in the word, but now has already been used by you. <br/><br/>
        Stats are available as well, showing how many games you have won and how many you have lost. <br/><br/>
        Good Luck!
      </div>
    </div>
  );
}

export default GameInstructs;

