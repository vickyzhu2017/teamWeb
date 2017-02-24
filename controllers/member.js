/**
 * Created by vickyzhu on 2016/1/16.
 */
var _ = require('underscore');
var Member = require('../common/models/member');
var Team = require('../common/models/team');
var fs = require('fs');
var path = require('path');
//detail page
exports.detail = function(req,res){
    var id = req.params.id;
    Member
        .findOne({_id:id})
        .populate({
            path:'teams'
        })
        .exec(function(err,member){
            if(err) console.log(err);
            //for(var i=0;i<member.teams.length;i++){
            //    console.log("打印团队：");
            //    console.log(member.teams[i].title);
            //}
            res.render('memberDetail', {
                title: 'Member 详情页',
                member: member
            });
        })
    //Member.findById(id, function(err, member) {
    //    res.render('memberDetail', {
    //        title: 'Member 详情页',
    //        member: member
    //    })
    //});
}

// admin update page
exports.update = function(req, res) {
    var id = req.params.id
    if (id) {
        Member.findById(id, function(err, member) {
            Team.fetch(function(err, teams) {
                res.render('member', {
                    title: 'Member 后台更新页',
                    member: member,
                    teams: teams
                })
            })
        })
    }
}

// admin upload  image
exports.saveImage = function(req, res, next) {
    var posterData = req.files.uploadImg
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename
    console.log("originalFilename:"+originalFilename);
    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now()
            var type = posterData.type.split('/')[1]
            var image = timestamp + '.' + type
            var newPath = path.join(__dirname, '../', '/assets/images/' + image)

            fs.writeFile(newPath, data, function(err) {
                console.log("err:"+err);
                req.image = image
                next()
            })
        })
    }
    else {
        next()
    }
}

// admin new page
exports.new = function(req, res) {
    Team.fetch(function(err, teams) {
        res.render('member', {
            title: 'member 后台录入页',
            teams: teams,
            member: {}
        })
    })
}

// admin post member
exports.save = function(req, res) {

    var id = req.body.member._id
    var memberObj = req.body.member
    var _member
    if (req.image) {
        memberObj.image = req.image
    }
    if (id) {
        //更新
        Member.findById(id, function(err, member) {
            if (err) {
                console.log(err)
            }

            _member = _.extend(member, memberObj)
            _member.save(function(err, member) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/member/' + member._id)
            })
        })
    }
    else {
        memberObj.del = false;
        _member = new Member(memberObj)

        var teamIdArr = memberObj.teams
        var teamName = memberObj.teamName

        _member.save(function(err, member) {
            if (err) {
                console.log(err);
            }

            if (teamIdArr) {
                var _len=teamIdArr.length;
                console.log("len:"+ teamIdArr.length);
                if(_len==24){
                    var teamId = teamIdArr;
                    Team.findById(teamId, function(err, team) {
                        team.members.push(member._id)

                        team.save(function(err, team) {
                            res.redirect('/member/' + member._id)
                        })
                    })
                }else{
                    for(var i=0;i<_len;i++){
                        var teamId = teamIdArr[i];
                        console.log("teamId:"+teamId);

                        Team.findById(teamId, function(err, team) {
                            team.members.push(member._id)

                            team.save(function(err, team) {
                                console.log("i:"+i);
                            })
                        })
                    }
                    res.redirect('/member/' + member._id);
                }

            }
            else if (teamName) {
                //判断该团队是否已存在
                Team.findOne({title : teamName},function(err,team){
                    if(team){
                        console.log("this team exists!");
                    }else{
                        var team = new Team({
                            title: teamName,
                            members: [member._id],
                            del:false
                        })

                        team.save(function(err, team) {
                            member.teams.push(team._id);
                            member.save(function(err, member) {
                                res.redirect('/member/' + member._id)
                            })
                        })
                    }
                });

            }
        })
    }
}

//list page
exports.list = function(req,res){
    Team
        .find({})
        .populate({
            path: 'members'
        })
        .exec(function(err, teams) {
            if (err) {
                console.log(err)
            }

            res.render('memberList',{
                title:'Member 列表页',
                teams:teams
            });
        })
    //Member.fetch(function(err,members){
    //    if(err){console.log(err);}
    //
    //    res.render('memberList',{
    //        title:'Member 列表页',
    //        members:members
    //    });
    //});
}

exports.del = function(req,res){
    var id=req.query.id;
    if(id){
        //更新del
        Member.findById(id, function(err, member) {
            if (err) {
                console.log(err);
            }
            member.del=true;
            member.save(function(err, member) {
                if (err) {
                    console.log(err)
                    res.json({status:'error',msg:'删除团队成员失败！'})
                }else{
                    res.json({status:'ok',msg:'删除团队成员成功！'})
                }
            });
        })
    }
}
