var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MemberSchema = new Schema({
    //姓名
    name: String,
    //头像
    image: String,
    //所在团队
    teams:[{type:ObjectId,ref:'Team'}],
    meta: {
        createdtime: {
            type: Date,
            default: Date.now()
        },
        refreshtime: {
            type: Date,
            default: Date.now()
        }
    },
    //职位
    job: String,
    //简介
    content: String,
    //性别
    sex: String,
    //年龄
    age: Number,
    //个人网站
    website: String,
    //true: 删除 ,false: 没删除
    del:{
        type:Boolean,
        dafault:false
    }

})


MemberSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdtime = this.meta.refreshtime = Date.now()
    }
    else {
        this.meta.refreshtime = Date.now()
    }

    next()
})

MemberSchema.statics = {
    fetch: function(cb) {
        return this
            .find({del:false})
            .sort('meta.refreshtime:-1')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = MemberSchema