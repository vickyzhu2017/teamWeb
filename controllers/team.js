var mongoose = require('mongoose')
var Team = require('../common/models/team')
var _ = require('underscore');
// admin new page
exports.new = function(req, res) {
    res.render('team', {
        title: '团队录入页',
        team: {}
    })
}

// admin post column
exports.save = function(req, res) {
    var _team = req.body.team;
    var id= req.body.team._id;
    if(id){
        //更新
        Team.findById(id,function(err,team){
            if(err){
                console.log(err);
            }
            _team = _.extend(team,_team);
            _team.save(function(err,team){
                if(err){
                    console.log(err);
                }
                res.redirect('/admin/team/list');
            });
        });
    }else{
        //新增
        Team.findOne({title: _team.title}, function (err, team) {
            if (err) {
                console.log("err:" + err)
            }
            if (team) {
                console.log("this title exists!");
                return res.redirect('/admin/team/new');
            } else {
                _team.del = false;
                var team = new Team(_team);
                team.save(function(err, team) {
                    if (err) {
                        console.log(err)
                    }

                    res.redirect('/admin/team/list')
                });
            }
        });

    }

}
exports.update = function(req,res){
    var id = req.params.id;
    if(id){
        Team.findById({_id:id},function(err,team){
            res.render('team',{
                title : '团队信息更新页',
                team:team
            })
        });
    }
}


// list page
exports.list = function(req, res) {
    Team.fetch(function(err, teams) {
        if (err) {
            console.log(err)
        }

        res.render('teamList', {
            title: '团队列表页',
            teams: teams
        });
    });
}
//del page
exports.del = function(req,res){
    var id=req.query.id;
    if(id){
        //更新del
        Team.findById(id, function(err, team) {
            if (err) {
                console.log(err);
            }
            team.del=true;
            team.save(function(err, team) {
                if (err) {
                    console.log(err)
                    res.json({status:'error',msg:'删除团队失败！'})
                }else{
                    res.json({status:'ok',msg:'删除团队成功！'})
                }
            });
        })
    }
}