'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

// SET UP CONSTANTS
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	
    var breakdown=getStockData("AMZN");
    res.send(breakdown);
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
  	    text = text.toUpperCase()
				sendTextMessage(sender, "You asked for " + text.substring(0, 200) + ".")
                var response1=getStockData(text);
                sendTextMessage(sender,response1);
				/*
                if (text === 'FB') {
					sendTextMessage(sender, "Here are some stats on FB (Facebook): One Year Target: $190, Year High-Low: $175.49 / $113.55, P/E Ratio: 39.1, Earnings Per Share: $4.39, Beta: 1.48, Current Price: $170.88, 50 Day Moving Average: $154.49") 
				}
				if (text === 'GOOG') {
					sendTextMessage(sender, "Here are some stats on GOOG (Google/Alphabet Class C): One Year Target: $1050, Year High-Low: $988.25 / $727.54, P/E Ratio: 33.4, Earnings Per Share: $27.55, Beta: 1.32, Current Price: $924.66, 50 Day Moving Average: $941.39") 
				}
				if (text === 'AMZN') {
					sendTextMessage(sender, "Here are some stats on AMZN (Amazon): One Year Target: $1171, Year High-Low: $1083.31 / $710.10, P/E Ratio: 250.45, Earnings Per Share: $3.94, Beta: 1.53, Current Price: $992.57, 50 Day Moving Average: $988.66") 
				}
          */
  		    	sendStockMessage(sender, text)
  		     	continue
      }
      if (event.postback) {
  	    let text = JSON.stringify(event.postback)
  	    sendTextMessage(sender, "Postback received: " + text.substring(0, 200), FB_PAGE_ACCESS_TOKEN)
  	    continue
      }
    }
    res.sendStatus(200)
  })


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.8/me/nlp_configs?nlp_enabled=$NLP_ENABLED',
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


function getStockData(symbol){
    
    //var sleep=require('system-sleep');
	var dataTools=require('./data-request.js');
    var jsonFile=require('jsonfile');
    var file='./scraped.json';
    dataTools.webScrape(symbol)
    var stockInfo=jsonFile.readFileSync(file);
    
    //Debuggable
    console.log(stockInfo);
    
	return ("Company: "+symbol+"<br>One Year Target ($):" +stockInfo.oneYearTarget+" <br>Year High and Low ($): "+stockInfo.yearHighLow+"<br>PE Ratio: "+stockInfo.peRatio+"<br>Earnings per share ($): "+stockInfo.earningsPerShare+"<br>Beta (Risk) Value: "+stockInfo.beta);
    
}


function sendStockMessage(sender, text) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": text.toUpperCase(),
				    "subtitle": "Should you buy/sell/hold?",
				    "image_url": "http://www.nasdaqomx.com/static/com-web-sources/logos/nasdaq-logo-share.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "http://www.nasdaq.com/symbol/" + text,
					    "title": text.toUpperCase() + " Statistics"
				    }, {
					    "type": "element_share",
					     "share_contents": { 
        					"attachment": {
          						"type": "template",
          							"payload": {
            							"template_type": "generic",
            							"elements": [
              							{
                							"title": "Should you buy " + text.toUpperCase() + "?",
                							"image_url": "http://www.nasdaqomx.com/static/com-web-sources/logos/nasdaq-logo-share.png",
                							"default_action": {
                  								"type": "web_url",
                  								"url": "http://www.nasdaq.com/symbol/" + text
                						},
                		"buttons": [
                  		{
                    		"type": "web_url",
                    		"url": "https://m.me/nasdaqbot", 
                    		"title": "Check out the NASDAQ Bot!"
                  }
                ]
              }
            ]
          }
        }
      }
				    }],
			    }, {
				    "title": "Summary",
				    "subtitle": "View important points for " + text.toUpperCase(),
				    "image_url": "http://www.nasdaqomx.com/static/com-web-sources/logos/nasdaq-logo-share.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "http://www.nasdaq.com/symbol/" + text.toLowerCase() + "/recommendations",
					    "title": "View Summary"
				    }],
			    }]
		    }
	    }
    }

    request({
	    url: 'https://graph.facebook.com/v2.8/me/nlp_configs?nlp_enabled=$NLP_ENABLED',
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