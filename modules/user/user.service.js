const bcrypt = require("bcrypt");
const User = require("./user.model");


// ===============================
// REGISTER USER
// ===============================

const registerUser = async (userData) => {

    const { name, email, phone, password } = userData;

    // Check whether email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword
    });

    return user;
};


// ===============================
// LOGIN USER
// ===============================

const loginUser = async (email, password) => {

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    return user;
};


// ===============================
// GET ALL USERS
// ===============================

const getAllUsers = async () => {

    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    return users;
};


// ===============================
// GET USER BY ID
// ===============================

const getUserById = async (id) => {

    const user = await User.findById(id)
        .select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


// ===============================
// UPDATE USER
// ===============================

const updateUser = async (id, updateData) => {

    const user = await User.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


// ===============================
// DELETE USER
// ===============================

const deleteUser = async (id) => {

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};