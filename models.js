const mongoose = require('mongoose');
//now define the schema//
let movieSchema = mongoose.Schema({ 
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

const bcrypt = require('bcrypt'); //import bcrypt to hash passwords//
//now define the schema for the user//
let userSchema = mongoose.Schema({
    //required: true means that the field must be filled in. type: string the value MUST be a string//
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    //birthday is key, date is the value of the data type. so wherever there is a birthday, it must be filled with the value of the data type DATE//
    Birthday: Date,
    FavoriteMovies:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };

//define movie and user models//
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

//export models to use in other modules//
module.exports.Movie = Movie;
module.exports.User = User;