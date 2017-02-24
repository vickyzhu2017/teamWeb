//index page
var Article = require('../common/models/article');
var Column = require('../common/models/column');
var Tag = require('../common/models/tag');
exports.index = function(req, res) {
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
                    res.render('blogindex',{
                        title:'主页',
                        columns:columns,
                        articles:articles
                    });
                })

        })

}