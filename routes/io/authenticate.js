
const jwt = require('jsonwebtoken');

exports.override = function(app) {
  const { io, models: { User } } = app;
  io.use((socket, next) => {
    const { token } = socket.handshake.query;
    jwt.verify(token, process.env.SECRET_KEY, async function(err, { id }) {
      if (err) {
        const authError = new Error();
        authError.data = { type: 'authenticationError' };
        return next(authError);
      }
      try {
        const user = await User.findOne({ _id: id });
        if (user) {
          socket.user = user;
          next();
        } else {
          const authError = new Error();
          authError.data = { type: 'authenticationError' };
          return next(authError);
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
};
