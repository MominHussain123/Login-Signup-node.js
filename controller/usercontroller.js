
const { Users } = require("../model/usermodel.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring")
const bcrypt = require("bcrypt");
const saltround = 10;
const seckey = "Web Development";
require('dotenv').config();


const signup = async (req, resp) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if email already exists
        const Existemail = await Users.findOne({ email: email });
        // Check if fullName already exists
        const Existfname = await Users.findOne({ fullName: fullName });

        if (Existemail) {
            return resp.send("This Email already exists");
        }
        if (Existfname) {
            return resp.send("This Fullname already exists");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return resp.status(404).send("Please enter a valid email address.");
        }
        const passwordlength = /^.{6,}$/
        const passwordLowercase = /^(?=.*[a-z])/;
        const passwordUppercase = /^(?=.*[A-Z])/;
        const passwordNumber = /^(?=.*\d)/;
        const passwordSpecialCharacters = /^(?=.*[\W_])/;
        if (!passwordlength.test(password)) {
            return resp.send("Password must be at least 6 characters");
        }
        else if (!passwordLowercase.test(password)) {
            return resp.send("Password must be contain lowercase");
        }
        else if (!passwordUppercase.test(password)) {
            return resp.send("Password must be contain uppercase");
        }
        else if (!passwordNumber.test(password)) {
            return resp.send("Password must be contain numbers");
        }
        else if (!passwordSpecialCharacters.test(password)) {
            return resp.send("Password must be contain  special characters.");
        }


        const salt = bcrypt.genSaltSync(saltround);
        const hash = bcrypt.hashSync(password, salt);


        // Create new user
        const data = new Users({
            fullName: fullName,
            email: email,
            password: hash,
            randomToken: "",
        });

        // Save user data
        data.save();

        resp.status(201).send({
            message: "User registered successfully",
            data: data
        });
    } catch (error) {
        resp.send({
            status: 200,
            message: "An error occurred",
            error: error.message,
        });
    }
};


const login = async (req, resp) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const getdata = await Users.findOne({ email: email });
        console.log(getdata);
        if (!getdata) {
            return resp.status(404).send("User not found");
        }
        // Compare passwords
        const match = bcrypt.compareSync(password, getdata.password);
        if (!match) {
            return resp.status(404).send("Incorrect password");
        }
        jwt.sign({ getdata }, seckey, { expiresIn: "60m" }, (err, token) => {
            if (err) return resp.send({ err: err })
            resp.send({
                status: 200,
                message: "Login successfully",
                data: getdata,
                token: token
            });
        })
    } catch (error) {
        resp.status(200).send({
            message: "An error occurred",
            error: error.message
        });
    }
};

const forgotpassword = async (req, resp) => {
    try {
        const { email } = req.body

        const getdata = await Users.findOne({ email: email });
        if (getdata) {
            const randomString = randomstring.generate();

            const data = await Users.updateOne(
                { email: email },
                { $set: { randomToken: randomString } }
            )
            sendEmail(getdata.fullName, getdata.email, randomString)
            resp.send({
                status: true,
                message: "Please check your email",
            })
        }
        else {
            return resp.send("Email not found");
        }
    } catch (error) {
        resp.send({
            status: 400,
            message: "Error occurred",
            error: error.message
        });
    }
}



const sendEmail = async (name, email, token) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "hafizmominhussain222@gmail.com",
                pass: process.env.TRANSPORT_PASSWORD,
            },
        });
        const mailOption = {
            from: "hafizmominhussain222@gmail.com",
            to: email,
            subject: "for reset password",
            html: `<p>hi ${name} ,please copy this link <a href='http://localhost:8000/resetpassword.html?token=${token}'>reset password</a> `
        }
        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("mail has sent", info.response);
            }
        })
    }
    catch (error) {
        console.error("Error occurred: ", error);
    }
};


const resetpassword = async (req, resp) => {
    try {
        const token = req.query.token;
        const tokenData = await Users.findOne({ randomToken: token });

        if (tokenData) {
            const password = req.body.password;
            const passwordlength = /^.{6,}$/
            const passwordLowercase = /^(?=.*[a-z])/;
            const passwordUppercase = /^(?=.*[A-Z])/;
            const passwordNumber = /^(?=.*\d)/;
            const passwordSpecialCharacters = /^(?=.*[\W_])/;
            if (!passwordlength.test(password)) {
                return resp.send("Password must be at least 6 characters");
            }
            else if (!passwordLowercase.test(password)) {
                return resp.send("Password must be contain lowercase");
            }
            else if (!passwordUppercase.test(password)) {
                return resp.send("Password must be contain uppercase");
            }
            else if (!passwordNumber.test(password)) {
                return resp.send("Password must be contain numbers");
            }
            else if (!passwordSpecialCharacters.test(password)) {
                return resp.send("Password must be contain  special characters.");
            }
            const salt = bcrypt.genSaltSync(saltround);
            const hash = bcrypt.hashSync(password, salt);

            const userdata = await Users.findByIdAndUpdate(tokenData._id, { $set: { password: hash, randomToken: "" } }, { new: true });
            resp.send({
                status: 200,
                message: "Password updated successfully",
                success: true
            });
        } else {
            resp.send({
                status: 404,
                message: "Invalid token",
                success: false
            });
        }
    } catch (error) {
        resp.send({
            status: 500,
            message: "Error occurred",
            error: error.message
        });
    }
};
module.exports = {
    signup,
    login,
    forgotpassword,
    resetpassword
}