var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var TagSchema = new Schema({
    name: String,
    articles: [{type: ObjectId, ref: 'Article'}],
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
    del:{
        type:Boolean,
        //true: 删除 ,false: 没删除
        dafault:false
    }
})


TagSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdtime = this.meta.refreshtime = Date.now()
    }
    else {
        this.meta.refreshtime = Date.now()
    }

    next()
})

TagSchema.statics = {
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

module.exports = TagSchema