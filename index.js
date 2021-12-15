const express = require("express");

const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const { User } =require('./models');

const db = require('./models');

app.set('view engine','ejs');
app.set('views','views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
	secret: "qwerty",
	resave: false,
	saveUninitialized: true
}));


app.get("/all",(req,res)=>{
    User.findAll()
    .then((users) =>{
        // res.send(users);
        // console.log(users);
        res.render("all",{users})
    })
    .catch((err) =>{
        console.log(err);
        res.send(err);
    });
});


app.post("/insert", async (req,res)=>{
    const { userEmail, password, userName, totalOrder, userImage } = req.body;
    const hash = await bcrypt.hash(password, 12);
    User.create({
        userEmail,
        password: hash,
        userName,
        totalOrder,
        userImage
    }).then(data => {
        req.session.user_id = data.id;
        res.send(data);
        //console.log(data);
    })
    .catch(err => {
        res.send({
        message:
            err.message || "Some error occurred while creating the Tutorial."
        });
    });
})

app.post("/login", (req, res) => {
    const { userEmail, password } = req.body;
    User.findOne({ where: { userEmail } })
    .then(async (user) => {
        if(!user) res.send({ message: "Invalid email or password!" });
        const validPassword = await bcrypt.compare(password, user.password);
        if(validPassword) {
            user.last_logged_in = Date.now();
           
            await user.save();
            req.session.user_id = user.id;
            res.redirect("/all");
        } else {
            res.redirect("/login");
        }
    })
    .catch((err) =>{
        res.send(err);
        console.log(err);
    });
})

app.get("/details/:id",(req,res)=> {
    if(!req.session.user_id){
        return res.redirect('/login');
     } 
    const {id} = req.params;
    User.findByPk(id)
    .then((user) => {
        if(!user) return res.send({ message: "User doesn't exists!" });
        res.send(user);
    })
    .catch((err) =>{
        res.send(err);
        console.log(err);
    });
})
 
app.put("/update/:id",(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
     } 
    const {id} = req.params;
    User.update(req.body, {
        where: { id: id }
      })
    .then((user) => {
        // if(!user) res.send({ message: "User doesn't exists!" });
        res.send({ message: "User update successfuly!" });
    })
    .catch((err) =>{
        res.send(err);
        console.log(err);
    });
})

app.get("/image/:id",(req,res)=> {
    if(!req.session.user_id){
        return res.redirect('/login');
     } 
    const {id} = req.params;
    User.findByPk(id)
    .then((user) => {
        if(!user) return res.send({ message: "User doesn't exists!" });
        res.send({user_image: user.userImage});
    })
    .catch((err) =>{
        res.send(err);
        console.log(err);
    });
})

app.delete("/delete/:id",(req,res)=>{
    if(!req.session.user_id){
       return res.redirect('/login');
    } 
    const {id} = req.params;
    User.destroy({
        where: { id: id }
      })
    .then((user) => {
        if(!user) res.send({ message: "User doesn't exists!" });
        res.send({ message: "User deleted successfuly!" });
    })
    .catch((err) =>{
        res.send(err);
        console.log(err);
    });
})

app.get("/insert",(req,res)=> { 
    res.render('insert');
})


app.get("/login",(req,res)=> { 
    res.render('login');
})


app.get('/update/:id',(req,res) =>{
    if(!req.session.user_id){
        return res.redirect('/login');
    } 
    const {id} =req.params;
    User.findByPk(id)
    .then((user) => {
        if(!user) return res.send({ message: "User doesn't exists!" });
        res.render("update",{user})
    })
    .catch((err) =>{
        res.send(err);
        console.log(err);
    });
})

app.get('/logout',(req,res)=>{
    if(req.session.user_id){

       req.session.user_id = null;
    } 
    res.redirect('/all');
})

db.sequelize.sync().then((req) => {
    app.listen(30011,() =>{
        console.log("started")
    });
    
});

