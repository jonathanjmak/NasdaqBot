module.exports={

    
    
getData: function(symbol){
    var jsonFile=require('jsonfile')
    var LocalStorage = require('node-localstorage').LocalStorage;
    var WebSocket = require('ws');
    localStorage = new LocalStorage('./scratch2');
    var dataDict={};
    var ws = new WebSocket("ws://35.161.245.102/stream?symbol="+symbol+"&start=20170101&end=20170915");
    var name=null;
    var closing=[];
    var date=null;
    
    
    //Opens the websocket and sends info
    ws.on('open',function open(){
        
        //Sends data to the server
        ws.send('something');
        
    })
    

    
    ws.on('message', function(message) {
        
        //Receives a message and then parses it
        data=JSON.parse(message)
        
        //Pushes onto an array
        closing.push(data.Close)
        ws.close();
    });

    //On close, it writes all of the data to a hashmap and then sets it into local storage
    ws.on('close',function(code) {
        dataDict.Closing=closing;
        dataDict.Symbol=symbol;
        dataDict.Date=date;
      localStorage.setItem('myStorage',JSON.stringify(dataDict));
      console.log('Disconnected: ' + code);
        
    });

    //Provides error message
    ws.on('error', function(error) {
      console.log('Error: ' + error.code);
    });
        
    console.log("I passed the get data")
    return closing;
    },

movingAverage: function(data,interval){
    
    //Sets up all variables needed for the moving avg
    var symbol=data.Symbol;
    var cPrices=data.Closing;
    var lenPrices=cPrices.length;
    var mAvg=[];
    var nInt=[];
    var start=0;
    var end=interval;
    
    
    while (true){
    
        var total=0;
        //Loops through to get each point
        for (i=start;i<end;i++){
            total+=cPrices[i];
            console.log(total);
        }
        
        //Increments the starting point
        start+=1;
        end+=1;
        
        var avgPoint=total/interval;
        
        mAvg.push(avgPoint);
        nInt.push(start);
        
        
    
        //Breaks out of the loop if we are at 50 days before our present date
        if (start===lenPrices-interval){
            
            break;
            
        }
    }
    
    var mAvgData=[mAvg.slice(Math.max(mAvg.length-50,1)),nInt.slice(0,50), symbol];
    
    console.log("I am past the moving average")
    return mAvgData;    
    
},

webScrape: function(symbol){
    
    //Requires the modules needed for functionality
    var jsonFile=require('jsonfile')
    var file="./scraped.json"
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch2');
    
    var html=[];
    var html2=[];
     const rp=require('request-promise');
    const cheerio=require('cheerio');
    
    //Configures options for cheerio page loading
    const options= {
        
        uri:"http://www.nasdaq.com/symbol/"+symbol,
        transform: function(body){
            
            return cheerio.load(body);
        }
        
    };
    
    rp(options).then(($)=>{
        
        var stockInfo={};
        
        //Prepares all of the entries and then pushes to a dictionary
        var stats=$('td[align=right]').each(function(i,elem){
           
            html.push($(this).text().trim());
            
        });
        
    
        
        //Adds essential investment info to the stockInfo hashmap
        stockInfo.oneYearTarget=html[1];
        stockInfo.yearHighLow=html[6];
        stockInfo.peRatio=html[8];
        stockInfo.earningsPerShare=html[10];
        stockInfo.beta=html[15];
        stockInfo.currentPrice=html[16];
        
        //Replacing with a write to a JSON file
        jsonFile.writeFileSync(file,stockInfo);
        
    })
    .catch((err) => {
        
        console.log(err);
    });
    //console.log(options);
    
    console.log("I am done with the webscrape")
}
    
    
}


