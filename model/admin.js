const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema({
    adminname: { type: String, required: true },
    adminemail:{ type: String, required: true },
    adminpassword:{type: String, required: true},
    adminrole:{type: String, required: true}
});

module.exports = mongoose.model('Admin', itemSchema);