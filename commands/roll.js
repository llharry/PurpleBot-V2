var Cmd = require('./cmd.js');
var Main = require('../app.js');
var Utils = require('../utils.js');
var EXPORT = module.exports;

//TODO: if someone could update this to run DND notation instead that'd be great.
//eg 1d4 = 1 roll of a four sided dice, 2d8 two rolls of 8 sided etc.
EXPORT.init = function(){
    var command = new Cmd.Command;

    command.help = "roll <max> | Rolls a number between 1 and <max>";
    command.name = "roll";
    command.entry = function(order){
        message = "";
        console.log(order.args[0])
        if(Utils.IsNumeric(order.args[0])){
            message = "Rolled: " + Math.ceil(Math.random() * order.args[0]);
        } else{
            message = "Argument non numeric, Use a number!";
        }
        Main.bot.sendMessage({
            to: order.channelID,
            message: message
        })
    }
    Cmd.COMMAND_LIST.push(command);
}
