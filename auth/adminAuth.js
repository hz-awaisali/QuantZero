const supabase = require("../helpers/database/db");
const { hashPassword, comparePassword } = require("../helpers/hashing/hash");
const { generateToken } = require("../helpers/jwt/jwt");

exports.adminSignup = async (req, res) => {
    const { username, name, email, password } = req.body;

    const hashed = await hashPassword(password);

    const { data, error } = await supabase
        .from("admins")
        .insert([{ name, username, email, password: hashed }]);

    if (error) return res.status(400).json({ error });

    res.json({ message: "Admin registered successfully" });
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    const { data: admins, error } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !admins) 
        return res.status(404).json({ error: "Admin not found" });

    const match = await comparePassword(password, admins.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    const token = generateToken({ id: admins.id });

    res.json({ message: "Login successful", token });
};
