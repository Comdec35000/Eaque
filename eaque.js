/* -----------------------------------------------------------------------------
 * Eaque est un parser pour les commandes de bots discord.
 *
 * Il tire son nom du juge des enfers Eaque de la mythologie greque.
 * Son utilisation est libre, et sa modification est permise, cependant merci de
 * me créditer dans ce cas.
 * Son intérêt est de simplifier la création de commandes pour les bots discord
 * en automatisant la récupération d'argument sous forme de tokens. Pour cela il
 * suffit d'ajouter ce document dans votre projet npm et de le require pour
 * accéder à ses méthodes static ainsi qu'au classes qu'il propose.
 *
 * Toutes les informations pour bien débuter sont dans le README.
 *
 * AUTHOR : Com (Comdec35000)
 * VERSION : 1.1.1 2021/10/25
 * -----------------------------------------------------------------------------
*/

class ParseCommand {

  constructor(keywords, optArgs) {
    this.keywords = keywords;
    this.optArgs = optArgs;
  }

}



class CommandContext {

  constructor() {
    this.keywords = [];
    this.optArgs = {};
    this.tokens = []
  }

}

class Token {

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  matches(token) {
    return token.type === this.type && token.value === this.value;
  }

}


class Eaque {

  static tokenType = {
    KEYWORD : "KEYWORD_TOKEN",
    END : "END_TOKEN",
    OPT_ARG_START : "OPT_ARG_START_TOKEN",
    NUMBER : "NUMBER_TOKEN",
    STRING : "STRING_TOKEN",
    BOOL : "BOOL_TOKEN",
    TIME : "TIME_TOKEN",
    COLOR : "COLOR_TOKEN",
    USER : "USER_TOKEN",
    CHANNEL : "CHANNEL_TOKEN",
    ROLE : "ROLE_TOKEN"
  }

  static DIGITS = "0123456789";

  static TIMES = {
    s : 1,
    m : 60,
    h : 3600,
    d : 86400,
    M : 2592000,
    Y : 31536000
  }

  static ParseCommand = ParseCommand;
  static Token = Token;
  static CommandContext = CommandContext;

  /**
   * 
   * @param {String} args All the comand arguments unless the prefix and the command name
   * @param {ParseCommand} command An object that inherits ParseCommand to store the possible keywords and optional arguments
   * @param {Discord.Client} client The Client that reads the command
   * @param {Discord.Guild} guild The Guild where the command was posted
   * @returns {CommandContext} All the info in the Command
   */

  static readCommand(args, command, client, guild) {
    let lexer = new Lexer(args, command, client, guild);
    var tokens = lexer.makeTokens();
    let parser = new Parser(tokens, command);
    var ctx = parser.parseTokens();

    return ctx;
  }

}



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



class Lexer {

  constructor(text, command, client, guild) {
    this.text = text;
    this.command = command;
    this.client = client;
    this.guild = guild;
    this.pos = new Position(-1);
    this.currentChar;
    this.advance();
  }


  advance() {
    this.pos.advance();
    this.currentChar = this.text.charAt(this.pos.index);
  }


  makeTokens() {
    let tokens = [];

    while(this.currentChar) {

      if(this.currentChar === '\t' || this.currentChar === ' ') {
        this.advance();

      } else if(this.currentChar === '-') {
        this.advance();
        if(this.currentChar === ' ') {
          if(tokens[tokens.length - 1].type === Eaque.tokenType.STRING) {
            tokens[tokens.length - 1].value += ' -';
          } else {
            tokens.push(new Token(Eaque.tokenType.STRING, '-'));
          }
        } else {
          tokens.push(new Token(Eaque.tokenType.OPT_ARG_START, this.makeWord()));
        }

      } else if(this.currentChar == '#') {
        this.advance();
        tokens.push(new Token(Eaque.tokenType.COLOR, this.makeWord()));

      } else if(Eaque.DIGITS.includes(this.currentChar)) {
        let num = this.makeNumber();
        if(num) {
          if(tokens[tokens.length - 1] && tokens[tokens.length - 1].type === Eaque.tokenType.STRING && num.type === Eaque.tokenType.NUMBER) {
            tokens[tokens.length - 1].value += ' ' + num.value;
          } else {
            tokens.push(num);
          }
        } else {
          this.advance();
        }

      } else {

        let word = this.makeWord();
        this.createComplexToken(word, tokens);

      }



    }

    tokens.push(new Token(Eaque.tokenType.END))
    return tokens;
  }

  createComplexToken(word, tokens) {

    if(word.startsWith("<")) {
      var testWord = '' + word;
      testWord = testWord.replace('<', '').replace('>', '').replace('!', '');

      console.log(testWord);
      console.log(word);
      console.log('aaa');
      console.log(testWord.startsWith('@') || testWord.startsWith('#'));

      if(testWord.startsWith('@') || testWord.startsWith('#')) {
        if(testWord.startsWith("@&")) return tokens.push(new Token(Eaque.tokenType.ROLE, this.makeRole(testWord.replace('@&', ''))));
        if(testWord.startsWith("@")) return tokens.push(new Token(Eaque.tokenType.USER, this.makeUser(testWord.replace('@', ''))));
        if(testWord.startsWith("#")) return tokens.push(new Token(Eaque.tokenType.CHANNEL, this.makeChannel(testWord.replace('#', ''))));
      }
        
    }
    
    if (word.includes("#") && this.client.users.cache.find(u => u.tag == word)) {

      tokens.push(new Token(Eaque.tokenType.USER, this.client.users.cache.find(u => u.tag == word)));
      return;
    }

    if(word.toLowerCase() === "true" || word.toLowerCase() === "false") {
      word = word.toLowerCase();
      tokens.push(new Token(Eaque.tokenType.BOOL, word === "true"));
      return;
    }

    if(tokens[tokens.length - 1] && tokens[tokens.length - 1].type === Eaque.tokenType.STRING) {
      tokens[tokens.length - 1].value += ' ' + word
    } else {
      if(this.command.keywords.includes(word)) {
        tokens.push(new Token(Eaque.tokenType.KEYWORD, word));
      } else {
        tokens.push(new Token(Eaque.tokenType.STRING, word));
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

    while(this.currentChar && (Eaque.DIGITS + Object.keys(Eaque.TIMES) + '.').includes(this.currentChar)) {
      if(Object.keys(Eaque.TIMES).includes(this.currentChar)) {
        tokenType = 'time';
        timeMultiplier = Eaque.TIMES[this.currentChar];
      } else {
        num += this.currentChar;
      }
      this.advance()
    }

    if(num.length > 15) {
      let tryUser = this.makeUser(num)
      if(tryUser) return new Token(Eaque.tokenType.USER, tryUser);

      let tryChannel = this.makeChannel(num)
      if(tryChannel) return new Token(Eaque.tokenType.CHANNEL, tryChannel);

      let tryRole = this.makeRole(num)
      if(tryRole) return new Token(Eaque.tokenType.ROLE, tryRole);
    }

    if(tokenType == 'time') return new Token(Eaque.tokenType.TIME, num*timeMultiplier);

    return new Token(Eaque.tokenType.NUMBER, num);
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


class Parser {

  constructor(tokens, command) {
    this.tokens = tokens;
    this.command = command;
    this.ctx = new CommandContext();
  }

  parseTokens() {
    this.getKeywords();
    this.getOptArgs();
    this.getTokens();

    return this.ctx;
  }

  getKeywords() {
    this.tokens.forEach(token => {
      if(token.type === Eaque.tokenType.KEYWORD) this.ctx.keywords.push(token);
    });
  }

  getOptArgs() {

    let index = -1;
    while(index < this.tokens.length) {
      index ++;
      if(this.tokens[index] && this.tokens[index].type === Eaque.tokenType.OPT_ARG_START) {
        var optArg = [];
        var key = this.tokens[index].value;
        if(!this.command.optArgs.includes(key)) throw new Error('Eaque.ParseException.InvalidOptionalArgument : ' + key);

        while(this.tokens[index + 1] && (!(this.tokens[index + 1].type === Eaque.tokenType.OPT_ARG_START || this.tokens[index + 1].type === Eaque.tokenType.END))) {
          index ++;
          optArg.push(this.tokens[index]);
        }

        this.ctx.optArgs[key] = optArg;
      }
    }
  }

  getTokens() {
    let tokens = [];
    let stop = false;

    this.tokens.forEach(token => {
      if(token.type === Eaque.tokenType.OPT_ARG_START) {
        stop = true
      }
      if(!stop) tokens.push(token);
    });

    this.ctx.tokens = tokens

  }

}


module.exports = Eaque;
