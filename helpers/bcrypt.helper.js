const bcrypt = require('bcrypt');
const saltRounds = 10;

const encryptPassword = password => {

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
};

const comparePassword = (password, hash) => {

    const compareHash = bcrypt.compareSync(password.toString(), hash);

    return compareHash;
};

module.exports = {
    encryptPassword: encryptPassword,
    comparePassword: comparePassword
};