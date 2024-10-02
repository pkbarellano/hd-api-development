const { v1: uuidv1 } = require("uuid");

const uuidV1 = () => {

    return uuidv1();
};

module.exports = {
    uuidV1: uuidV1
};