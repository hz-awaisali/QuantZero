const supabase = require("../helpers/database/db");
const { hashPassword, comparePassword } = require("../helpers/hashing/hash");
const { generateToken } = require("../helpers/jwt/jwt");

exports.clientSignup = async (req, res) => {
    const { username, company, name, email, password } = req.body;

    const hashed = await hashPassword(password);

    const { error } = await supabase
        .from("clients")
        .insert([{ name, company, username, email, password: hashed }]);

    if (error) return res.status(400).json({ error });

    res.json({ message: "Client registered successfully" });
};

exports.clientLogin = async (req, res) => {
    const { email, password } = req.body;

    const { data: client, error } = await supabase
        .from("clients")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !client) 
        return res.status(404).json({ error: "Client not found" });

    const match = await comparePassword(password, client.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    const token = generateToken({ id: client.id });

    res.json({ message: "Login successful", token });
};
