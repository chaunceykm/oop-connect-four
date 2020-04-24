export class Column {
  constructor() {
    this.tokens = [null, null, null, null, null, null];
  }

  add(playerNumber) {
    for (let index = 5; index >= 0; index -= 1) {
        
      if (this.tokens[index] === null) {
        this.tokens[index] = playerNumber;
        break;
      }
    }
  }

  getTokenAt(rowIndex) {
    return this.tokens[rowIndex];
  }
  isFull() {
    return this.tokens[0] !== null;
  }
}
