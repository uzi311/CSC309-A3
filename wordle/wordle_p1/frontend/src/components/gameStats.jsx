import React from 'react'

const GameStats = ({ wins, losses }) => {
  return (
    <div>
      <center style={{ fontSize: 'xx-large' }}>
          <span className="material-symbols-outlined"> check_circle </span> {wins} &nbsp;
          <span className="material-symbols-outlined"> help </span> 1 &nbsp;
          <span className="material-symbols-outlined"> cancel </span> {losses}
        </center>
    </div>
  )
}

export default GameStats





