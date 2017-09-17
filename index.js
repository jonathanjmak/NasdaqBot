// 'use strict'

// const express = require('express');
// const crypto = require('crypto');
// const bodyParser = require('body-parser');
// const request = require('request');
// const fetch = require('node-fetch');
// const app = express();

// let Wit = null;
// let log = null;
// try {
//   // if running from repo
//   Wit = require('../').Wit;
//   log = require('../').log;
// } catch (e) {
//   Wit = require('node-wit').Wit;
//   log = require('node-wit').log;
// }

// app.set('port', (process.env.PORT || 5000))

// const WIT_TOKEN = process.env.WIT_TOKEN;
// const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
// const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

// // Process application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))

// // Process application/json
// app.use(bodyParser.json())

// // Index route
// app.get('/', function (req, res) {
// 	res.send('Hello world, I am a chat bot')
// })

// const fbMessage = (id, text) => {
//   const body = JSON.stringify({
//     recipient: { id },
//     message: { text },
//   });
//   const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
//   return fetch('https://graph.facebook.com/me/messages?' + qs, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body,
//   })
//   .then(rsp => rsp.json())
//   .then(json => {
//     if (json.error && json.error.message) {
//       throw new Error(json.error.message);
//     }
//     return json;
//   });
// };

// // ----------------------------------------------------------------------------
// // Wit.ai bot specific code

// // This will contain all user sessions.
// // Each session has an entry:
// // sessionId -> {fbid: facebookUserId, context: sessionState}
// const sessions = {};

// const findOrCreateSession = (fbid) => {
//   let sessionId;
//   // Let's see if we already have a session for the user fbid
//   Object.keys(sessions).forEach(k => {
//     if (sessions[k].fbid === fbid) {
//       // Yep, got it!
//       sessionId = k;
//     }
//   });
//   if (!sessionId) {
//     // No session found for user fbid, let's create a new one
//     sessionId = new Date().toISOString();
//     sessions[sessionId] = {fbid: fbid, context: {}};
//   }
//   return sessionId;
// };

// // Our bot actions
// const actions = {
//   send({sessionId}, {text}) {
//     // Our bot has something to say!
//     // Let's retrieve the Facebook user whose session belongs to
//     const recipientId = sessions[sessionId].fbid;
//     if (recipientId) {
//       // Yay, we found our recipient!
//       // Let's forward our bot response to her.
//       // We return a promise to let our bot know when we're done sending
//       return fbMessage(recipientId, text)
//       .then(() => null)
//       .catch((err) => {
//         console.error(
//           'Oops! An error occurred while forwarding the response to',
//           recipientId,
//           ':',
//           err.stack || err
//         );
//       });
//     } else {
//       console.error('Oops! Couldn\'t find user for session:', sessionId);
//       // Giving the wheel back to our bot
//       return Promise.resolve()
//     }
//   },
//   // You should implement your custom actions here
//   // See https://wit.ai/docs/quickstart
// };

// // Setting up our bot
// const wit = new Wit({
//   accessToken: WIT_TOKEN,
//   actions,
//   logger: new log.Logger(log.INFO)
// });

// // Starting our webserver and putting it all together
// app.use(({method, url}, rsp, next) => {
//   rsp.on('finish', () => {
//     console.log(`${rsp.statusCode} ${method} ${url}`);
//   });
//   next();
// });
// app.use(bodyParser.json({ verify: verifyRequestSignature }));


// // for Facebook verification
// app.get('/webhook/', function (req, res) {
// 	if (req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
// 		console.log("Validating webhook");
// 		res.status(200).send(req.query['hub.challenge']);
// 	}
// 	res.send('Error, wrong token')
// })

//   app.post('/webhook/', function (req, res) {
//     let messaging_events = req.body.entry[0].messaging
//     for (let i = 0; i < messaging_events.length; i++) {
//       let event = req.body.entry[0].messaging[i]
//       let sender = event.sender.id
//       if (event.message && event.message.text) {
//   	    let text = event.message.text
//   	    if (text === 'Generic') {
//   		    sendGenericMessage(sender)
//   		    continue
//   	    }
//   	    sendTextMessage(sender, "Wit api response :" + text.substring(0, 200))
//       }
//       if (event.postback) {
//   	    let text = JSON.stringify(event.postback)
//   	    sendTextMessage(sender, "Postback received: "+text.substring(0, 200), FB_PAGE_ACCESS_TOKEN)
//   	    continue
//       }
//     }
//     res.sendStatus(200)
//   })

// // Spin up the server
// app.listen(app.get('port'), function() {
// 	console.log('running on port', app.get('port'))
// })

// function sendTextMessage(sender, text) {
//     let messageData = { text:text }
//     request({
// 	    url: 'https://graph.facebook.com/v2.6/me/messages',
// 	    qs: {access_token:token},
// 	    method: 'POST',
// 		json: {
// 		    recipient: {id:sender},
// 			message: messageData,
// 		}
// 	}, function(error, response, body) {
// 		if (error) {
// 		    console.log('Error sending messages: ', error)
// 		} else if (response.body.error) {
// 		    console.log('Error: ', response.body.error)
// 	    }
//     })
// }

// function sendGenericMessage(sender) {
//     let messageData = {
// 	    "attachment": {
// 		    "type": "template",
// 		    "payload": {
// 				"template_type": "generic",
// 			    "elements": [{
// 					"title": "First card",
// 				    "subtitle": "Element #1 of an hscroll",
// 				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
// 				    "buttons": [{
// 					    "type": "web_url",
// 					    "url": "https://www.messenger.com",
// 					    "title": "web url"
// 				    }, {
// 					    "type": "postback",
// 					    "title": "Postback",
// 					    "payload": "Payload for first element in a generic bubble",
// 				    }],
// 			    }, {
// 				    "title": "Second card",
// 				    "subtitle": "Element #2 of an hscroll",
// 				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
// 				    "buttons": [{
// 					    "type": "postback",
// 					    "title": "Postback",
// 					    "payload": "Payload for second element in a generic bubble",
// 				    }],
// 			    }]
// 		    }
// 	    }
//     }
//     request({
// 	    url: 'https://graph.facebook.com/v2.6/me/messages',
// 	    qs: {access_token:token},
// 	    method: 'POST',
// 	    json: {
// 		    recipient: {id:sender},
// 		    message: messageData,
// 	    }
//     }, function(error, response, body) {
// 	    if (error) {
// 		    console.log('Error sending messages: ', error)
// 	    } else if (response.body.error) {
// 		    console.log('Error: ', response.body.error)
// 	    }
//     })
// }


'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN



app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})


app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
  	    let text = event.message.text
  	    if (text === 'AAPL') {
  		    sendGenericMessage(sender)
  		    continue
  	    }
  	    sendTextMessage(sender, "Wit received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
  	    let text = JSON.stringify(event.postback)
  	    sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
  	    continue
      }
    }
    res.sendStatus(200)
  })


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:FB_PAGE_ACCESS_TOKEN},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}


/** CARD VIEW FOR GENERIC **/
function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "AAPL",
				    "subtitle": "APPLE STOCK",
				    "image_url": "http://cdn.osxdaily.com/wp-content/uploads/2010/10/giant-apple-logo-bw.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "http://www.nasdaq.com/symbol/aapl",
					    "title": "AAPL"
				    }, {
					    "type": "postback",
					    "title": "More Info",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Element #2 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:FB_PAGE_ACCESS_TOKEN},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}


