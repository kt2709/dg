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


app.get('/goldrates', function(request, response) {
  const pg = require('pg')  
  const conString = process.env.DATABASE_URL || 'postgres://hhxshvtgknprug:31f0288488d39087e107aac5d168deaa8dc654887d514149407b045afac2cb8c@ec2-23-21-158-253.compute-1.amazonaws.com:5432/ddndh497lf9bs8';

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

app.get('/goldshops/:city', function(request, response) {
  const pg = require('pg')  
  const conString = process.env.DATABASE_URL || 'postgres://hhxshvtgknprug:31f0288488d39087e107aac5d168deaa8dc654887d514149407b045afac2cb8c@ec2-23-21-158-253.compute-1.amazonaws.com:5432/ddndh497lf9bs8';

  var city = request.params.city;

  pg.defaults.ssl = true;

  pg.connect(conString, function (err, client, done) {  
    if (err) {
      return console.error('error fetching client from pool', err)
    }
    client.query("SELECT * FROM goldshops where city=$1",[city], function (err, result) {
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
