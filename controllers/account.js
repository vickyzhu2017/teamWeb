var Account = require('../common/models/account');
var _ = require('underscore');

//singin
exports.showSignin = function(req,res){
    res.render('signin',{
        title : '登录页'
    });
}
exports.signin = function(req,res){
    var _account = req.body.account,
        name = _account.username,
        password = _account.userpw;
    Account.findOne({username:name},function(err,account){
        if(err){
            console.log(err);
        }

        if(!account){
            return res.redirect('/signin');
        }
        account.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err);
            }

            if(isMatch){
                req.session.account=account;
                console.log("password is matched!");
                return res.redirect('/admin/account/list');
            }else{
                console.log("password is not matched!");
                return res.redirect('/signin');
            }
        });
    });
}

//logout
exports.logout = function(req,res){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
}
//是否登录
exports.signinRequired = function(req,res,next){
    var account = req.session.account;
    if(!account){
        return res.redirect('/signin');
    }
    next();
}
//管理员权限
exports.adminRequired = function(req,res,next){
    var account = req.session.account;
    if(account.power <= 0){
        return res.redirect('/signin');
    }
    next();
}


exports.new = function(req,res){
    res.render('account',{
        title : '用户录入页',
        account:{}
    });
}
exports.save = function(req,res){
    var _account = req.body.account;
    var id = req.body.account._id
    if (id) {
        //更新
        Account.findById(id, function(err, account) {
            if (err) {
                console.log(err)
            }

            _account = _.extend(account,_account)
            _account.save(function(err, account) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/admin/account/list');
            })
        })
    }
    else {
        //新增
        Account.findOne({username: _account.username}, function (err, account) {
            if (err) {
                console.log("err:" + err)
            }
            if (account) {
                console.log("this name exists!");
                return res.redirect('/admin/account/new');
            } else {
                var account = new Account(_account);
                account.save(function (err, account) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/admin/account/list');
                });
            }
        });
    }
}
exports.update = function(req,res){
    var id = req.params.id
    if (id) {
        Account.findById(id, function(err, account) {
            res.render('account', {
                title: '用户信息更新页',
                account: account
            });
        });
    }
}
exports.list = function(req,res){
    Account.fetch(function(err,accounts){
        if(err){console.log(err)}
        res.render('accountList',{
            title: '用户列表页',
            accounts:accounts
        });
    });
}
exports.del = function(req,res){
    var id=req.query.id;

    if(id){
        //更新using
        Account.findById(id, function(err, account) {
            if (err) {
                console.log(err);
            }
            account.using=false;
            account.save(function(err, account) {
                if (err) {
                    console.log(err)
                    res.json({status:'error',msg:'删除用户失败！'})
                }else{
                    res.json({status:'ok',msg:'删除用户成功！'})
                }
            });
        })
    }
}