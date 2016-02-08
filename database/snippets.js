// 链接 userlist 集合
var mongoose = require('mongoose');
var db = mongoose.connection;
// 链接错误
db.on('error', function(error) {
    console.log(error);
});
// Schema 结构
var Schema = mongoose.Schema;
var snippetsScheMa = new Schema({
    title: {type: String},
    remark: {type: String},
    user: {type: Schema.ObjectId, ref: 'users'},
    //content  : {type : String},
    //time	 : {type : Date, default: Date.now},
    codes: [{type: String}]
});
// 关联 userlist -> users 表
module.exports = db.model('snippets', snippetsScheMa);
