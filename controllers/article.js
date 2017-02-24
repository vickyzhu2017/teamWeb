/**
 * Created by vickyzhu on 2016/1/16.
 */
var _ = require('underscore');
var Article = require('../common/models/article');
var Column = require('../common/models/column');
var Tag = require('../common/models/tag');
var fs = require('fs');
var path = require('path');

// admin new page
exports.new = function(req, res) {
    Column.fetch(function(err, columns) {
        Tag.fetch(function(err,tags){
            res.render('article', {
                title: '文章录入页',
                columns: columns,
                tags: tags,
                article: {}
            });
        });
    });
}

//detail page
exports.detail = function(req,res){
    var id = req.params.id;
    Article
        .findOne({_id:id})
        .populate({
            path:'tags'
        })
        .exec(function(err,article){
            if(err) console.log(err);
            res.render('detail', {
                title: '文章详情页',
                article: article
            });
        })
}

// admin update page
exports.update = function(req, res) {
    var id = req.params.id
    if (id) {
        Article.findById(id, function(err, article) {
            Column.fetch(function(err, columns) {
                Tag.fetch(function(err,tags){
                    if(err) console.log(err);
                    res.render('article', {
                        title: '文章更新页',
                        article: article,
                        columns: columns,
                        tags: tags
                    })
                });
            });
        });
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
            var newPath = path.join(__dirname, '../../', '/public/upload/' + image)

            fs.writeFile(newPath, data, function(err) {
                req.image = image
                next()
            })
        })
    }
    else {
        next()
    }
}


// admin post article
exports.save = function(req, res, next) {

    var id = req.body.article._id
    var articleObj = req.body.article
    var _article
    if (req.image) {
        articleObj.image = req.image
    }
    if (id) {
        //更新
        Article.findById(id, function(err, movie) {
            if (err) {
                console.log(err)
            }

            _article = _.extend(movie, articleObj)
            _article.save(function(err,article) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/article/' + article._id)
            })
        })
    }
    else {
        articleObj.del = false;
        _article = new Article(articleObj)

        var columnIdArr = articleObj.columns,
            columnName = articleObj.columnName,
            tagIdArr = articleObj.tags,
            tagName = articleObj.tagName


        _article.save(function(err, article) {
            if (err) {
                console.log("article-save error~")
                console.log(err)
            }
            //console.log("columnIdArr:"+columnIdArr.length);
            //处理栏目
            if (columnIdArr) {
                var _len=columnIdArr.length;
                //console.log("columnIdArr_len:"+ columnIdArr.length);
                if(_len==24){
                    var columnId = columnIdArr;
                    Column.findById(columnId, function(err, column) {
                        column.articles.push(article._id)

                        column.save(function(err, column) {
                            if(err){consle.log(err);}
                            console.log("saveColumn:"+column.articles);
                        })
                    })
                }else{
                    for(var i=0;i<_len;i++){
                        var columnId = columnIdArr[i];
                        //console.log("columnId:"+columnId);

                        Column.findById(columnId, function(err, column) {
                            column.articles.push(article._id)

                            column.save(function(err, column) {
                                //console.log("i:"+i);
                                console.log("saveColumn:"+column.articles);

                                if(err) console.log(err);
                            })
                        })
                    }
                    //res.redirect('/article/' + article._id)
                }


            }
            else if (columnName) {
                //判断该栏目是否已存在
                Column.findOne({name:columnName},function(err,column){
                    if(column){
                        console.log("This column exists!");
                    }else{
                        var column = new Column({
                            name: columnName,
                            articles: [article._id],
                            del:false
                        })

                        column.save(function(err, column) {
                            article.columns.push(column._id);
                            article.save(function(err, article) {
                                //next();
                            });
                        });
                    }

                });
            }

            //处理标签
            if (tagIdArr) {
                var _len=tagIdArr.length;
                //console.log("tagIdArrlen:"+ tagIdArr.length);
                if(_len==24){
                    var tagId = tagIdArr;
                    Tag.findById(tagId, function(err, tag) {
                        tag.articles.push(article._id)

                        tag.save(function(err, tag) {
                            res.redirect('/article/' + article._id)
                        });
                    });
                }else{
                    for(var i=0;i<_len;i++){
                        var tagId = tagIdArr[i];
                        //console.log("tagId:"+tagId);

                        Tag.findById(tagId, function(err, tag) {
                            tag.articles.push(article._id)

                            tag.save(function(err, tag) {
                                console.log("i:"+i);
                            })
                        })
                    }
                    res.redirect('/article/' + article._id)
                }

            }
            else if (tagName) {
                //判断该标签是否已存在
                Tag.findOne({name:tagName},function(err,tag){
                    if(tag){
                        console.log("this tag exists!");
                    }else{
                        var tag = new Tag({
                            name: tagName,
                            articles: [article._id],
                            del:false
                        })

                        tag.save(function(err, tag) {
                            article.tags.push(tag._id);
                            article.save(function(err, article) {
                                res.redirect('/article/' + article._id)
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
    Column
        .find({})
        .populate({
            path: 'articles'
        })
        .exec(function(err, columns) {
            if (err) {
                console.log(err)
            }
            Article
                .find({})
                .populate({
                    path :'tags'
                })
                .exec(function(err,articles){
                    if(err){
                        console.log(err);
                    }
                    res.render('articleList',{
                        title:'Article 列表页',
                        columns:columns,
                        articles:articles
                    });
                })

        })

    //Article.fetch(function(err,articles){
    //    if(err){console.log(err);}
    //
    //    res.render('articleList',{
    //        title:'文章列表页',
    //        articles:articles
    //    });
    //});
}

exports.del = function(req,res){
    var id=req.query.id;
    if(id){
        //更新del
        Article.findById(id, function(err, article) {
            if (err) {
                console.log(err);
            }
            article.del=true;
            //删除文章不对columns/tags的articles字段操作，输出时判断article的del字段判断，为true时不显示
            //if(article.columns){
            //    var _len = article.columns.length,
            //        columnId;
            //    console.log("_len:"+_len);
            //    if(_len == 24){
            //        columnId = article.columns;
            //        console.log("数量唯一："+columnId);
            //    }else{
            //        console.log("数量不唯一：")
            //        for(var i=0;i<_len;i++){
            //            columnId = article.columns[i];
            //            console.log("columnId:"+columnId);
            //        }
            //    }
            //}
            article.save(function(err, article) {
                if (err) {
                    console.log(err)
                    res.json({status:'error',msg:'删除文章失败！'})
                }else{
                    res.json({status:'ok',msg:'删除文章成功！'})
                }
            });
        })
    }
}
