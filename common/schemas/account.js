/**
 * Created by vickyzhu on 2016/1/5.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var AccountSchema = new mongoose.Schema({
    username:{
        unique:true,
        type:String
    },
    userpw:{
        unique:true,
        type:String
    },
    power:{
        //0:common user,1: admin, 2: super admin
        type:Number,
        default : 0
    },
    meta:{
        createdtime:{
            type:Date,
            default:Date.now()
        },
        refreshtime:{
            type:Date,
            default:Date.now()
        }
    },
    using:{
        type:Boolean,
        //true: 启用 ,false: 不启用
        dafault:true
    }
})


AccountSchema.pre('save',function(next){
    var account=this;
    if(this.isNew){
        this.meta.createdtime=this.meta.refreshtime=Date.now();
    }else{
        this.meta.refreshtime=Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);
        //console.log("password:"+account.userpw);
        bcrypt.hash(account.userpw,salt,function(err,hash){
            if(err) return next(err);
            account.userpw = hash;
            next();
        });
    });
    //转移控制权，即往下执行
    //next();
});

AccountSchema.methods={
    comparePassword:function(_password,cb){
        bcrypt.compare(_password,this.userpw,function(err,isMatch){
            if(err) return cb(err);
            cb(null,isMatch);
        });
    }
}
AccountSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.refreshtime:-1')
            .exec(cb);
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}

module.exports=AccountSchema;