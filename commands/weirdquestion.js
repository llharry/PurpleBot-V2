var Cmd = require('./cmd.js');
var Main = require('../app.js');
var Filesystem = require('fs');
var Config = require('../config.json');

var EXPORT = module.exports;

//THIS CODE IS A FUCKING MESS. CLEAN IT
var QUESTION_LIST = []
EXPORT.QUESTION_LIST = QUESTION_LIST;

function saveUnapproved(question,id){

    Filesystem.writeFile(__dirname + "/weirdquestion/unapproved/" + id + ".json", JSON.stringify(question), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

function saveUpdated(question, id){
    Filesystem.writeFile(__dirname + "/weirdquestion/questions/" + id + ".json", JSON.stringify(question), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

function getQuestionFromID(id){
    for(var key in QUESTION_LIST){
        var q = QUESTION_LIST[key];
        if(q.id === id){
            return q;
        }
    }
    return false;
}

function Answer(){
    this.order = {};
    this.answer = "";
}
function Question(){
    this.order = {};
    this.question = "";
    this.answers = [];
    this.id = "null"
}






function loadQuestions(){
    QUESTION_LIST.length = 0;
    var questionDir = __dirname + "/weirdquestion/questions/"
    Filesystem.readdirSync(questionDir, function(err, files) {
        if (err) {
            return console.log(err);
        }

    });
    files = Filesystem.readdirSync(questionDir)
    for(var key in files){

        f = files[key];

        data = Filesystem.readFileSync(questionDir + f, 'utf8', function (err) {
                return console.log(err);
            }
        );
        question = JSON.parse(data)
        //Fix it up:


        //Delete all answers:
        //question.answers =[]
        //saveUpdated(question,question.id)
        //console.log('Answers cleared.')

        QUESTION_LIST.push(question);

    }
}

function getRandomQuestion(askerID){
    loadQuestions();
    var culledList = []
    //Cull the list, removing questions the asker has answered
    for(var key in QUESTION_LIST){
        console.log('ayyy')
        var q = QUESTION_LIST[key];
        var previouslyAsked = false;
        for(var ansKey in q.answers){
            var a = q.answers[ansKey];

            if(a.order.userID === askerID){
                console.log('ASSKED')
                previouslyAsked = true;
            }
        }
        if(!previouslyAsked){
            culledList.push(q);
        }
    }

    var r = culledList[Math.floor(Math.random() * culledList.length)];
    if(culledList.length = 0){
        return false;
    }
    return r;

}




EXPORT.init = function(){

    var wq = new Cmd.Command;

    wq.help = "/wq | Get asked a weird question, which you may answers with /answq [your answer]. Use /askwq [your question] to add a question to the list.";
    wq.name = "wq";
    wq.entry = function(order){
        if(order.channelID === Config.commands.weirdQuestions.channel){
            q = getRandomQuestion(order.userID);
            if(!q){
                Main.bot.sendMessage({
                    to: order.channelID,
                    message: "You've answered all the questions! Feel free to submit some with /askwq [question]"
                })
                return false;
            }
            Main.bot.sendMessage({
                to: order.channelID,
                message: "Quesiton ID: " + q.id + "\n Question: " + q.question
            })
        }
    }
    Cmd.COMMAND_LIST.push(wq);




    var askwq = new Cmd.Command;

    askwq.help = "/askwq [id] [question] | Ask a weird question. It will have to be approved before being added to the list.";
    askwq.name = "askwq";
    askwq.entry = function(order){
        question = "";
        for(var key in order.args){
            question = question + order.args[key] + " ";

        }
        if(!(question === "")){
            var Q = new Question()
            Q.order = order;
            Q.question = question;
            Q.id = '' + order.userID + '-' + Date.now()

            saveUnapproved(Q, Q.id);

            console.log('Pending WQ: ' + question)
            Main.bot.sendMessage({
                to: order.channelID,
                message: "Question pending with id: " + Q.id
            })
            return;
        } else{
            Main.bot.sendMessage({
                to: order.channelID,
                message: "Use '/help askwq' for more information."
            })
        }
    }
    Cmd.COMMAND_LIST.push(askwq);


    var answq = new Cmd.Command;

    answq.help = "/answq [id] [your answer] | Your answer to the question with id [id]";
    answq.name = "answq";
    answq.entry = function(order){
        if(getQuestionFromID(order.args[0])){
            questionToAnswer = getQuestionFromID(order.args[0]) //get the question we're answering

            answer = new Answer(); //create the answer object
            answer.order = order;
            answer.answer =  ""
            answer.answer = "";

            var tmpArgs = order.args.slice() //clone args so we dont fuck it up
            tmpArgs[0] = "";//Blank the ID

            for(var key in tmpArgs){ //concat the answer string and add it to the object.
                answer.answer = answer.answer + tmpArgs[key] + " ";
            }
            questionToAnswer.answers.push(answer);
            saveUpdated(questionToAnswer,questionToAnswer.id);
            Main.bot.sendMessage({
                to: order.channelID,
                message: "Answer saved!"
            })

        } else{
            Main.bot.sendMessage({
                to: order.channelID,
                message: "No approved question has id: [" + order.args[0] + "]"
            })
        }
    }
    Cmd.COMMAND_LIST.push(answq);
}

loadQuestions()
//getRandomQuestion()
