import AllQuestionsSets from "../AllQuestionsSets";
import Board from "../Board";

class Player {
  private position = 0;
  private coins = 0;
  private isInPenaltyBox = false;

  private deprecatedIsGettingOutOfPenaltyBox = false;

  constructor(private name: string) {
    console.log(`New player added: ${name}; their place is 0 and they have 0 coins. They are NOT in the penalty box.`);
  }

  move = (roll: number): number => {
    this.position = Board.shiftPosition(this.position, roll);
    return this.position;
  };

  earnACoin = (): number => {
    this.coins += 1;
    console.log(`${this.name} earned a coin and consequently has ${this.coins} point(s).`);
    return this.coins;
  };

  playerWins = (): boolean => {
    const playerWins = this.coins === 6;
    if (playerWins) {
      console.log(`${this.name} won the game.`);
    }
    return playerWins;
  };

  private askQuestion(questions: AllQuestionsSets): void {
    const category = Board.computeCurrentCategory(this.position);
    const question = questions.ask(category);
    console.log(question);
  }

  roll = (questions: AllQuestionsSets, roll: number): void => {
    if (this.isInPenaltyBox) {
      if (roll % 2 != 0) {
        this.deprecatedIsGettingOutOfPenaltyBox = true;

        this.move(roll);

        console.log(
          `${this.name} rolled a ${roll} and might go out of the penalty box; their new position is ${this.position}.`
        );

        this.askQuestion(questions);
      } else {
        this.deprecatedIsGettingOutOfPenaltyBox = false;
        console.log(`${this.name} rolled a ${roll} and stays in penalty box (their position is ${this.position}).`);
      }
    } else {
      this.move(roll);

      console.log(`${this.name} rolled a ${roll} and their new position is ${this.position}.`);

      this.askQuestion(questions);
    }
  };

  provideWrongAnswer = (): void => {
    console.log(`${this.name} provided a wrong answer and consequently goes to the penalty box.`);
    this.isInPenaltyBox = true;
  };

  provideCorrectAnswer = (): boolean => {
    console.log(`${this.name} provided the correct answer.`);

    if (this.isInPenaltyBox) {
      if (this.deprecatedIsGettingOutOfPenaltyBox) {
        this.isInPenaltyBox = false;
        console.log(`${this.name} goes out of the penalty box.`);

        this.earnACoin();

        var winner = this.playerWins();

        return winner;
      } else {
        console.log("This should NOT happen!");
        return false;
      }
    } else {
      this.earnACoin();
      return this.playerWins();
    }
  };

  logCurrentPlayer = (): void => {
    console.log(`The new current player is ${this.name}.`);
  };
}

export default Player;
