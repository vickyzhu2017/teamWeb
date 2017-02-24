var mongoose = require('mongoose');
var ColumnSchema = require('../schemas/column');
var Column = mongoose.model('Column',ColumnSchema);

module.exports=Column;