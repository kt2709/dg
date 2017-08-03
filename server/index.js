var express = require('express');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 5000));


app.all('*', function(req, res,next) {


    /**
     * Response settings
     * @type {Object}
     */
    var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }


});


app.get('/', function(request, response) {
  const pg = require('pg')  
  const conString = process.env.DATABASE_URL || 'postgres://tlvzcppkdgyuvb:cc7dc6356ba0c9f60a6fd92bc314d028a64fd7f0c405d9f02f2cf1381ae7427d@ec2-184-73-167-43.compute-1.amazonaws.com:5432/da3pt2u3t9gl65';


  pg.defaults.ssl = true;

  pg.connect(conString, function (err, client, done) {  
    if (err) {
      return console.error('error fetching client from pool', err)
    }
    client.query('SELECT * FROM goldrates order by date desc ,city;', [], function (err, result) {
      done()

      if (err) {
        return console.error('error happened during query', err)
      }
      response.json(result.rows)
    })
  });
});

/*app.get('/', function(request, response) {
	fs.readFile('data.json', 'utf8', function(err, contents) {
  		response.send(contents);
	});
});*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
