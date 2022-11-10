const $ = (id) => {
  return document.getElementById(id);
};

let playButton = $("play");
let resultDiv = $("result");
let p1NameDiv = $("p1Name");
let p2NameDiv = $("p2Name");
let p1HealthDiv = $("p1Health");
let p2HealthDiv = $("p2Health");

const updateGame = (p1, p2) => {
  p1NameDiv.innerText = p1.name;
  p2NameDiv.innerText = p2.name;
  p1HealthDiv.innerText = p1.health;
  p2HealthDiv.innerText = p2.health;

  if (p1.health <= 0 || p2.health <= 0) {
    game.isOver = true;
    game.declareWinner(game.isOver, p1, p2);
  }
};

class Player {
  constructor(name, health, attackDamage) {
    this.name = name;
    this.health = health;
    this.attackDmg = attackDamage;
  }

  strike(player, enemy, attackDmg) {
    let damageAmount = Math.floor(Math.random() * attackDmg);
    if (enemy.health - damageAmount < 0) {
      enemy.health = 0;
    } else {
      enemy.health -= damageAmount;
    }

    updateGame(p1, p2);
    console.log(
      `${player.name} attacks ${enemy.name} for ${damageAmount} damage!`
    );
  }

  heal(player, enemy) {
    let hpAmount = Math.floor(Math.random() * 5);
    if (player.health + hpAmount > 100) {
      player.health = 100;
    } else {
      player.health += hpAmount;
    }

    updateGame(p1, p2);
    console.log(`${player.name} heals for ${hpAmount} HP!`);
  }
}

class Game {
  constructor() {
    this.isOver = false;
  }

  declareWinner(isOver, p1, p2) {
    let message = "";

    if (isOver && p2.health <= 0) {
      message = `${p1.name} WINS!`;
    } else if (isOver && p1.health <= 0) {
      message = `${p2.name} WINS!`;
    }

    $("victory").play();
    resultDiv.innerText = message;
  }

  reset(p1, p2) {
    p1.health = 100;
    p2.health = 100;
    resultDiv.innerText = "";
    this.isOver = false;
    updateGame(p1, p2);
  }

  play(p1, p2) {
    this.reset(p1, p2);
    while (!this.isOver) {
      p1.heal(p1, p2);
      p2.heal(p2, p1);
      p1.strike(p1, p2, p1.attackDmg);
      p2.strike(p2, p1, p2.attackDmg);
    }

    this.declareWinner(this.isOver, p1, p2);
  }
}

let p1 = new Player("Player 1", 100, 7);
let p2 = new Player("Player 2", 100, 7);

let game = new Game();
updateGame(p1, p2);

playButton.addEventListener("click", () => game.play(p1, p2));

// ** Player 1 Controls **
document.addEventListener("keydown", function (e) {
  if (e.key == "q" && p2.health > 0 && game.isOver == false) {
    p1.strike(p1, p2, p1.attackDmg);
    $("p1attack").play();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key == "a" && p1.health > 0 && game.isOver == false) {
    p1.heal(p1, p2);
    $("p1heal").play();
  }
});

// ** Player 2 Controls **
document.addEventListener("keydown", function (e) {
  if (e.key == "p" && p1.health > 0 && game.isOver == false) {
    p2.strike(p2, p1, p2.attackDmg);
    $("p2attack").play();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key == "l" && p2.health > 0 && game.isOver == false) {
    p2.heal(p2, p1);
    $("p2heal").play();
  }
});
