'use strict';

//import modules
var twilio = require('./node_modules/twilio/lib');

//twilio account information (found on twilio) website
var accountSid = 'ACd23638c1417ac036b6ba46b9189f8cf2';
var authToken ='72c4891dc9fb486dff01fa40f563a764';

//create an instance of the REST API of twilio, express and body parser
var client = new twilio.RestClient(accountSid, authToken);
var express = require('express');
var bodyParser = require("body-parser");
var request = require('request');

//create instance of express
var app = express();
//incorporating body-parser to express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
/////////////////////////////////////////////////////////////////////////////////
var options = { method: 'GET',
  url: 'https://api.particle.io/v1/devices/210035000447343232363230/humidity',
  qs: { access_token: '901fe20342a45482c1617728114c4dff90b7d633' },
   };

function pollData(){
	request(options, function (error, response, body) {
  if (error) throw new Error(error);
		var data = JSON.parse(body);
		console.log(data.result);
		if(data.result>25){
			textMsgg("Humidity is "+data.result+', above threshold.',"+16479205799");
			clearInterval(periodicTask);
		}		
})};	
 
var periodicTask = setInterval(pollData, 1000);

/////////////////////////////////////////////////////////////////////////////////

//create and initialize the stack of known numbers -- unknown numbers will need to get authorization from the known number
var stack = new Array();
stack.push("+16475183093");


//incorporating body-parser to express


//router
var router = express.Router();

//function for texting Tony's number (demo purposes) with custom message
function textMsg(message)
{
    //create message
    client.messages.create({
        body: message,
        to: "+16475183093",
        from: "+16474903041"
    }, function(err, message) {
        if (err) console.log("Sorry, error");
        else
        process.stdout.write(message.body);
    });
}

//function for texting any number with a custom message
function textMsgg(message, number)
{
    client.messages.create({
        body: message,
        to: number,
        from: "+16474903041"
    }, function(err, message) {
        if (err) console.log("Sorry, error");
        else process.stdout.write(message.body);
    });
}

//function to returning a sms message
var tempNumber;
//depending on the input request, server will respond with a text message
app.post('/message', function (req, res) {
    //for debugging purposes, outputs all information on the sender
    console.log(req.body);
    console.log(req.body.From);
    //if authorization is Y
    if (req.body.Body == 'Y')
        {
            //messages both parties regarding authorization
            textMsg("The number " +  tempNumber + " has been authorized");
            stack.push(tempNumber);
            console.log("asd" + tempNumber);
            textMsgg("You have been authorized.", tempNumber);
            textMsgg("To access data, please reply with any text.", tempNumber);
            return()=>Here;
        }
    //variable for if the sender's number is recognized
    var known = false;
    //check if the sender's number is recognized
    for (var i = 0; i < stack.length; i++)
    {
        console.log(stack[i]);
        //if 
        if (req.body.From == stack[i])
        {
            known = true;
            break;
        }
    }
    //if number not know, ask for 
    if (!known)
    {
        //give notifications to both parties of the authentication request
        tempNumber = req.body.From;
        textMsg("NOTIFICATION:" + req.body.From + " from " + req.body.FromCity + ", " + req.body.FromState + " has requested access to your client's information. Authorize? \(Y/N?\)");
        
        var resp = new twilio.TwimlResponse();
          resp.message('This number is currently unrecognized by the owner. Please wait to be authorized to have access to this client.');
          res.writeHead(200, {
            'Content-Type':'text/xml'
          });
          res.end(resp.toString());
    }
    //output the data
    else
    {
      var resp = new twilio.TwimlResponse();
      resp.message('Output data here::');
      res.writeHead(200, {
        'Content-Type':'text/xml'
      });
        /*
        <Response><Message>Output data here::</Message></Response>
        */
      res.end(resp.toString());
    }
});

// a request to build.partio.io 
app.get('/humidity', function(req, res){
	request.post({
		url:'https://api.particle.io/v1/devices/210035000447343232363230/', form: {key:'humidity'}
		}, function(err,httpResponse,body){
			
		}
	);
});


//server named here, constantly listening for events
Here:var server = app.listen(8080, function() {
  console.log('Listening on port %d', server.address().port);
});

//router.get('/inbound', function(req, res){
//	var resp = new twilio.TwimlResponse();
//
//        resp.message('Welcome to !');
////        resp.message(' let us know if we can help during your development.', {
////        voice:'woman',
////        language:'en-gb'
//    });
//
//	console.log(resp.toString());
//	res.type('text/xml');
//	res.send(resp.toString());
//});

//call details, message.
app.post("/call", function(req, res){
    var twiml = new twilio.TwimlResponse();
    twiml.say("Hello World!");
    res.writeHead(200, {
        'Content-Type':'text/xml'
    });
    res.send(twiml.toString());
});


//function that calls the number under to:
function call()
{
    client.makeCall({
        to:'+16475183093', // Any number Twilio can call
        from: '+16474903041', // A number you bought from Twilio and can use for outbound communication
        url: 'http://1f359fb2.ngrok.io/call/' // A URL that produces an XML document (TwiML) which contains instructions for the call

    }, function(err, responseData) {
        //executed when the call has been initiated.
        console.log("initiated"); // outputs "+14506667788"
    });
}
//read the variable from Photon
//GET /v1/devices/210035000447343232363230/humidity


//client.applications.create({
//    friendlyName: "Phone Me",
//    voiceUrl: "http://localhost:8080/",
//    voiceMethod: "GET"
//}, function(err, app) {
//    process.stdout.write(app.sid);
//});