function generateWinningNumber() {
  let random = Math.floor(Math.random() * (100 - 0)) + 1;
  if (random === 0) {
    return 1;
  } else {
    return random;
  }
}

function shuffle(array) {
  let m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
  if (num >= 1 && num <= 100) {
    this.playersGuess = num;
  } else {
    throw "That is an invalid guess.";
  }
  return this.checkGuess(num);
};

Game.prototype.checkGuess = function(num) {
  // check if win
  if (num === this.winningNumber) {
    return "You Win!";
  }
  if (this.pastGuesses.includes(num)) {
    return "You have already guessed that number.";
  } else {
    // check if you have guesses left
    if (this.pastGuesses.length < 4) {
      this.pastGuesses.push(num);
    } else {
      this.pastGuesses.push(num);
      return "You Lose.";
    }
  }
  // hints
  let diff = this.difference(num);
  switch (true) {
    case diff < 10:
      return "You're burning up!";
      break;
    case diff < 25:
      return "You're lukewarm.";
      break;
    case diff < 50:
      return "You're a bit chilly.";
      break;
    case diff < 100:
      return "You're ice cold!";
      break;
  }
};

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  let hintArray = [
    this.winningNumber,
    generateWinningNumber(),
    generateWinningNumber()
  ];
  return shuffle(hintArray);
};

function makeAGuess(game) {
  let guess = $("#player-input").val();
  $("#player-input").val("");
  let output = game.playersGuessSubmission(parseInt(guess, 10));
  $("#title").text(output);
  if (output !== "You have already guessed that number.") {
    $("#guess-list li:nth-child(" + game.pastGuesses.length + ")").text(guess);
    if (output === "You Win!" || output === "You Lose.") {
      $("#subtitle").text("Click the rest button to try again");
      $("#submit").prop("disabled", true);
      $("#hint").prop("disabled", true);
      if (output === "You Lose.") {
        $("#title").text(
          output + "The winning number was " + game.winningNumber
        );
      }
    } else {
      if (game.isLower()) {
        $("#subtitle").text("Guess Higher.");
      } else {
        $("#subtitle").text("Guess Lower.");
      }
    }
  }
}

$(document).ready(function() {
  let game = new Game();
  let usedHint = false;
  $("#submit").click(function() {
    makeAGuess(game);
  });
  $("#player-input").keypress(function(event) {
    if (event.which === 13) {
      makeAGuess(game);
    }
  });
  $("#reset").click(function() {
    game = newGame();
    usedHint = false;
    $("#title").text("Play the Guessing Game!");
    $("#subtitle").text("Guess a number between 1-100!");
    $(".guess").text("-");
    $("#hint, #submit").prop("disabled", false);
  });
  $("#hint").click(function() {
    let hint = game.provideHint();
    if (usedHint === false) {
      $("#title").text(
        "The Winning number is " + hint[0] + ", " + hint[1] + ", or " + hint[2]
      );
      usedHint = true;
    } else {
      $("#title").text("Only one hint per game");
    }
  });
});
