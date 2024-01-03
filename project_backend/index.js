const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Message = require("./models/message");
const User = require("./models/user");
const fs = require("fs");
const lame = require("node-lame");
const id3 = require("id3-parser");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.post("/signup", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(422).json({ message: "User already exists, Please Log in" });
    }
    const rounds = 10;
    const hashedPassword = await bcrypt.hash(password, rounds);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ username, message: "User registered Successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/delete-chat", async (req,res) => {
  try{
    const {username} = req.body;
    const existingUser = await User.findOne({username});
    await Message.deleteMany(existingUser);
    res.status(201).json({ message : "Delete Successfull"});
  }
  catch(e){
    res.status(500).json({message : "Server error"});
  }
})

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      console.log(username);
      res.status(404).json({ message: "User doesn't exist, Please Sign Up!!" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      const secretkey = process.env.SECRET_KEY;
      console.log(existingUser.username, existingUser.name);
      // const token = jwt.sign({username: existingUser.username,name: existingUser.name},secretkey);
      const token = {
        username: existingUser.username,
        name: existingUser.name,
      };
      console.log(token, "successfull");
      res.status(201).json({ token: token, username: existingUser.username });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/get-conversation", async (req, res) => {
  try {
    const { username } = req.query;
    console.log(username);
    const existingUser = await User.findOne({username : username});
    if (!existingUser) {
      res.status(404).json({ message: "User not Found" });
    }
    const messages = await Message.find({ sender: existingUser });
    res.status(201).json({ message: messages });
  } catch (e) {
    console.log(e);
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("welcome", socket.id);
  socket.on("user_message", async ({ from, content, username }) => {
    console.log(username);
    const reply = await resp(content);
    await store(content, 1, username);
    await store(reply.data.data.conversation.output, 0, username);
    io.to(from).emit("gpt_reply", {
      reply_text: reply.data.data.conversation.output,
    });
  });
  //   socket.on("sendMessage", (message) => {});
});

const store = async (content, isUser, username) => {
  try {
    const user = await User.findOne({ username });
    console.log("Saved Successful at :", username);
    const msg = new Message({
      sender: user,
      content: content,
      isUser: isUser,
    });
    await msg.save();
  } catch (e) {
    console.log("Error : ", e);
  }
};

const port = 3001;
server.listen(port, () => {
  console.log("Server has started successfully!!!");
});

const resp = async (m) => {
  try {
    const msg = m;
    console.log(m);
    const options = {
      method: "POST",
      url: "https://lemurbot.p.rapidapi.com/chat",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.API_KEY,
        "X-RapidAPI-Host": "lemurbot.p.rapidapi.com",
      },
      data: {
        bot: "dilly",
        client: "d531e3bd-b6c3-4f3f-bb58-a6632cbed5e2",
        message: m,
      },
    };
    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
};
