const { tokenType } = require("./token");

class CommandContext {

    constructor() {
        this.keywords = [];
        this.tokens = [];

        this.optArgs = new Map();

        this.pos = 0;
    }

    nextToken() {
        this.pos++;
        return getToken(this.pos);
    }

    previousToken() {
        this.pos--;
        return getToken(this.pos);
    }

    getToken(pos) {
        return this.tokens[pos];
    }

    removeToken(pos) {
        let token = this.getToken(pos)
        if(token.type === tokenType.KEYWORD) this.keywords.slice(this.keywords.indexOf(token));
        delete token;
    }

}

module.exports = CommandContext;