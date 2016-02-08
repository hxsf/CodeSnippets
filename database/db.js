//DB
// mongoose config
var mongoose = require('mongoose'),
    connectionURI = 'mongodb://192.168.99.100:27017/codesnippets',
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
