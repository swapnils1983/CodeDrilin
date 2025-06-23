const validator = require('validator')

const validate = (data) => {
    const mandatoryField = ['firstName', 'emailId', 'password']

    const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k))

    if (!isAllowed) {
        throw new Error("Missing Field")
    }

    if (!validator.isEmail(data.emailId)) {
        throw new Error("Invalid Email")
    }

    // if (!validator.isStrongPassword(data.password)) {
    //     throw new Error("Weak password")
    // }
}

module.exports = validate