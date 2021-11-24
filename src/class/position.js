class Position {

    constructor(idx) {
      this.index = idx;
    }
  
    advance() {
      this.index++;
      return this;
    }
  
    copy() {
      return Object.assign(new Position(), ...this);
    }
  
}

module.exports = Position;