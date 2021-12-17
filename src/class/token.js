
class Token {

  static tokenType = {
    KEYWORD : "KEYWORD_TOKEN",
    END : "END_TOKEN",
    OPT_ARG_START : "OPT_ARG_START_TOKEN",
    NUMBER : "NUMBER_TOKEN",
    STRING : "STRING_TOKEN",
    BOOL : "BOOL_TOKEN",
    TIME : "TIME_TOKEN",
    DATE : "DATE_TOKEN",
    COLOR : "COLOR_TOKEN",
    USER : "USER_TOKEN",
    CHANNEL : "CHANNEL_TOKEN",
    ROLE : "ROLE_TOKEN"
  }

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  matches(token) {
    return token.type === this.type && token.value === this.value;
  }
  
}

module.exports = Token;