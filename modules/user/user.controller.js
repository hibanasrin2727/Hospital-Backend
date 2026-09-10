const userService = require("./user.service");
const generateToken = require("../../utils/generateToken");


// REGISTER
const register = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);

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
        res.status(400).json({
            message: error.message
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.loginUser(
            email,
            password
        );

        // Generate JWT token
        const token = generateToken(
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
        res.status(401).json({
            message: error.message
        });
    }
};


// GET ALL USERS
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            users
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ONE USER
const getUser = async (req, res) => {
    try {
        const user = await userService.getUserById(
            req.params.id
        );

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};


// UPDATE USER
const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// DELETE USER
const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(
            req.params.id
        );

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
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