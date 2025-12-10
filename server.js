const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;
require('dotenv').config();
const adminAuth = require("./auth/adminAuth");
const clientAuth = require("./auth/clientAuth");
const supabase = require("./helpers/database/db");



app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/admin/signup", adminAuth.adminSignup);
app.post("/admin/login", adminAuth.adminLogin);
app.post("/client/signup", clientAuth.clientSignup);
app.post("/client/login", clientAuth.clientLogin);
app.get("/clients/all-clients", async (req, res) => {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});



app.listen(port);
