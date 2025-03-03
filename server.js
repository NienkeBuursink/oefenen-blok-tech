// mongodb start
require('dotenv').config();

const { MongoClient, ObjectID } = require("mongodb");
const uri = process.env.URI;

const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME);

async function connectDB() {
    try {
        await client.connect();
        console.log("client connected to database");
    } catch (error) {
        console.log(error);
    }
}

connectDB();


// express
const express = require("express");
const x = express();

x.set("view engine", "ejs");

x.use(express.urlencoded({extended: true}));

x.get("/", onhome);
x.get("/about", about);
x.get("/login", login);
x.get("/harrypotter", showApi);
x.post("/login", loggedin);

x.listen(8000)
x.use("/static", express.static("static"));

function onhome(req, res){
    var mascots = [
        { 
            name: 'Sammy', 
            organization: "DigitalOcean", 
            birth_year: 2012,
            looks: "static/images/sammy.png"
        },
        { 
            name: 'Tux', 
            organization: "Linux", 
            birth_year: 1996,
            looks: "static/images/tux.png"
        },
        { 
            name: 'Moby Dock', 
            organization: "Docker", 
            birth_year: 2013,
            looks: "static/images/moby-dock.jpg"
        }
    ];
    var tagline = "No programming concept is complete without a cute animal mascot.";
    
    res.render("pages/index", {
        mascots: mascots,
        tagline: tagline
    });
}

function about(req, res){
    res.render("pages/about")
}

function login(req, res){
    console.log(req.body);
    res.render("pages/login");
}

function showApi(req, res){
    console.log(req.body);
    res.render("pages/harrypotter");
}

async function loggedin(req, res) {
    try {
        console.log(req.body);
        const loginGegevens = db.collection("users");
        const result = await loginGegevens.insertOne(req.body);
        res.render("pages/loggedin", req.body);
    } catch (error) {
        console.log(error);
    }
    
}



// error
x.use((req, res) => {
    res.status(404).render("pages/404", { url: req.url });
});



