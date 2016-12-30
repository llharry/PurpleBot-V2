var Cmd = require('./cmd.js');
var Main = require('../app.js');

var EXPORT = module.exports;

EXPORT.init = function(){
    var command = new Cmd.Command;

    command.help = "Pong!";
    command.name = "ping";
    command.entry = function(order){
        Main.bot.sendMessage({
            to: order.channelID,
            message: "Pong!"
        })
    }
    Cmd.COMMAND_LIST.push(command);
}
