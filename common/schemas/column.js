var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var ColumnSchema = new Schema({
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
    //true: 删除 ,false: 没删除
    del:{
        type:Boolean,
        dafault:false
    }

})


ColumnSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdtime = this.meta.refreshtime = Date.now()
    }
    else {
        this.meta.refreshtime = Date.now()
    }

    next()
})

ColumnSchema.statics = {
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

module.exports = ColumnSchema