const express = require("express");
const cors = require("cors")

const PORT = process.env.PORT || 3001;

let state = {
  nextFigure: 'circle',
  won: 'none',
  gameState: [0,0,0,0,0,0,0,0,0],
}

let moveCounter = 0;

const checkForWin = () => {
  return(checkForLine(0,1,2) || checkForLine(0,3,6) || checkForLine(0,4,8) || checkForLine(1,4,7) || checkForLine(2,5,8) || checkForLine(2,4,6) || checkForLine(3,4,5) || checkForLine(6,7,8));
}

const checkForLine = (number1, number2, number3) => {
  return((state.gameState[number1] === 'circle' && state.gameState[number2] === 'circle' && state.gameState[number3] === 'circle') || (state.gameState[number1] === 'x' && state.gameState[number2] === 'x' && state.gameState[number3] === 'x'));
}

const app = express();
app.use(cors());

app.get("/game", (req, res) => {
  res.json(state);
});

app.post("/move", (req, res) => {
  const index = req.query.index;
  if(state.gameState[req.query.index] === 0) {
    moveCounter ++;
    state.gameState[index] = state.nextFigure;
    if (checkForWin()) {
      state.won = state.nextFigure;
    }
    else if (moveCounter == 9) {
      state.won = 'draw';
    }
    state.nextFigure = state.nextFigure === 'circle' ? 'x' : 'circle';
  }
  res.json(state);
})

app.post("/reset", (req, res) => {
  const nextFigure = state.nextFigure
  moveCounter = 0;
  state = {
    nextFigure: nextFigure,
    won: 'none',
    gameState: [0,0,0,0,0,0,0,0,0],
  }
  res.json(state);
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
