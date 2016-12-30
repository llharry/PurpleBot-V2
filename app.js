var Discord = require('discord.io');
var Config = require('./config.json');
var Cmd = require('./commands/cmd.js');

var EXPORT = module.exports;




Cmd.loadCommandFile('./ping.js');




var bot = new Discord.Client({
    autorun: true,
    token:  Config.bot.token
});
EXPORT.bot = bot;

bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {


    if(Cmd.checkIfCommand(message)){
        order = new Cmd.Order;
        order.user      = user;
        order.userID    = userID;
        order.channelID = channelID;
        order.event     = event;
        order.splitOrderArgs(message);


        Cmd.runOrder(order);
    }
});

var COMMANDS = []
