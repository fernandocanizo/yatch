// Objective: make a Yatch self playing algorithm

// - should know how to choose which hand is better, in terms of score, on
// a final throw
// - should decide which dice to keep and which to throw again based on
// current hands made and first draw

// I'll call `hurl` a set of five dices just thrown
// And a `hand` a set of five dices chosen from scoring

const addAll = hurl => hurl.reduce((acum, v) => acum += v);

const addPoker = hurl => {
  const diceCount = countDices(hurl);
  const number = parseInt(Object.keys(diceCount)
    .filter(key => diceCount[key] > 3)[0], 10);
  return addAll(hurl.filter(v => v === number));
};

const addNumber = (hurl, number) => addAll(hurl.filter(v => v === number));

const addSixes = hurl => addNumber(hurl, 6);
const addFives = hurl => addNumber(hurl, 5);
const addFours = hurl => addNumber(hurl, 4);
const addThrees = hurl => addNumber(hurl, 3);
const addTwos = hurl => addNumber(hurl, 2);
const addOnes = hurl => addNumber(hurl, 1);

const rules = `
How to Play

A turn starts with a player rolling all five dice. The player may then set
aside any number of dice, rerolling the others, or he may stop rolling and
proceed to scoring. It is legal for a player to reroll all five dice. It is
also legal to reroll dice previously set aside.

On each turn, a player has a maximum of three rolls. After a third roll,
the player must stop rolling and proceed to scoring.

Each player will have 12 turns during the game. After each turn, the player
must enter a score in one of the rows on the score sheet.

Example: Ana rolls a 1-2-2-4-6. For her second roll, she decides to keep
the 2s and reroll the other three dice. She rolls 4-4-6, so she now has
2-2-4-4-6. She has already scored a Full House, so for her third roll, she
decides to keep the 4s and reroll the other three dice. She rolls 1-4-4 and
now has 1-4-4-4-4. She decides to score for Four of a Kind.

It is likely that a player will make a roll that does not qualify to earn
points in any of the remaining categories. In this case, the player must
mark a "0" in one of the available categories.
`
const handRule = {
  yacht: 'Five dices with same number',
  largeStraight: 'Five in a row starting with 6 (i.e. 6-5-4-3-2)',
  smallStraight: 'Five in a row starting with 5 (i.e. 5-4-3-2-1)',
  poker: 'Four of the same number',
  fullHouse: 'Three of one number, two of a different number (e.g. 4-4-4-1-1)',
  playerChoice: 'Any combination of dice',
  sixes: 'Only sixes count for scoring',
  fives: 'Only fives count for scoring',
  fours: 'Only fours count for scoring',
  threes: 'Only threes count for scoring',
  twos: 'Only twos count for scoring',
  ones: 'Only ones count for scoring',
};

const hands = Object.keys(handRule);

const descending = (a, b) => b - a;

const isYatch = hurl => hurl.every(v => v === hurl[0]);

const isStraight = (hurl, straight) => {
  for (let i = 0; i < hurl.length; i++) {
    if (hurl[i] !== straight[i]) {
      return false;
    }
  }

  return true;
};

const isLargeStraight = hurl => {
  const largeStraight = [6, 5, 4, 3, 2];
  return isStraight(hurl, largeStraight);
};

const isSmallStraight = hurl => {
  const smallStraight = [5, 4, 3, 2, 1];
  return isStraight(hurl, smallStraight);
};

const countDices = hurl => hurl.reduce((count, dice) => {
  count[dice] = count[dice] ? count[dice] + 1 : 1;
  return count;
}, {});

const isPoker = hurl => {
  const diceCount = countDices(hurl);
  return Boolean(Object.keys(diceCount).filter(key => diceCount[key] > 3)[0]);
};

const isFullHouse = hurl => {
  const diceCount = countDices(hurl);

  const dices = Object.keys(diceCount);

  if (dices.length === 2 &&
    ((diceCount[dices[0]] === 3 && diceCount[dices[1]] === 2) ||
    (diceCount[dices[0]] === 2 && diceCount[dices[1]] === 3))) {

      return true;
  }

  return false;
};

// Always can be playerChoice
const isPlayerChoice = () => true;

const isNumber = (hurl, number) =>
  Boolean(hurl.filter(dice => dice === number).length);

const isSixes = hurl => isNumber(hurl, 6);
const isFives = hurl => isNumber(hurl, 5);
const isFours = hurl => isNumber(hurl, 4);
const isThrees = hurl => isNumber(hurl, 3);
const isTwos = hurl => isNumber(hurl, 2);
const isOnes = hurl => isNumber(hurl, 1);

const handCheck = {
  yacht: isYatch,
  largeStraight: isLargeStraight,
  smallStraight: isSmallStraight,
  poker: isPoker,
  fullHouse: isFullHouse,
  playerChoice: isPlayerChoice,
  sixes: isSixes,
  fives: isFives,
  fours: isFours,
  threes: isThrees,
  twos: isTwos,
  ones: isOnes,
};

const scoring = {
  yacht: 50,
  largeStraight: 30,
  smallStraight: 30,
  poker: addPoker,
  fullHouse: addAll,
  playerChoice: addAll,
  sixes: addSixes,
  fives: addFives,
  fours: addFours,
  threes: addThrees,
  twos: addTwos,
  ones: addOnes,
};

const diceThrow = () => Math.ceil(Math.random() * 6);

const handTrow = numberOfDices => new Array(numberOfDices)
  .fill(true)
  .map(diceThrow)
  .sort(descending);

const getHandScore = (hurl, hand) => {
  if (typeof scoring[hand] === 'function') {
    return scoring[hand](hurl);
  }

  return scoring[hand];
};

const calculateBestScores = hurl => {
  const possibleHandsScore = {};

  for (let hand of hands) {
    if (handCheck[hand](hurl)) {
      possibleHandsScore[hand] = getHandScore(hurl, hand);
    }
  }

  return new Map(Object.entries(possibleHandsScore)
    .sort((a, b) => b[1] - a[1]));
};

const play = () => {
  // throw first
  const hurl1 = handTrow(5);
  console.log(hurl1);
  // calculate best score and choose hand to look for
  const bestScores = calculateBestScores(hurl1);
  console.log(bestScores);

  // select dices to keep
  // throw second
  // repeat: calculate best score and choose hand to look for
  // repeat: select dices to keep
  // throw third
  // repeat: calculate best score and select hand to withdraw from possible
  // calculate score of selected hand
  // if there's still possible hands, go again. Or better just count to 12
};

play();
