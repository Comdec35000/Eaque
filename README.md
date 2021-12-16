# Eaque

<img src='https://github.com/Comdec35000/Eaque/blob/main/assets/logo_white.svg'>

## *Introduction :*

Eaque is a free command parser made for discord commands.
His name comme from Eaque, one of the juge that dispatch dead people at the entrence of the hell in Greek Mythology.
It transforms discord command in a bunch of separated an ordinate tokens. To do so, you just have to install and require this package to acces the functions and classes of Eaque.

## *Quickstart*

Run this command to install the package.
```sh
npm install eaque
```
Then require it
```js
var Eaque = require('eaque');
```
You then have to create a class that inherits Eaque's `ParseCommand` classor instantiate it for each of your commands to register the command's keywords.
```js
var MyCommand = new Eaque.ParseCommand(['keyword1', 'keyword2']);
```

Then, run the method `Eaque#readCommand` with for arguments a `String` object that contain all the args of the command (not the prefix or  the command name), a `ParseCommand` object (your command), the [Client](https://discord.js.org/#/docs/main/stable/class/Client) of your bot and the [Guild](https://discord.js.org/#/docs/main/stable/class/Guild) where the command was called. This methods returns a CommandContext object.
Here's a quick exemple.

```js
var Discord = require('discord.js');
var Eaque = require('./eaque.js');

var Client = new Discord.Client();

var helloCommand = new Eaque.ParseCommand([]);
Client.on('message') {
    if(message.content.startsWith("!hello")) {
        var context = Eaque.readCommand(message.content.slice(6), helloCommand, Client, message.guild);
        
        if(!context.tokens[0].type === Eaque.tokenType.USER) return;
        var user = context.tokens[0];
        
        if(context.optArgs.hasOwnProperty("morning")) {
            message.channel.send("Good morning " + user.toString() + " !");
        } else if(context.optArgs.hasOwnProperty("night")) {
            message.channel.send("Good night " + user.toString() + " !");
        } else {
            message.channel.send("Hello " + user.toString() + "!");
        }
    }
}
```
The result will be :
```
!hello
-> [...]
!hello <@625369678117601290>
-> Hello @Com#1573 !
!hello <@625369678117601290> -morning
-> Good morning @Com#1573 !
```


## *Documentation*


Eaque has three classes you would use : `Eaque`, `ParseCommand` and `CommandContext`.



**`Eaque`** :

The `Eaque` class give you acces to some constants and *static* commands :
 **Attributes :** 
 
 - [Static] tokenType : All Eaque types
 - [Static] DIGITS : All the digits
 - [Static] TIMES : All the time units used by eaque

 **Methods :**
 
 - [Static] readCommand: 
 arguments : `String` arguments (the string you want to parse), `ParseCommand` command (your command), `Client` client (your bot), `Guild` guild (the guild where the command have been runned).
 return : `CommandContext`



**`ParseCommand`** :
The class `ParseCommand` represent your command and all the keywords your command uses.

 **Constructor :** 
 
 - keywords : The keywords that your command accepts



**`CommandContext`** :
A `CommandContext` represent the parsed command with the keyword that the command has, the optional args that have been added at the end of the command, and all the tokensthat the command contains

 **Attributes :** 
 
 - keywords : All the keywords used in the command put in order
 - optArgs : An object that contains all the optional arguments called in the command
 - tokens : All the token in the command



**`Token`** :

A `Token` is a value used in the command, with a type, and eventually a value. Here are all the types of tokens of Eaque :
+ `KEYWORD` : a keyword
+ `OPT_ARG_START` : the start of an optional argument
+ `NUMBER` : a number
+ `STRING` : a string
+ `BOOL` : a boolean
+ `TIME` : a duration (seconds)
+ `DATE` : a Date object
+ `COLOR` : an hex color
+ `USER` : a [User](https://discord.js.org/#/docs/main/stable/class/User)
+ `ROLE` : a [Role](https://discord.js.org/#/docs/main/stable/class/Role)
+ `CHANNEL` : a [Channel](https://discord.js.org/#/docs/main/stable/class/Channel)
+ `END` : the end of a command (appears only if the command has no optional arguments)
