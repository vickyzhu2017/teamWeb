var mongoose = require('mongoose')
var Column = require('../common/models/column')
var _ = require('underscore');
// admin new page
exports.new = function(req, res) {
    res.render('column', {
        title: '栏目录入页',
        column: {}
    })
}

// admin post column
exports.save = function(req, res) {
    var _column = req.body.column;
    var id= req.body.column._id;
    if(id){
        //更新
        Column.findById(id,function(err,column){
            if(err){
               console.log(err);
            }
            _column = _.extend(column,_column);
            _column.save(function(err,column){
                if(err){
                   console.log(err);
                }
                res.redirect('/admin/column/list');
            });
        });
    }else{
        //新增
        Column.findOne({name: _column.name}, function (err, column) {
            if (err) {
                console.log("err:" + err)
            }
            if (column) {
                console.log("this name exists!");
                return res.redirect('/admin/column/new');
            } else {
                var column = new Column(_column);
                column.del=false;
                column.save(function(err, column) {
                    if (err) {
                        console.log(err)
                    }

                    res.redirect('/admin/column/list')
                });
            }
        });

    }

}
exports.update = function(req,res){
    var id = req.params.id;
    if(id){
        Column.findById({_id:id},function(err,column){
           res.render('column',{
               title : '栏目更新页',
               column:column
           })
        });
    }
}


// list page
exports.list = function(req, res) {
    Column.fetch(function(err, columns) {
        if (err) {
            console.log(err)
        }

        res.render('columnList', {
            title: '栏目列表页',
            columns: columns
        });
    });
}