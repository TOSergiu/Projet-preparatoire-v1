let express = require('express');
let path = require('path');
let app =express();


// Set Ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//prendre css de /static
app.use(express.static(path.join(__dirname, 'static')));

//home page
app.get('/',(req,res) => {
    let user =  null;
    let currentDate = new Date().toLocaleDateString();

    res.render('home', {user,currentDate});
});

app.get('/incident',(req,res)=>{
    let user = null;

    res.render('incident',{user});
})

app.get('/signUp',(req,res)=>{
    let user = null;
    res.render('sign_up',{user});
})

app.get('/signIn',(req,res)=>{
    let user = null;
    res.render('log_in',{user});
})


app.listen(3000);