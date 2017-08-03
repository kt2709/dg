'use strict'

const pg = require('pg')  
const conString = process.env.DATABASE_URL || 'postgres://tlvzcppkdgyuvb:cc7dc6356ba0c9f60a6fd92bc314d028a64fd7f0c405d9f02f2cf1381ae7427d@ec2-184-73-167-43.compute-1.amazonaws.com:5432/da3pt2u3t9gl65';

pg.defaults.ssl = true;

pg.connect(conString, function (err, client, done) {  
  if (err) {
    return console.error('error fetching client from pool', err)
  }
  client.query('SELECT * FROM goldrates;', [], function (err, result) {
    done()

    if (err) {
      return console.error('error happened during query', err)
    }
    console.log(result.rows)
    process.exit(0)
  })
})