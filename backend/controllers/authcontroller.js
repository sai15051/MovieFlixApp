import User from "../models/user.js";

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()


export const signup = async (req, res, next) => {

    try {
        const { username, email, password } = req.body;
        if (!(username && email && password)) {
            return res.status(400).send("please enter all the required fields")
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ username, email, password: hashPassword });
        await user.save();


        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: "1h" });
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "you have registered successfully",
            success:true,
            user
        })
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "Incorrect password or email" });
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "Incorrect password or email" });
        }
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { expiresIn: "1h" });
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "User logged in successfully",
            success:true,
            user
        })
        next();
    } catch (error) {
        console.error(error);
    }
};

