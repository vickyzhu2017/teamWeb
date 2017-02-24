var mongoose = require('mongoose')
var Tag = require('../common/models/tag')
var _ = require('underscore');
// admin new page
exports.new = function(req, res) {
    res.render('tag', {
        title: '标签录入页',
        tag: {}
    })
}

// admin post tag
exports.save = function(req, res) {
    var _tag = req.body.tag;
    var id= req.body.tag._id;
    if(id){
        //更新
        Tag.findById(id,function(err,tag){
            if(err){
                console.log(err);
            }
            _tag = _.extend(tag,_tag);
            _tag.save(function(err,tag){
                if(err){
                    console.log(err);
                }
                res.redirect('/admin/tag/list');
            });
        });
    }else{
        //新增
        Tag.findOne({name: _tag.name}, function (err,tag) {
            if (err) {
                console.log("err:" + err)
            }
            if (tag) {
                console.log("this name exists!");
                return res.redirect('/admin/tag/new');
            } else {
                var tag = new Tag(_tag);
                tag.del = false;
                tag.save(function(err, tag) {
                    if (err) {
                        console.log(err)
                    }

                    res.redirect('/admin/tag/list')
                });
            }
        });

    }

}

// admin update tag
exports.update = function(req,res){
    var id = req.params.id;
    if(id){
        Tag.findById({_id:id},function(err,tag){
            res.render('tag',{
                title : '标签更新页',
                tag:tag
            })
        });
    }
}


// tag list page
exports.list = function(req, res) {
    Tag.fetch(function(err, tags) {
        if (err) {
            console.log(err)
        }

        res.render('tagList', {
            title: '标签列表页',
            tags: tags
        });
    });
}