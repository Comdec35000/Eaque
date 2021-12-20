const EventEmitter = require('events');
const Eaque = require('../eaque.js');

class ParseCommand extends EventEmitter {

  keywords = [];

  constructor() {
    super();
  }

  registerKeyword(keyword) {

    if((typeof keyword === 'string') && (keyword.length > 0)) {

      this.keywords.push(keyword);

    } else if((keyword instanceof Array) && (keyword.length > 0)) {

      keyword.forEach((kw) => {
        if((typeof kw === 'string') && (kw.length > 0)) this.keywords.push(kw)
      });

    } else {

      throw new Error("Invalid type of keyword : " + typeof keyword);

    }

  }

  run(content, message) {

    var ctx = Eaque.readCommand(content, this, message);

    this.emit('run', message, message.client, ctx);

  }

}

module.exports = ParseCommand;