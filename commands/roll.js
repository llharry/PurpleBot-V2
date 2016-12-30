var Cmd = require('./cmd.js');
var Main = require('../app.js');
var Utils = require(../utils.js);
var EXPORT = module.exports;

//TODO: if someone could update this to run DND notation instead that'd be great.
//eg 1d4 = 1 roll of a four sided dice, 2d8 two rolls of 8 sided etc.
EXPORT.init = function(){
    var command = new Cmd.Command;

    command.help = "Pong!";
    command.name = "ping";
    command.entry = function(order){
        message = "";
        if(Utils.IsNumeric(order.args[0])){

        } else{
            message = "Argument non numeric, Use a number!"
        }
        Main.bot.sendMessage({
            to: order.channelID,
            message: message;
        })
    }
    Cmd.COMMAND_LIST.push(command);
}
