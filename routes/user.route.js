const express = require('express');
const router = express.Router();
const User=require("../models/user")
const nodemailer=require('nodemailer');


//fonctions prédéfinies de gmail
var transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
    user:'omaima.abida.escs@gmail.com',
    pass:'blnmzkudyifasmee'  //le 2ème mot de passe de gmail
    },
    tls:{
    rejectUnauthorized:false
    }
    
    })
    


// créer un nouvel utilisateur
router.post('/register', async (req, res) => {
try {
let { email, password, firstname, lastname } = req.body
const user = await User.findOne({ email })
if (user) return res.status(404).send({ success: false, message: "User already exists" })

const newUser = new User({ email, password, firstname, lastname })
const createdUser = await newUser.save()

// Envoyer l'e-mail de confirmation de l'inscription
var mailOption ={
    from: '"verify your email " <omaima.abida.escs@gmail.com>',
    to: newUser.email,
    subject: 'vérification your email ',
    html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2>
    <h4>please verify your email to procced.. </h4>
    <a
    href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click
    here</a>`
    }
    transporter.sendMail(mailOption,function(error,info){
    if(error){
    console.log(error)
    }
    else{
    console.log('verification email sent to your gmail account ')
    }
    })


return res.status(201).send({ success: true, message: "Account created successfully", user: createdUser })
} catch (err) {
console.log(err)
res.status(404).send({ success: false, message: err })
}
});

// afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
    try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });

    /**
* as an admin i can disable or enable an account
*/
//la méthode qui modifie l’état du champ iSactive
// pour tester cette méthode : get -- http://localhost:5000/api/users/status/edit?email=omaima.abida.escs@gmail.com
router.get('/status/edit/', async (req, res) => {
    try {
    let email = req.query.email
    let user = await User.findOne({email})
    user.isActive = !user.isActive
    user.save()
    res.status(200).send({ success: true, user })
    } catch (err) {
    return res.status(404).send({ success: false, message: err })
    }
    })
    
module.exports = router;
