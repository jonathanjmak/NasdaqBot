'use strict'

// INITIALIZE WIT
var Config = require('./config')
var wit = require('./services/wit').getWit()

// SAVE USER SESSIONS
var sessions = {}

var findOrCreateSession = function (fbid) {
  var sessionId

  // check if user session exists
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      sessionId = k
    }
  })

  // create new 
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }

  return sessionId
}

var read = function (sender, message, reply) {
	if (message === 'hello') || (message === 'hey') || (message === 'hi') {
		// reply to initial greetings
		message = "Hello! I am a NASDAQ bot to help you get introduced to the market. Give me any stock ticker, and I'll tell you some general sentiments in the market for it. For example, type 'Should I buy TSLA?'"
		reply(sender, message)
	} else {
		// Let's find the user
		var sessionId = findOrCreateSession(sender)
		// Let's forward the message to the Wit.ai bot engine
		// This will run all actions until there are no more actions left to do
		wit.runActions(
			sessionId, // the user's current session by id
			message,  // the user's message
			sessions[sessionId].context, // the user's session state
			function (error, context) { // callback
			if (error) {
				console.log('oops!', error)
			} else {
				// Wit.ai ran all the actions
				// Now it needs more messages
				console.log('Waiting for further messages')

				// Based on the session state, you might want to reset the session
				// Example:
				// if (context['done']) {
				// 	delete sessions[sessionId]
				// }

				// Updating the user's current session state
				sessions[sessionId].context = context
			}
		})
	}
}



module.exports = {
	findOrCreateSession: findOrCreateSession,
	read: read,
}
© 2017 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
API
Training
Shop
Blog
About