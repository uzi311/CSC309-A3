import React from 'react';

const GameUsername = ({ username }) => {
  return (
    <div>
      <div className="ui_top" id="ui_username">
        <h2>Username: <span id="username">{username}</span></h2>
      </div>
    </div>
  );
}

export default GameUsername;
