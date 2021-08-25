# Eaque


## *Introduction :*
Eaque est un parser libre pour les commandes de bots discord.
Il tire son nom d'un des juges des Enfers de la mythologie greque.
Son utilisation est libre, et sa modification est permise, cependant merci de me créditer dans ce cas. Son intérêt est de simplifier la création de commandes pour les bots discord en automatisant la récupération d'argument sous forme de tokens. Pour cela il suffit d'ajouter ce document dans votre projet npm et de le require pour accéder à ses méthodes static ainsi qu'au classes qu'il propose.

## *Quickstart*

Avant toute chose, Eaque **n'est pas** un package npm, juste un module node que vous pouvez à vos projets de bots discord et le require à partir de son chemin de fichier.
```js
var Eaque = require('<path_to_file>/eaque.js');
```
Il faut ensuite créer une classe pour chacune de vos qui hérite de la classe `ParseCommand` de Eaque, ou instancier cette classe pour chacune de vos commandes, afin que les bons arguments puissent être trouvés dedans.
```js
var MyCommand = new Eaque.ParseCommand();
```
Le constructeur de cette classe prends en arguments deux `Array` d'objets `String` qui contiendront pour le premier les mots clés que prends en compte la commande, et pour le second les arguments optionels qui ont été entrés.

Il faut ensuite, avec votre bot utiliser la méthode static `Eaque#readCommand` qui prends comme arguments une chaine de caratères String (qui correspond à l'ensemble des arguments de la commande, sans le préfix ni le nom de la commande), un objet `ParseCommand`, soit votre commande, un objet [Client](https://discord.js.org/#/docs/main/stable/class/Client) (votre bot) et un objet [Guild](https://discord.js.org/#/docs/main/stable/class/Guild) qui correspond au serveur discord où la commande a été utilisée. La méthode renvoie un objet CommandContext.
Ainsi imaginons un bot simple :

```js
var Discord = require('discord.js');
var Eaque = require('./eaque.js');

var Client = new Discord.Client();

var helloCommand = new Eaque.ParseCommand([], ["morning", "night"]);
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
Ce qui donnera pour les commandes suivantes : 
```
!hello
-> [...]
!hello <@625369678117601290>
-> Hello @Com#1573 !
!hello <@625369678117601290> -morning
-> Good morning @Com#1573 !
```


## *Documentation*

Le module Eaque propose trois classe : `Eaque`, `ParseCommand` et `CommandContext`.

**`Eaque`** :
La classe Eaque propose surtout des attributs et des méthodes *static* :
> **Attributs :** 
> -[Static] tokenType : L'ensemble des types de tokens du Lexer d'Eaque
> -[Static] DIGITS : l'ensemble des chiffres
> -[Static] TIMES : l'ensemble des unitées de temps de durés utilisés par Eaque avec en valeurs leur équivalent en secondes

> **Méthodes :**
> -[Static] readCommand : 
> arguments : String arguments (la chaine de caractère à parse), ParseCommand command (votre commande), Client client (votre bot), Guild guild (le serveur où la commande a été utilisée).
> return : CommandContext


**`ParseCommand`** :
La classe `ParseCommand` est la classe servant à créer vos commandes, soit en l'instanciant, soit en créant une classe qui en hérite.
> **Constructeur :** 
> -keywords : L'ensemble des mots clés qui pourront être utilisés dans votre commande
> -optArgs : l'ensemble des arguments optionel utilisables dans votre commande (si un argument optionel qui n'est pas dans cette liste est utilisé cela renverra une erreur)

**`CommandContext`** :
La classe `CommandContext` est la classe de l'objet renvoyé par la méthode `Eaque#readCommand`. Elle contient les mots clés utilisés par la commande, l'ensemble des arguments utilisés et la liste des arguments optionels utilisés et la valeur que l'utilisateur y a adjoint.
> **Attributs :** 
> -keywords : L'ensemble des mots clés qui ont été utilisés dans la commande, dans l'ordre de leur utilisation
> -optArgs : Un objet contenant en clé les arguments optionels utilisés dans la commande, et en valeur un `Array` contenant tout les tokens que l'utilisateur a mit par la suite.
> -tokens : L'ensemble des tokens de la commande sauf ceux liés aux arguments optionels, dans l'ordre.

**`Token`** :
Les `Token` sont les objets utilisés par Eaque pour représenter un argument de la commande. Ils ont tous un type, et parfois une valeur. les types possibles sont :
+ `KEYWORD` : un mot clé
+ `OPT_ARG_START` : le début d'un argument optionel
+ `NUMBER` : un nombre
+ `STRING` : une chaîne de caractère
+ `BOOL` : un boolean
+ `TIME` : une durée (en secondes)
+ `COLOR` : une couleur hexadécimale
+ `USER` : un [User](https://discord.js.org/#/docs/main/stable/class/User)
+ `ROLE` : un [Role](https://discord.js.org/#/docs/main/stable/class/Role)
+ `CHANNEL` : un [Channel](https://discord.js.org/#/docs/main/stable/class/Channel)
+ `END` : la fin de la commande **si elle n'a pas d'arguments optionels**

> **Attributs :** 
> -type : Le type de token (voir ci dessus)
> -value : La valeur du token
