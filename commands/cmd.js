var Config = require('../config.json')


var EXPORT = module.exports;

EXPORT.COMMAND_LIST = []
var COMMAND_LIST = EXPORT.COMMAND_LIST



EXPORT.checkIfCommand = function(string){
    //check if string is a command
    if(string[0] === Config.commands.commandPrefix){
        return true
    }
    return false;
}
EXPORT.runOrder = function(order){
    for(var key in COMMAND_LIST){
        command = COMMAND_LIST[key];
        if(command.name === order.cmd.toLowerCase()){
            command.entry(order);
        }
    }
}



EXPORT.Command = function(){
    this.name = "cmd";
    this.entry = function(){};
    this.help = "default [Command] object help";
}
EXPORT.Order = function(){
    this.user =       {};
    this.userID =     {};
    this.channelID =  {};
    this.event =      {};
    this.cmd =        "";
    this.args =       [];

    this.splitOrderArgs = function(message){
        var tmp = message.substring(1).split(" "); //Remove first char and split around spaces.
        this.cmd = tmp[0];
        this.args = tmp.splice(0,1);
    }
}
EXPORT.loadCommandFile = function(filePathFromCommands){
    console.log('Loading [' + filePathFromCommands + ']...');
    require(filePathFromCommands).init();
}
