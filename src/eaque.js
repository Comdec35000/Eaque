const CommandContext = require('./class/command_context');
const ParseCommand = require('./class/parse_command');
const Lexer = require('./lexer.js');
const Parser = require('./parser.js')

class Eaque {
  
    /**
     * 
     * @param {String} args All the comand arguments unless the prefix and the command name
     * @param {ParseCommand} command An object that inherits ParseCommand to store the possible keywords and optional arguments
     * @param {Discord.Client} client The Client that reads the command
     * @param {Discord.Message} guild The Guild where the command was posted
     * @returns {CommandContext} All the info in the Command
     */
  
    static readCommand(args, command, message) {

      let lexer = new Lexer(args, command, message);
      var tokens = lexer.makeTokens();

      let parser = new Parser(tokens, command);
      var ctx = parser.parseTokens();
  
      return ctx;
    }
  
  }
  
  module.exports = Eaque;