import React from 'react';

const GameHome = ({ onSoloClick }) => {
  return (
    <div>
      <div className="textblock"> 
        <span onClick={onSoloClick} style={{ cursor: 'pointer' }}>Solo</span>
        <br/>
        Play the classic game against yourself. 
      </div>
    </div>
  );
};

export default GameHome;
