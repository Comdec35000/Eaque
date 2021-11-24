const CommandContext = require('./src/class/command_context');
const ParseCommand = require('./src/class/parse_command');
const Token = require('./src/class/token');
const { tokenType, readCommand } = require('./src/eaque');

module.exports = {
    readCommand : readCommand,
    tokenType : tokenType,
    ParseCommand : ParseCommand,
    CommandContext : CommandContext,
    Token : Token, 
}