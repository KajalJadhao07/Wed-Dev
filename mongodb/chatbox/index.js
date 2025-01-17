const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
.then(()=>{
    console.log("connection successful"); 
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/chats/new", (req,res)=>{
    res.render("new.ejs");
})

//index route
app.post("/chats", (req,res)=>{
    let {from, to, msg}= req.body;
    let newChat = new Chat ({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    newChat.save()
    .then((res)=>{
        console.log("Chat was saved");
    })
    .catch((err)=>{
        console.log(err);
    })
    res.redirect("/chats");
})

//index route
app.get("/chats", async (req,res)=>{
    try {
        const chats = await Chat.find();
        res.render("index", { chats }); // Render the view with the chats data
      } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).send("Internal Server Error");
      }
})

//edit route
app.get("/chats/:id/edit", async (req,res)=>{
    let {id}= req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
})

//update route
app.put("/chats/:id" , async (req,res)=>{
    let {id}= req.params;
    let {msg : newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg},{runValidators : true, new: true});
    console.log(updatedChat);
    res.redirect("/chats");
})

//delete route
app.delete("/chats/:id", async (req,res)=>{
    let {id}= req.params;
    let chatdeleted = await Chat.findByIdAndDelete(id);
    console.log(chatdeleted);
    res.redirect("/chats");
})

app.get ("/", (req,res)=>{
    res.send("Route is working");
})

app.listen(8080 , ()=>{
    console.log("Server is listening")
});