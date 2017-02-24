var mongoose = require('mongoose');
var TeamSchema = require('../schemas/team');
var Team = mongoose.model('Team',TeamSchema);

module.exports = Team