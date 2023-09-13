const mongoose = require('mongoose')

const bcrypt = require('bcrypt') //importer bcrypt

const userSchema = new mongoose.Schema({
email: {
type: String,
required: true,
unique: true
},
password: {
type: String,
required: true,
},
firstname: {
type: String,
required: true,
},

lastname: {
type: String,
required: true,
},
role: { //interssant car il y a une différence entre : client orienté --> frontend ou admin orienté --> backend
type: String,
enum: ["user", "admin"],
default: "user"
},
isActive: {
type: Boolean,
default: false,
required: false
},
avatar :{
type: String,
required: false
} ,
},
{
timestamps: true,
},
)
//exemple de callback de node jS
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
    })
module.exports = mongoose.model('User', userSchema)