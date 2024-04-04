import React, { useState } from 'react';

const Header = ({ activeItem, onHeaderClick }) => {

  const handleItemClick = (itemName) => {
    onHeaderClick(itemName);
  };

  return (
    <div>
      <header>
        <nav>
          <span className="alignleft"></span>
          <span className="aligncenter">
            <a onClick={() => handleItemClick('home')} className={activeItem === 'home' ? 'active' : ''} name="ui_home" style={{ fontSize: 'x-large', textDecoration: 'underline', cursor: 'pointer' }}>309DLE</a>
          </span>
          <span className="alignright">
            <a onClick={() => handleItemClick('username')} className={activeItem === 'username' ? 'active' : ''} name="ui_username"><span className="material-symbols-outlined"> person </span></a>
            <a onClick={() => handleItemClick('grid')} className={activeItem === 'grid' ? 'active' : ''} name="ui_play"><span className="material-symbols-outlined"> play_circle </span></a>
            <a onClick={() => handleItemClick('stats')} className={activeItem === 'stats' ? 'active' : ''} name="ui_stats"><span className="material-symbols-outlined"> leaderboard </span></a>
            <a onClick={() => handleItemClick('instructs')} className={activeItem === 'instructs' ? 'active' : ''} name="ui_instructions"><span className="material-symbols-outlined"> help </span></a>
          </span>
        </nav>
      </header>
    </div>
  );
};

export default Header;
