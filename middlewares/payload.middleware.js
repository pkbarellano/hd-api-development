const crypto = require('../helpers/crypto.helper');
const { X_HD_KEY, UNAUTHORIZED } = require('../constants');

exports.body = async (req, res, next) => {

    const body = req.body;

    const key = req.header('X-HD-Key');

    const sign = req.header('X-HD-Sign');

    const bodySign = await (crypto.hmacSHA256(body));

    if (key !== X_HD_KEY) {

        console.log({
            'X_HD_KEY': X_HD_KEY
        });

        return res.status(401).send({ message: UNAUTHORIZED });
    } else {

        if (Object.keys(body).length === 0) {

            return next();
        }

        if (sign !== bodySign) {

            console.log({
                'request-sign': sign,
                'X-HD-Sign': bodySign
            });

            return res.status(401).send({ message: UNAUTHORIZED });
        } else {

            return next();
        }
    }
};