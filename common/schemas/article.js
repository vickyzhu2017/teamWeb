var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var ArticleSchema = new Schema({
    //标题
    title: String,
    //作者
    author: String,
    meta: {
        //创建时间
        createdtime: {
            type: Date,
            default: Date.now()
        },
        //更新时间
        refreshtime: {
            type: Date,
            default: Date.now()
        }
    },
    //栏目
    columns: [{type: ObjectId, ref: 'Column'}],
    //标签
    tags: [{type: ObjectId, ref: 'Tag'}],
    //内容
    content: String,
    //简介
    des: String,
    //来源
    source: String,
    //缩略图
    image: String,
    //点击量
    hits:{
        type:Number,
        default : 0
    },
    //赞
    zan:{
        type:Number,
        default : 0
    },
    //权重
    weight:{
        type:Number,
        default : 0
    },
    //显示
    display:{
        type:Boolean,
        //true: 显示 ,false: 隐藏
        dafault:true
    },
    //置顶
    digest:{
        type:Boolean,
        //true: 置顶 ,false: 不置顶
        dafault:false
    },
    //是否删除
    del:{
        type:Boolean,
        //true: 删除 ,false: 没删除
        dafault:false
    }
})


ArticleSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdtime = this.meta.refreshtime = Date.now()
    }
    else {
        this.meta.refreshtime = Date.now()
    }

    next()
})

ArticleSchema.statics = {
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

module.exports = ArticleSchema