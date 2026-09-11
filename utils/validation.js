// CHECK EMAIL

const isValidEmail = (email) => {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
};


// CHECK PHONE

const isValidPhone = (phone) => {
    const phonePattern =
        /^[0-9]{10}$/;

    return phonePattern.test(phone);
};


// CHECK REQUIRED FIELD

const isRequired = (value) => {
    return (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );
};


// USER VALIDATION

const validateUser = ({
    name,
    email,
    phone,
    password
}) => {

    const errors = {};

    if (!isRequired(name)) {
        errors.name = "Name is required";
    }

    if (!isRequired(email)) {
        errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
        errors.email = "Invalid email format";
    }

    if (!isRequired(phone)) {
        errors.phone = "Phone is required";
    } else if (!isValidPhone(phone)) {
        errors.phone =
            "Phone must contain exactly 10 digits";
    }

    if (!isRequired(password)) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password =
            "Password must be at least 6 characters";
    }

    return errors;
};


// LOGIN VALIDATION

const validateLogin = ({
    email,
    password
}) => {

    const errors = {};

    if (!isRequired(email)) {
        errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
        errors.email = "Invalid email format";
    }

    if (!isRequired(password)) {
        errors.password = "Password is required";
    }

    return errors;
};


module.exports = {
    isValidEmail,
    isValidPhone,
    isRequired,
    validateUser,
    validateLogin
};