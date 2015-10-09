NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]; // polifill for the for..of.. loop

import React from 'react';

let gameHeight = window.innerHeight;
let gameWidth = window.innerWidth;
let heroHeight = 50;
let weaponFireState = false;
let velocity = 10;

const initalGameWidth = gameWidth;

/**
* Evil Class
**/
class Evils extends React.Component {
  constructor(props) {
    super(props);

    let width = 100;
    let height = 100;

    this.state = {
      height: height,
      width: width,
      color: 'red',
      leftRand: Math.round((Math.random() * (gameWidth - 0) + 0) - width / 2)
    };
  }
  getStyles() {
    return {
      position: 'absolute',
      background: this.state.color,
      height: this.state.height + 'px',
      width: this.state.width + 'px',
      left: this.state.leftRand + 'px'
    };
  }
  render() {
    return (<div className='evils' style={this.getStyles()} data={this.props.data}></div>);
  }
}

/**
* Hero Class
**/
class Hero extends React.Component {
  constructor(props) {
    super(props);

    let width = 50;
    let heroHeight = 50;

    this.state = {
      height: heroHeight,
      width: width,
      color: 'green',
      left: 50
    };
  }
  getStyles() {
    return {
      position: 'absolute',
      background: this.state.color,
      height: this.state.height + 'px',
      width: this.state.width + 'px',
      left: this.state.left + '%',
      bottom: 0
    };
  }
  render() {
    return (<div className='hero' style={this.getStyles()}></div>);
  }
}

/**
* Weapon Class
**/
class Weapon extends React.Component {
  constructor(props) {
    super(props);

    let width = 10;
    let height = 10;

    this.state = {
      height: height,
      width: width,
      color: 'black',
      left: 50
    };
  }
  getStyles() {
    return {
      display: 'none',
      position: 'absolute',
      background: this.state.color,
      height: this.state.height + 'px',
      width: this.state.width + 'px',
      left: this.state.left + '%',
      bottom: heroHeight + 'px'
    };
  }
  render() {
    return (<div className='weapon' style={this.getStyles()}></div>);
  }
}

/**
* GameComponent Class
**/
class GameComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      evilsNumber: [1]
    };
  }
  gameEngineHelper() {
    let evils = document.querySelectorAll('.evils');
    let weapon = document.querySelector('.weapon');

    /**
    * Setting the weapon stuffs
    **/
    if(weaponFireState === true) {
      let weaponBottom = parseInt(weapon.style.bottom);
      if(weaponBottom < gameHeight) {
        weaponBottom += velocity;
        weapon.style.bottom = weaponBottom + 'px';
      } else {
        weapon.style.bottom = heroHeight + 'px';
        weapon.style.display = 'none';
        weaponFireState = false;
      }
    }

    /**
    * evil Movement
    **/
    for(let evil of evils) {
      let evilLeft = evil.offsetLeft;
      //console.log('gameWidth ' + initalGameWidth);
      //console.log(evilLeft);
      if(gameWidth > evilLeft) {
        if(evilLeft >= initalGameWidth - 100) {
          gameWidth = 0;
        }
        evilLeft += (velocity - 5);
      } else {
        if(evilLeft <= 10) {
          gameWidth = initalGameWidth - 50;
        }
        evilLeft -= (velocity - 5);
      }
      evil.style.left = evilLeft + 'px';

      /**
      * Collison detection
      **/
      let weaponLeftCalc = weapon.offsetLeft;
      let weaponWidth = parseInt(weapon.style.width);
      let evilWidth = parseInt(evil.style.width);

      let evilHeight = parseInt(evil.style.height);
      let weaponBottomCalc = gameHeight - parseInt(weapon.style.bottom);


      if(weaponLeftCalc > evilLeft && weaponLeftCalc < evilLeft + evilWidth &&
         0 < weaponBottomCalc && evilHeight > weaponBottomCalc) {
        console.log('Collison detected');

        evil.parentNode.removeChild(evil);
        //create another

        weapon.style.bottom = heroHeight + 'px';
        weapon.style.display = 'none';
        weaponFireState = false;
      }
    }
  }
  handleKeyboard(event) {

    // needs to be deleted
    if(document.querySelector('.game') !== null) {
      //React.render(React.createElement(Hero, {}), document.getElementsByClassName('game')[0]);
      // http://stackoverflow.com/questions/29017485/call-method-on-es6-class-instance-of-react-component
      //let game = document.querySelector('.game');
      //let newD = document.createElement('<Evils />');
      //game.appendChild(newD);
    }

    let keyCode = event.which;
    switch(keyCode) {
      case 37:
        this.heroMovement('left');
        break;
      case 39:
        this.heroMovement('right');
        break;
       case 32:
        this.shoot();
        break;
    }
  }
  heroMovement(direction) {
    let hero = document.querySelector('.hero');
    let heroLeft = hero.offsetLeft;
    if(direction === 'left') {
      if(heroLeft <= 0)
        return;

      heroLeft -= velocity;
    } else {
      if(heroLeft >= initalGameWidth - 50)
        return;

      heroLeft += velocity;
    }
    hero.style.left = heroLeft + 'px';
  }
  shoot() {
    if(weaponFireState === false) {
      let hero = document.querySelector('.hero');
      let weapon = document.querySelector('.weapon');
      let weaponPos = hero.offsetLeft + (hero.offsetWidth / 2 - 10);
      weapon.style.left = weaponPos + 'px';
      weapon.style.display = 'block';
      weaponFireState = true;
    }
  }
  gameEngine() {
    this.gameEngineHelper();
    window.requestAnimationFrame(this.gameEngine.bind(this));
  }
  componentDidMount() {
    /**
    * In this function document and window fn should be created
    **/
    window.addEventListener('load', this.gameEngine.bind(this));
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  render() {
    return(
    <div className='game'>
        {
          this.state.evilsNumber.map(function(evilID) {return <Evils data={evilID} />;})
        }
        <Hero />
        <Weapon />
      </div>
    );
  }
}

React.render(<GameComponent />,
  document.body
);