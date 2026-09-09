const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {

    const token = jwt.sign(
        {
            userId,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return token;
};

module.exports = generateToken;