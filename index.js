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
	// res.send('Hello world, I am Nashaq!')
	var dataTools=require('./data-request.js');
    var symbol="AAPL"
    dataTools.getData(symbol)
    var data=JSON.parse(localStorage.getItem('myStorage'));
    
    //Calculates the moving avg
    var mAvg=dataTools.movingAverage(data,50);

    //Retrieves the data from the returned array from moving average
    var moAvg=mAvg[0];
    var nInt=mAvg[1];
    var symbol=data.Symbol;

    //Debuggable
    console.log(data.Symbol);
    console.log(moAvg);
    //console.log(moAvg.length);
    //console.log(nInt);

    dataTools.webScrape(data.Symbol);
    var stockInfo=JSON.parse(localStorage.getItem('myInfo'))
   

    //Debuggable
    console.log(stockInfo);
    
	res.send("Company: "+symbol+"<br>One Year Target ($):" +stockInfo.oneYearTarget+" <br>Year High and Low ($): "+stockInfo.yearHighLow+"<br>PE Ratio: "+stockInfo.peRatio+"<br>Earnings per share ($): "+stockInfo.earningsPerShare+"<br>Beta (Risk) Value: "+stockInfo.beta)
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
				if (text === 'FB') {
					sendTextMessage(sender, "Here are some stats on FB (Facebook): One Year Target: $190, Year High-Low: $175.49 / $113.55, P/E Ratio: 39.1, Earnings Per Share: $4.39, Beta: 1.48, Current Price: $170.88") 
					sendTextMessage(sender, "50 Day Moving Average: [148.52300000000002,148.75240000000002,149.00979999999998,149.27939999999998,149.58919999999998,149.87320000000003,150.0564,150.302,150.4774,150.62099999999998,150.716,150.8134,150.86,150.95759999999999,151.0736,151.174,151.3028,151.4324,151.5958,151.77339999999998,152.02579999999998,152.2874,152.56839999999997,152.85119999999998,153.17039999999997,153.46939999999998,153.77779999999996,154.19099999999995,154.74299999999997,155.17479999999995,155.61079999999995,156.03199999999998,156.44239999999996,156.83399999999997,157.23439999999994,157.61639999999994,157.99239999999998,158.31119999999999,158.64219999999995,158.98499999999996,159.33239999999995,159.67619999999997,159.95199999999994,160.20599999999996,160.56959999999995,160.99359999999996,161.35419999999993,161.70399999999995,162.03439999999992,162.36639999999997]")
				}
				if (text === 'GOOG') {
					sendTextMessage(sender, "Here are some stats on GOOG (Google/Alphabet Class C): One Year Target: $1050, Year High-Low: $988.25 / $727.54, P/E Ratio: 33.4, Earnings Per Share: $27.55, Beta: 1.32, Current Price: $924.66") 
					sendTextMessage(sender, "50 Day Moving Average: [938.6591999999998,939.6381999999998,940.3259999999999,941.2631999999998,942.3542,942.8367999999998,943.4619999999999,944.0764,944.6554,945.0906,945.8560000000001,946.5878000000001,947.3074000000001,948.1902000000002,949.185,949.5546,949.7690000000001,949.5908000000001,950.029,950.0341999999998,949.9706,949.7411999999999,949.2378,948.6978,947.8942,947.0006,945.941,944.7886,943.7374000000001,942.6787999999999,941.4496,940.4573999999999,939.0554000000001,937.6006000000001,936.7372000000001,936.373,935.8450000000003,935.2554000000001,934.7270000000001,934.2076,933.5032000000001,933.0820000000001,932.6796,932.2829000000003,931.5400999999999,931.1361,931.2309,931.1229,931.4688999999998,931.7964999999998]")
				}
				if (text === 'AMZN') {
					sendTextMessage(sender, "Here are some stats on AMZN (Amazon): One Year Target: $1171, Year High-Low: $1083.31 / $710.10, P/E Ratio: 250.45, Earnings Per Share: $3.94, Beta: 1.53, Current Price: $992.57") 
					sendTextMessage(sender, "50 Day Moving Average: [969.4457660000002,970.7255660000003,971.8759660000001,973.2653660000001,974.8271660000001,976.2099660000001,977.3755660000003,978.4493660000002,979.6649660000002,981.115166,982.9211660000001,984.4777660000001,985.9953660000001,987.529766,989.356366,990.926766,992.815166,994.4137659999999,995.919366,996.5051659999999,997.1735999999999,997.6779999999999,997.9855999999999,998.1302,998.1079999999998,997.9891999999999,997.6954,996.9413999999998,996.3821999999999,995.9136,995.3416000000001,994.8452000000001,993.8552000000001,992.8192,992.3188,992.3585999999999,991.9028000000002,991.4223999999999,991.0441999999998,990.2103999999998,989.3881999999998,988.8881999999996,988.4555999999997,987.9945999999998,987.2251999999996,986.9971999999997,987.1131999999998,987.2985999999997,987.7719999999997,988.2561999999998]")
				}
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

