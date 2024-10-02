const crypto = require('crypto');

const secret = '9x2rTsyBqcAC8GDH0KypEXYsbBEyKQR7';
const algorithm = 'SHA256';

const hmacSHA256 = data => {

    const hash = crypto.createHmac(algorithm, secret)
        .update(JSON.stringify(data))
        .digest('hex');

    return hash;
};

module.exports = {
    hmacSHA256: hmacSHA256
};