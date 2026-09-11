const userService = require("./user.service");
const generateToken = require("../../utils/generateToken");

const {
    validateUser,
    validateLogin
} = require("../../utils/validation");


// REGISTER

const register = async (req, res, next) => {
    try {

        // Validate user input

        const errors = validateUser(req.body);

        // If validation errors exist

        if (Object.keys(errors).length > 0) {

            return res.status(400).json({
                message: "Validation failed",
                errors
            });

        }

        // Register user

        const user =
            await userService.registerUser(req.body);

        res.status(201).json({
            message: "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {

        next(error);

    }
};


// LOGIN

const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        // Validate login input

        const errors = validateLogin({
            email,
            password
        });

        // If validation errors exist

        if (Object.keys(errors).length > 0) {

            return res.status(400).json({
                message: "Validation failed",
                errors
            });

        }

        // Check login credentials

        const user =
            await userService.loginUser(
                email,
                password
            );

        // Generate JWT token

        const token =
            generateToken(
                user._id,
                user.role
            );

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {

        next(error);

    }
};


// GET ALL USERS

const getUsers = async (req, res, next) => {
    try {

        const users =
            await userService.getAllUsers();

        res.status(200).json({
            users
        });

    } catch (error) {

        next(error);

    }
};


// GET ONE USER

const getUser = async (req, res, next) => {
    try {

        const user =
            await userService.getUserById(
                req.params.id
            );

        res.status(200).json({
            user
        });

    } catch (error) {

        next(error);

    }
};


// UPDATE USER

const updateUser = async (req, res, next) => {
    try {

        const user =
            await userService.updateUser(
                req.params.id,
                req.body
            );

        res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (error) {

        next(error);

    }
};


// DELETE USER

const deleteUser = async (req, res, next) => {
    try {

        await userService.deleteUser(
            req.params.id
        );

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    register,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};