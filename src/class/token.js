
class Token {

    constructor(type, value) {
      this.type = type;
      this.value = value;
    }
  
    matches(token) {
      return token.type === this.type && token.value === this.value;
    }
  
}

module.exports = Token;