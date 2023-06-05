
'use strict';
const jwt = require('jsonwebtoken'),
    rm = require("@root/rm");

class JWTProvider {
    constructor() {
        this.config = rm.appConfig.jwt;
    }

    create(args) {
        try {
            const token = jwt.sign(Object.assign({}, args), this.config.secret, {
                expiresIn: this.config.expiryInSec
            });
            let dummytoken = token.split(".")
            dummytoken[1] = dummytoken[1].split("").reverse().join("") + "cisapp"

            return dummytoken.join(".");
        } catch (error) {
            rm.logger.error(error);
            console.error(error);
            return false;
        }
    }

    verify(token) {
        try {
            let dummytoken = token.split(".")
            dummytoken[1] = dummytoken[1].replace("cisapp", "").split("").reverse().join("")
            token = dummytoken.join(".");
            const decoded = jwt.verify(token, this.config.secret);
            return { success: true, data: decoded };
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

module.exports = JWTProvider;