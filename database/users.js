// 链接 userlist 集合
var mongoose = require('mongoose');
var db = mongoose.connection;
// 链接错误
db.on('error', function(error) {
    console.log(error);
});
// Schema 结构
var Schema = mongoose.Schema;
var userlistScheMa = new Schema({
    name: {type: String},
    uid: {type: String},
    password: {type: String},
    //content  : {type : String},
    //time	 : {type : Date, default: Date.now},
    snippets: [{type: Schema.ObjectId, ref: 'sinppets'}]
});
// 关联 userlist -> users 表
module.exports = db.model('users', userlistScheMa);
