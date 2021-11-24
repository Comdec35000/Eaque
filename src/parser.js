const CommandContext = require("./class/command_context");


class Parser {

    constructor(tokens, command, instance) {
      this.tokens = tokens;
      this.command = command;
      this.eaqueInstance = instance;
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
        if(token.type === this.eaqueInstance.tokenType.KEYWORD) this.ctx.keywords.push(token);
      });
    }
  
    getOptArgs() {
  
      let index = -1;
      while(index < this.tokens.length) {
        index ++;
        if(this.tokens[index] && this.tokens[index].type === this.eaqueInstance.tokenType.OPT_ARG_START) {
          var optArg = [];
          var key = this.tokens[index].value;
  
          while(this.tokens[index + 1] && (!(this.tokens[index + 1].type === this.eaqueInstance.tokenType.OPT_ARG_START || this.tokens[index + 1].type === this.eaqueInstance.tokenType.END))) {
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
        if(token.type === this.eaqueInstance.tokenType.OPT_ARG_START) {
          stop = true
        }
        if(!stop) tokens.push(token);
      });
  
      this.ctx.tokens = tokens
  
    }
  
}

module.exports = Parser;