
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

module.exports = function(app) {
  const { User } = app.models;
  app.use(passport.initialize());
  setupStrategy(passport, process.env.SECRET_KEY, User);
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};

function setupStrategy(passport, secretKey, userModel) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secretKey
  };

  const strategy = new JwtStrategy(opts, async (payload, next) => {
    try {
      const user = await userModel.findOne({ _id: payload.id });
      if (user) {
        next(null, user);
      }
      else {
        next(null, false);
      }
    }
    catch (e) {
      return next(e, false);
    }
  });
  passport.use(strategy);
}
