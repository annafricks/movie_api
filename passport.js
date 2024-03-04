const passport = require('passport'),
//defines the basic HTTP authentication for login requests:
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password',
        },
        async (username, password, callback) => {
            console.log('${username} ${password}');
            await Users.findOne({ Username: username })
            .then((user) => {
                if (!user) {
                    //if error occurs or username cannot be found, an error message is passed to the callback:
                    console.log('incorrect username');
                    return callback(null, false, { 
                        message: 'Incorrect username.'
                    });
                }
                if (!user.validatePassword(password)) {
                    console.log('incorrect password');
                    return callback(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                console.log('finished');
                return callback(null, user);
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                    return callback(error);
                }
            })
        }
    )
);

//setting up the JWT authentication strategy:
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //the secret key used to sign the JWT that verifies the sender of the JWT (the client) is who it says it is:
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findByID(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
     .catch ((error) => {
        return callback(error)
    });
}));