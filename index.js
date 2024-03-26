const express = require('express'); //Express.js to create the web application//
const bodyParser = require('body-parser'); //for parsing request bodies//
const Path = require('path'); //Path for working with file paths//
const fs = require('fs'); //file system for file operations//
const morgan = require('morgan');
const uuid = require('uuid'); //for generating unique identifiers//

//added mongoose and connected database
const mongoose = require('mongoose'); //Mongoose to interact with MongoDB//
console.log('Connecting to MongoDB database using URI:', 'mongodb://localhost:27017/mongodb');
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mongodb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB database'))
.catch(err => console.error('Error connecting to MongoDB database', err));
//mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }); //mongoDB Atlas connection
//mongoose.connect('mongodb://localhost:27017/mongodb'); //{ useNewUrlParser: true, useUnifiedTopology: true }); //local connection

const Schema = mongoose.Schema; //Mongoose schema for defining the structure of the data//
const Models = require('./models.js'); //import your custom data models//
const Movies = Models.Movie; // Movie model //
const Users = Models.User; // User model //

//create an instance of the express application
const app = express(); //create an instance of the express application//

//to use CORS within my app
const cors = require('cors');
app.use(cors());
const { check, validationResult } = require('express-validator'); //for validating user input//

const passport = require('passport');
require('./passport'); //import the passport.js file//

//initialize middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan('common'));

//Import the auth middleware after initializing passport
let auth = require('./auth')(app); //import the auth.js file for login authentication////added mongoose and connected database

//load documentation page
app.use(express.static("public"));

app.post('/users', 
  [
  // Validation logic here
   //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  check("UserName", "UserName is required"),
  check(
    "UserName"),
  check('Password', 'Password is required').not().isEmpty(),
  check("Email", "Email does not appear to be valid").isEmail(),
],
async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
let hashedPassword = Users.hashPassword(req.body.Password);
await Users.findOne({ Username: req.body.Username }) //search to see if a user with the requested username already exists 
.then((user) => {
if (user) {
  //if the user is found, send a response that it already exists
  return res.status(400).send(req.body.Username + 'already exists');
} else {
  Users
  .create({
    Username: req.body.Username,
    Password: hashedPassword,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  })
  .then((user) =>{res.status(201).json(user) })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
}
})
  .catch((error) => {
  console.error(error);
  res.status(500).send('Error: ' + error);
  });
});

// Top RomCom movies
let movies = [
  {
    "Title":"How to Lose a Guy in 10 Days",
    "Director":"Donald Petrie",
    "Description": "An advice columnist tries pushing the boundaries of what she can write about in her new piece about how to get a man to leave you in 10 days, but her plan backfires as she falls for the guy she tries to bring down.",
    "Genre": {
      "Name":"Romantic Comedy",
      "Description": "A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
  },
  "Director": {
    "Name":"Donald Petrie",
    "Bio":"Donald Mark Petrie is an American actor, director, and screenwriter known for his movies How to Lose a Guy in 10 Days, Miss Congeniality and Grumpy Old Men.",
    "Birth":"April 2, 1954",
  },
  "ImagePath":"[]",
},
  {
    "Title":"Seven",
    "Director":"David Fincher",
    "Description":"Set in an unnamed, crime-ridden city, Seven's narrative follows disenchanted, near-retirement detective William Somerset (Freeman) and his newly transferred partner David Mills (Pitt) as they endeavor to thwart a serial killer from executing a series of murders based on the seven deadly sins.",
    "Genre": {
      "Name":"Mystery",
      "Description":"A mystery film is a genre of film that revolves around the solution of a problem or a crime.",
  },
  "Director": {
    "Name":"David Fincher",
    "Bio":"David Fincher is an American film director. Known for his psychological thrillers, his films have received 40 nominations at the Academy Awards, including three for him as Best Director.",
    "Birth":"August 28, 1962",
  }},
  {
    "Title": "Romy and Michele's High School Reunion",
    "Director": "David Mirkin",
    "Description": "Two dim-witted, inseparable friends hit the road for their ten-year high school reunion and concoct an elaborate lie about their lives in order to impress their classmates.",
    "Genre": {
      "Name":"Comedy",
      "Description":"Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter",
    },
    "Director": {
      "Name":"David Mirkin",
      "Bio":"David Mirkin is an American feature film and television director, writer and producer. Mirkin grew up in Philadelphia and intended to become an electrical engineer, but abandoned this career path in favor of studying film at Loyola Marymount University.",
      "Birth":"September 18, 1955",
    }},
        {
    "Title": "The Witch",
    "Director": "Robert Eggers",
    "Description": "The Witch is a chilling portrait of a family unraveling within their own sins, leaving them prey for an inconceivable evil.",
    "Genre": {
      "Name":"Horror",
      "Description":"Horror is a genre of literature, film, and television that is meant to scare, startle, shock, and even repulse audiences",
    },
    "Director": {
      "Name":"Robert Eggers",
      "Bio":"Robert Eggers is an American film director, screenwriter, and production designer. He is best known for his critically acclaimed horror films The Witch and The Lighthouse.",
      "Birth":"July 7, 1983",
    }},
        {
    "Title": "The Dark knight",
    "Director": "Christopher Nolan",
    "Description": "The plot follows the vigilante Batman, police lieutenant James Gordon, and district attorney Harvey Dent, who form an alliance to dismantle organized crime in Gotham City, who's efforts are dereailed by the Joker",
    "Genre": {
      "Name":"Action",
      "Description":"Action is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    "Director": {
      "Name":"Christopher Nolan",
      "Bio":"Christopher Edward Nolan is a British-American film director, producer, and screenwriter. His directorial efforts have grossed more than $5 billion worldwide, garnered 36 Oscar nominations and ten wins.",
      "Birth":"July 30, 1970",
    }},
        {
    "Title": "The Lord of the Rings: The Fellowship of the Ring",
    "Director":"Peter Jackson",
    "Description": "Set in Middle-earth, the story tells of the Dark Lord Sauron, who seeks the One Ring, which contains part of his might, to return to power.",
    "Genre": {
      "Name":"Fantasy",
      "Description":"Fantasy is a genre of speculative fiction set in a fictional universe, often inspired by real world myth and folklore.",
    },
    "Director": {
      "Name":"Peter Jackson",
      "Bio":"Sir Peter Robert Jackson is a New Zealand film director, producer, and screenwriter. He is best known as the director, writer, and producer of the Lord of the Rings trilogy and the Hobbit trilogy.",
      "Birth":"October 31, 1961",
    }},
        {
    "Title": "Killers of the Flower Moon",
    "Director": "Martin Scorsese",
    "Description": "Killers of the Flower Moon is a 2021 American crime drama film directed by Martin Scorsese, based on the 2017 non-fiction book of the same name by David Grann.", 
    "Genre": {
      "Name":"Drama",
      "Description":"Drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone, focusing on in-depth development of realistic characters who must deal with realistic emotional struggles.",
    },
    "Director": {
      "Name":"Martin Scorsese",
      "Bio":"Martin Charles Scorsese is an American film director, producer, screenwriter, and actor. One of the major figures of the New Hollywood era, he is widely regarded as one of the most significant and influential directors in film history.",
      "Birth":"November 17, 1942",
    }},
{
      "Title": "Jurassic Park",
      "Director": "Steven Spielberg",
      "Description": "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.", 
      "Genre": {
        "Name":"Science Fiction",
        "Description":"Science fiction is a genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.",
      },
      "Director": {
        "Name":"Steven Spielberg",
        "Bio":"Steven Spielberg is an American film director, producer, and screenwriter. He is considered one of the founding pioneers of the New Hollywood era and one of the most popular directors and producers in film history.",
        "Birth":"December 18, 1946",
      }},
      {
        "Title": "Pulp Fiction",
        "Director": "Quentin Tarantino",
        "Description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", 
        "Genre": {
          "Name":"Crime",
          "Description":"Crime films, in the broadest sense, are a cinematic genre inspired by and analogous to the crime fiction literary genre.",
        },
        "Director": {
          "Name":"Quentin Tarantino",
          "Bio":"Quentin Tarantino is an American film director, screenwriter, producer, and actor. His films are characterized by nonlinear storylines, dark humor, aestheticization of violence, extended scenes of dialogue, ensemble casts, references to popular culture and a wide variety of other films, eclectic soundtracks primarily containing songs and score pieces from the 1960s to the 1980s, alternate history, and features of neo-noir film.",
          "Birth":"March 27, 1963",
        }},
        {
          "Title": "The Wolf of Wall Street",
          "Director": "Martin Scorcese",
          "Description": "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.", 
          "Genre": {
            "Name":"Crime",
            "Description":"Crime films, in the broadest sense, are a cinematic genre inspired by and analogous to the crime fiction literary genre.",
          },
          "Director": {
            "Name":"Martin Scorsese",
            "Bio":"Martin Charles Scorsese is an American film director, producer, screenwriter, and actor. One of the major figures of the New Hollywood era, he is widely regarded as one of the most significant and influential directors in film history.",
            "Birth":"November 17, 1942",
          }},
  
  ]

let users = [
  {
    id: "658e4506ca2edb72552989db",
    Username: "LillyB",
    Password: "freebow098",
    Email: "lillyb@email.com",
    Birthday: {"$date":"1995-06-13"},
    FavoriteMovies: [{"$oid":"658e27ebca2edb72552989d6"},{"$oid":"658e07d8ca2edb72552989d3"}]
  },
  {
    id: "658e4606ca2edb72552989dc",
    Username: "BillieForest",
    Password: "jellybean23",
    Email: "billiebf@email.com",
    Birthday: {"$date":"1991-12-17"},
    FavoriteMovies: {"$oid":"658dfc18ca2edb72552989d0"},
  },
  {
    id: "658e4711ca2edb72552989dd",
    Username: "MadsaboutU",
    Password: "borninmilwaukee89",
    Email: "maddierue@email.com",
    Birthday: {"$date":"1989-04-15"},
    FavoriteMovies: {"$oid":"658e0542ca2edb72552989d1"},
  },
  {
  id: "658e47deca2edb72552989de",
  Username: "Romanofwar",
  Password: "strength29aaa",
  Email: "romanfusa24@email.com",
  Birthday: {"$date":"1994-01-07"},
  FavoriteMovies: {"$oid":"658e06bcca2edb72552989d2"},
  },
  {
    id: "658e48a2ca2edb72552989df",
    Username: "MitchWS",
    Password: "ila2023",
    Email: "mws1993@email.com",
    Birthday: {"$date":"1993-09-03"},
    FavoriteMovies: {"$oid":"658e402cca2edb72552989d9"},
},
]

// GET all users
app.get('/users', (req, res) => {
  res.status(200).json(users); // Assuming `users` is an array containing user data
});

// CREATE new user
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.post('/users', async (req, res) => 
  [
  // Validation logic here
  check("UserName", "UserName is required").isLength({ min: 5 }),
  check(
    "UserName",
    "UserName contains non alphanumeric characters - not allowed."
  ).isAlphanumeric(),
  check("Email", "Email does not appear to be valid").isEmail(),
],
async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
let hashedPassword = Users.hashPassword(req.body.Password);
await Users.findOne({ Username: req.body.Username }) //search to see if a user with the requested username already exists 
.then((user) => {
if (user) {
  //if the user is found, send a response that it already exists
  return res.status(400).send(req.body.Username + 'already exists');
} else {
  Users
  .create({
    Username: req.body.Username,
    Password: hashedPassword,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  })
  .then((user) =>{res.status(201).json(user) })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
}
})
  .catch((error) => {
  console.error(error);
  res.status(500).send('Error: ' + error);
  });
});

// UPDATE user data by username
app.put('/users/:username', (req, res) => {
  [
    check("UserName", "UserName is required").isLength({ min: 5 }),
    check(
      "UserName",
      "UserName contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.UserName !== req.params.username) {
      return res.status(400).send("Permission denied");
    }

 const updatedUser = {
      UserName: req.body.UserName,
      Email: req.body.Email,
      Birthdate: req.body.Birthdate,
    }
  
    if (req.body.Password) {
      updatedUser.Password = Users.hashPassword(req.body.Password);
    }

    await Users.findOneAndUpdate(
      { UserName: req.params.username },
      { $set: updatedUser },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  };

// Add new favorite movie for user
app.post('/users/:username/movies/:movieTitle',
passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({Title: req.params.movieTitle})
    .then( async (movie) => {
      if (!movie) {
        return res.status(404).json({error: "Movie not found"});
      }
      await Users.findOneAndUpdate(
        { UserName: req.params.username },
        { $push: { FavoriteMovies: req.params.movieTitle } },
        { new: true }
      )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
  });
  // old code: res.status(200).send('Movie ' + movieTitle + ' has been added to user ' + username + '\'s favorite list.');
});

// DELETE favorite movie for user
app.delete('/users/:username/movies/:movieTitle', (req, res) => {
  const { username, movieTitle } = req.params;
  
  // Find the user by username
  const userIndex = users.findIndex(user => user.Username === username);
  
  // Check if the user exists
  if (userIndex === -1) {
    return res.status(404).send('User not found.');
  }

  // Find the index of the movie in the user's favorite movies array
  const movieIndex = users[userIndex].FavoriteMovies.findIndex(title => title === movieTitle);
  
  // Check if the movie exists in the user's favorite movies
  if (movieIndex === -1) {
    return res.status(404).send('Movie not found in user\'s favorite list.');
  }

  // Remove the movie from the user's favorite movies array
  users[userIndex].FavoriteMovies.splice(movieIndex, 1);

  // Send a success response
  res.status(200).send(`Movie '${movieTitle}' has been removed from user '${username}'\'s favorite list.`);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const id = req.params;

  let user = users.find( user => user.id == id );


  if (user) {
      users = users.filter( user => user.id != id);
      res.status(200).send('User ' + id + ' has been deleted.');
  } else {
      res.status(400).send('No such user')
  }
})

// READ index page
app.get('/', (req, res) => {
  res.send('Welcome to my movie page!');
});
// READ all movies
//applying JWT authentication to the /movies endpoint  - DO I NEED BOTH (ABOVE AND BELOW)?
app.get('/movies', passport.authenticate('jwt', { session: false }),
async (req, res) => {
  await Movies.find()
  .then((movies) => {
  res.status(200).json(movies);
})
.catch((error) => {
  console.error(error);
  res.status(500).send('Error: ' + error);
  });
});

// READ movie by title
app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = movies.find(movie => movie.Title === title );

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('There is no such movie.')
  }
});

// READ data about a genre by name
app.get('/movies/genre/:genreName', (req, res) => {
  const genreName = req.params.genreName;
  const genre = movies.find( movie => movie.Genre.Name === genreName)?.Genre;

  if (genre) {
      res.status(200).json(genre);
  } else {
      res.status(400).send('There is no such genre.')
  }
});

// READ director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const directorName = req.params.directorName;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
      res.status(200).json(director);
  } else {
      res.status(400).send('There is no such director.')
  }
})


const accessLogStream = fs.createWriteStream(
  Path.join(__dirname, 'access.log'),
  { flags: 'a' } // 'a' means appending (old data will be preserved)
  );
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

// Define the GET route at "/movies"
app.get('/movies', (req, res) => {
  res.json({ movies });
});

// Define a GET route at "/" that returns a default textual response
app.get('/', (req, res) => {
  res.send('Welcome to my Movie Page!');
});

app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    });

// Start the Express server on a specific port (8081)
const port = process.env.PORT || 8081;
app.listen(port, '0.0.0.0'  ,() => {
  console.log('Listening on Port ' + port);
});