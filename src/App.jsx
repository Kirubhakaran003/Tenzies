import React, { useState, useRef, useEffect } from "react";
import Die from "./Components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  function generateAllNewDice() {
    // Creates a new array of length 10, fills it with 0s like [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // then maps over the array to generate random integers between 1 and 6 using Math.ceil().
    // For example, it may return something like [1, 6, 4, 5, 3, 2, 1, 6, 5, 2].
    // Math.ceil(x): Rounds up a number to the nearest whole number.
    // Example: Math.ceil(4.2) → 5, Math.ceil(6.8) → 7
    // Math.floor(x): Rounds down a number to the nearest whole number.
    // Example: Math.floor(4.9) → 4, Math.floor(6.1) → 6
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function rollDice() {
    if (!gameWon) {
      setDice((prevState) =>
        prevState.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setDice(generateAllNewDice);
    }
  }

  function hold(id) {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map((die, index) => (
    <Die
      key={index}
      value={die.value}
      isHeld={die.isHeld}
      hold={() => hold(die.id)}
    />
  ));

  const buttonRef = useRef(null);

  useEffect(() => {
    if (gameWon && buttonRef.current) {
      // to check game is won and buttonRef is not null whether it is accessing the dom node
      buttonRef.current.focus();
    }
  }, [gameWon]);

  return (
    <>
      <main>
        {gameWon && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>

        <div className="dice-container">{diceElements}</div>
        <button onClick={rollDice} className="rollButton" ref={buttonRef}>
          {gameWon ? "New Game" : "Roll"}
        </button>
      </main>
    </>
  );
}
