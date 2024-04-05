import React from 'react';

const GameHome = ({ onSoloClick }) => {
  return (
    <div>
      <div className="textblock"> 
        <span onClick={onSoloClick} style={{ cursor: 'pointer' }}>Classic</span>
        <br/>
        Play the classic game against others. 
      </div>
    </div>
  );
};

export default GameHome;
