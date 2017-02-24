var Index = require('./controllers/index');
var Account = require('./controllers/account');
var Column = require('./controllers/column');
var Tag = require('./controllers/tag');
var Article = require('./controllers/article');
var Team = require('./controllers/team');
var Member = require('./controllers/member');





//router
module.exports=function(app){
//pre handle user
    app.use(function(req,res,next){
        var _account = req.session.account;
        app.locals.account=_account;
        if(_account){ console.log("account in session:"+_account.username);}
        next();
    });
//前台
// Index
    // app.get('/',Index.index);
    app.get('/',Account.showSignin);



//后台
// account
    app.get('/signin',Account.showSignin);
    app.post('/account/signin',Account.signin);
    app.get('/logout',Account.logout);
    app.get('/admin/account/list',Account.list);
    //暂未设权限
    app.get('/admin/account/new',Account.new);
    app.post('/admin/account/new',Account.save);

    app.get('/admin/account/update/:id',Account.update);
    app.post('/admin/account/new',Account.save);
    app.delete('/admin/account/del_account',Account.del);


//column
    app.get('/admin/column/list',Column.list);
    app.get('/admin/column/new',Column.new);
    app.post('/admin/column/new',Column.save);
    app.get('/admin/column/update/:id',Column.update);
    app.post('/admin/column/new',Column.save);
    //app.delete('/admin/column/del_column',Column.del);

//tag
    app.get('/admin/tag/list',Tag.list);
    app.get('/admin/tag/new',Tag.new);
    app.post('/admin/tag/new',Tag.save);
    app.get('/admin/tag/update/:id',Tag.update);
    app.post('/admin/tag/new',Tag.save);
    //app.delete('/admin/tag/del_tag',Column.del);

//article
    app.get('/article/:id',Article.detail);
    app.get('/admin/article/new',Article.new);
    app.get('/admin/article/update/:id',Article.update);
    app.post('/admin/article/new',Article.saveImage,Article.save);
    app.get('/admin/article/list',Article.list);
    app.delete('/admin/article/del_article',Article.del);

//team
    app.get('/admin/team/list',Team.list);
    app.get('/admin/team/new',Team.new);
    app.post('/admin/team/new',Team.save);
    app.get('/admin/team/update/:id',Team.update);
    app.post('/admin/team/new',Team.save);
    app.delete('/admin/team/del_team',Team.del);

//member
    app.get('/member/:id',Member.detail);
    app.get('/admin/member/new',Member.new);
    app.get('/admin/member/update/:id',Member.update);
    app.post('/admin/member/new',Member.saveImage,Member.save);
    app.get('/admin/member/list',Member.list);
    app.delete('/admin/member/del_member',Member.del);


}
