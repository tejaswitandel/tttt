/*
 * admin authentication - with passport
 */

const { Strategy, ExtractJwt } = require("passport-jwt")
const { JWT } = require("./authConstant")
const user = require("../model/user")

let token = null;
const jwtExtractor = (req) => {
    if (req && req.headers) {
        let tokenParts = req.headers.authorization.split(' ');
        if (/^Bearer$/i.test(tokenParts[0])) { 
            token = tokenParts[1];
        }
    }
    return token;
};

module.exports = {
    adminPassportStrategy: passport => {
        const options = {};
        options.jwtFromRequest =jwtExtractor;        options.secretOrKey = JWT.ADMIN_SECRET;
        passport.use('admin-rule',
            new Strategy(options, (payload, done) => {
                user.findOne({ username: payload.username }, (err, user) => {
                    if (err) {
                        // console.log(err)
                        return done(err, false);
                    }
                    if (user) {
                        if(user.tokens.includes(token)){
                            return done(null, {
                                ...user.toJSON()
                                });
                        }
                    }
                    return done('No User Found', {});
                });
            })
        );
    }
}