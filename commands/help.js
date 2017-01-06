var Cmd = require('./cmd.js');
var Main = require('../app.js');

var EXPORT = module.exports;

EXPORT.init = function(){
    var Help = new Cmd.Command;

    Help.help = "/help [command name]";
    Help.name = "help";
    Help.entry = function(order){
        var message = ""
        if(!(order.args[0] === undefined)){
            message = order.args[0];
            for(var k in Cmd.COMMAND_LIST){
                var c = Cmd.COMMAND_LIST[k]
                if(c.name === order.args[0]){
                    message = c.name + "   |   " + c.help;
                }

            }
        }else{//No arg[0]
            message = "Usage: /help [command name]"
        }

        Main.bot.sendMessage({
            to: order.channelID,
            message: message
        })
    }
    Cmd.COMMAND_LIST.push(Help);
}
