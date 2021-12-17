const Color = require('./src/class/color');
const CommandContext = require('./src/class/command_context');
const ParseCommand = require('./src/class/parse_command');
const Token = require('./src/class/token');
const { readCommand } = require('./src/eaque');

module.exports = {
    readCommand : readCommand,
    tokenType : Token.tokenType,
    ParseCommand : ParseCommand,
    CommandContext : CommandContext,
    Token : Token, 
    Color: Color
}