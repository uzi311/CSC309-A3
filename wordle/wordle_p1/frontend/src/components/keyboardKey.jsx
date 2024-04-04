import React from 'react';

const KeyboardKey = ({ value, onClick, color }) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <td onClick={handleClick} style={{ backgroundColor: color }}>{value}</td>
  );
};

export default KeyboardKey;
