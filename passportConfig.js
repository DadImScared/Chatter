
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

module.exports = function(passport, secretKey, userModel) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secretKey
  };

  const strategy = new JwtStrategy(opts, async (payload, next) => {
    try {
      const user = await userModel.findOne({ _id: payload.id });
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    } catch (e) {
      return next(e, false);
    }
  });
  passport.use(strategy);
};
