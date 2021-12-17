const Color = require('./class/color');
const Position = require('./class/position');
const Token = require('./class/token.js');
const { tokenType } = require('./class/token.js');

class Lexer {

  constructor(text, command, message) {
    this.text = text;
    this.command = command;
    this.client = message.client;
    this.guild = message.guild;
    this.pos = new Position(-1);
    this.currentChar;
    this.advance();
  }


  advance() {
    this.pos.advance();
    this.currentChar = this.text.charAt(this.pos.index);
  }

  checkNext() {
    return this.text.charAt(this.pos.index + 1);
  }

  checkPrevious() {
    return this.text.charAt(this.pos.index - 1) ?? " ";
  }


  makeTokens() {
    let tokens = [];

    while(this.currentChar) {

      switch(true) {

        case /(\s|\n|\t|\0)/.test(this.currentChar) : {
          this.advance();
          break;
        }

        case (/-/.test(this.currentChar) && this.checkNext().match(/\w/) != null) : {

          this.advance();
          tokens.push(new Token(tokenType.OPT_ARG_START, this.makeWord()))
          break;

        }

        case (/§/.test(this.currentChar) && this.checkNext().match(/\w/) != null): {

          this.advance();
          tokens.push(new Token(tokenType.COLOR, new Color(this.makeWord())));
          break;

        }

        case (/<|@|#|&/.test(this.currentChar) && this.checkNext().match(/[0-9]|@|#|&/) != null) : {

            var token = this.makeMention();
            if(token) tokens.push(token);

            break;
        }

        case /[0-9]/.test(this.currentChar) : {

          var number = this.makeNumber();

          if(!number) {
            this.advance();
            break;
          }

          if(tokens[tokens.length - 1] && tokens[tokens.length - 1].type === tokenType.STRING && number.type === tokenType.NUMBER) {
            tokens[tokens.length - 1].value += ' ' + number.value;
            break;
          } 

          tokens.push(number);

          break;
        }

        default : {

          let word = this.makeWord();
          this.createComplexToken(word, tokens);
        }

      }

    }

    tokens.push(new Token(tokenType.END))
    return tokens;
  }

  createComplexToken(word, tokens) {
    
    if (word.includes("#") && this.client.users.cache.find(u => u.tag == word)) {

      tokens.push(new Token(tokenType.USER, this.client.users.cache.find(u => u.tag == word)));
      return;

    }

    if(word.toLowerCase() === "true" || word.toLowerCase() === "false") {

      word = word.toLowerCase();
      tokens.push(new Token(tokenType.BOOL, word === "true"));
      return;

    }

    if(tokens[tokens.length - 1] && tokens[tokens.length - 1].type === tokenType.STRING) {

      tokens[tokens.length - 1].value += ' ' + word

    } else {

      if(this.command.keywords.includes(word)) {

        tokens.push(new Token(tokenType.KEYWORD, word));

      } else {

        tokens.push(new Token(tokenType.STRING, word));

      }

    }
  }


  makeWord() {
    let str = '';

    while (this.currentChar && this.currentChar != ' ') {

      str += this.currentChar;
      this.advance();

    }

    return str;
  }


  makeNumber() {

    let num = '';
    let tokenType;
    let timeMultiplier;

    while(('0123456789' + Object.keys(tokenType.TIMES) + './').includes(this.currentChar)) {

      if(Object.keys(tokenType.TIMES).includes(this.currentChar)) {

        tokenType = 'time';
        timeMultiplier = tokenType.TIMES[this.currentChar];

      } else if(this.currentChar === '/') {

        tokenType = 'date';
        num += this.currentChar;

      } else {

        num += this.currentChar;

      }

      this.advance()

    }

    if(num.length > 15) {
      let tryUser = this.makeUser(num)
      if(tryUser) return new Token(tokenType.USER, tryUser);

      let tryChannel = this.makeChannel(num)
      if(tryChannel) return new Token(tokenType.CHANNEL, tryChannel);

      let tryRole = this.makeRole(num)
      if(tryRole) return new Token(tokenType.ROLE, tryRole);
    }

    if(tokenType == 'time') return new Token(tokenType.TIME, num * timeMultiplier);
    if(tokenType == 'date') {

      var copyNum = '' + num;
      copyNum = copyNum.split('/');

      if((copyNum.length == 2 || copyNum.length == 3) && (copyNum[0].length > 2 && copyNum[1].length > 2)) {
        var day = copyNum[0] + 1;
        var month = copyNum[1];
        if(copyNum[2].length > 4) var year = copyNum[2] || new Date().getFullYear();
      }

      if(day && month && year) return new Token(tokenType.DATE, new Date(year, month-1, day));

    }

    return new Token(tokenType.NUMBER, num.replace(/\//g, ''));

  }

  makeId() {

    let id = '';

    if(/!/.test(this.currentChar)) this.advance();

    while(this.currentChar.match(/[0-9]/)) {
      id += this.currentChar;
      this.advance();
    }

    return id;

  }

  makeMention() {

    var token = new Token();

    while(this.currentChar.match(/<|!|@|#|&|>/)) {

      switch(this.currentChar) {

        case '@' : {
          this.advance();
          token.value = this.makeUser(this.makeId());
          token.type = tokenType.USER;
          break;
        }

        case '#' : {
          this.advance();
          token.value = this.makeChannel(this.makeId());
          token.type = tokenType.CHANNEL;
          break;
        }

        case '&' : {
          this.advance();
          token.value = this.makeRole(this.makeId());
          token.type = tokenType.ROLE;
          break;
        }

        default : {
          this.advance();
        }

      }

    }

    if(token && token.value && token.type) return token;
    
    throw new Error('Invalid mention !');
  }

  makeUser(id) {
    return this.client.users.cache.get(id)
  }

  makeChannel(id) {
    return this.guild.channels.cache.get(id)
  }

  makeRole(id) {
    return this.guild.roles.cache.get(id)
  }
  
}

module.exports = Lexer;