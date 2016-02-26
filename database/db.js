//DB
// mongoose config
var config = require('../config.json');
var mongoose = require('mongoose'),
    connectionURI = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/codesnippets',
    options = {
        server: {
            auto_reconnect: true,
            poolSize: 5
        }
    };

mongoose.connect(connectionURI, options, function(err, res) {
  if(err) {
    console.log('[mongoose log] Error connecting to: ' + connectionURI + '. ' + err);
  } else {
    console.log('[mongoose log] Successfully connected to: ' + connectionURI);
  }
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function callback () {
  // yay!
	console.log('[mongoose log]db open success');
});

module.exports = mongoose;
