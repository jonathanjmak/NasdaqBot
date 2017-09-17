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
	if ((message === 'hello') || (message === 'hey') || (message === 'hi')) {
		// reply to initial greetings
		message = "Hello! I am a NASDAQ bot to help you get introduced to the market. Give me any stock ticker, and I'll tell you some general sentiments in the market for it. For example, type 'Should I buy TSLA?'"
		reply(sender, message)
	} else {
		var sessionId = findOrCreateSession(sender)
		// send to Wit
		wit.runActions(
			sessionId, // current session by id
			message,  // user message
			sessions[sessionId].context, // session state
			function (error, context) { // callback
			if (error) {
				console.log('Sorry about that!', error)
			} else {
				// Wit.ai ran all the actions
				// Now it needs more messages
				console.log('Anything else?')

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