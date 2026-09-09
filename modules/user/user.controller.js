const userService = require("./user.service");


// =====================================
// REGISTER USER
// =====================================

const register = async (req, res) => {
    try {

        const user = await userService.registerUser(req.body);

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// =====================================
// LOGIN USER
// =====================================

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userService.loginUser(
            email,
            password
        );

        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {

        res.status(401).json({
            message: error.message
        });

    }
};


// =====================================
// GET ALL USERS
// =====================================

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


// =====================================
// GET USER BY ID
// =====================================

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


// =====================================
// UPDATE USER
// =====================================

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


// =====================================
// DELETE USER
// =====================================

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