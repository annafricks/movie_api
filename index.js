const express = require('express');
const Path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const uuid = require('uuid');

app.use(bodyParser.json());

// Top RomCom movies
let movies = [
  {
    "Title":"How to Lose a Guy in 10 Days",
    "Director":"Donald Petrie",
    "Description": "[]",
    "Genre": {
      "Name":"Romantic Comedy",
      "Description": "A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
  },
  "Director": {
    "Name":"Donald Petrie",
    "Bio":"[]",
    "Birth":"[]",
    "Death":"[]"
  },
  "ImagePath":"[]",
},
  {
    "Title":"Clueless",
    "Director":"Amy Heckerling",
    "Description":"[]",
    "Genre": {
      "Name":"Romantic Comedy",
      "Description":"A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
  }},
  {
    "Title": "10 Things I Hate About You",
    "Director": "Gil Junger",
    "Description": "[]",
    "Genre": {
      "Name":"Romantic Comedy",
      "Description":"A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
  }},
        {
    "Title": "The Proposal",
    "Director": "Anne Fletcher",
    "Description": "[]",
    "Genre": {
      "Name":"Romantic Comedy",
      "Description":"A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
  }},
        {
    "Title": "About Time",
    "Director": "Richard Curtis",
    "Description": "[]",
    "Genre": {
      "Name":"Romantic Comedy",
      "Description":"A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
    }},
        {
    "Title": "She\'s All That",
    "Director":"Robert Iscove",
    "Description": "[]",
    "Genre": {
      "Name":"Romantic Comedy",
      "Description":"A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
    }},
        {
    "Title": "Crazy Stupid Love",
    "Director": "Glenn Ficarra, John Requa",
    "Description": "[]", 
    "Genre": {
      "Name":"Romantic Comedy",
      "Description":"A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.",
    }}
]

let users = [
  {
    id: 1,
    name: 'Jane Doe',
    favoriteMovies: []
  },
  {
    id: 2,
    name: 'John Doe',
    favoriteMovies: ["Clueless"]
  }
]

// CREATE new user
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser)
  } else {
      res.status(400).send('Name is required.')
  }
})

// UPDATE user information
app.put('/users/:id', (req, res) => {
  const id = req.params;
  const updatedUser = req.body;


  let user = users.find( user => user.id == id );

  if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
  } else {
      res.status(400).send('No such user.')
  }
})

// CREATE new favorite movie for user
app.post('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );


  if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(movieTitle + ' has been added to user ' + id + '\'s array');
  } else {
      res.status(400).send('There is no such user')
  }
})

// DELETE favorite movie for user
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );


  if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send(movieTitle + ' has been removed from user ' + id + '\'s array.');
  } else {
      res.status(400).send('No such user')
  }
})

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

// READ movie list
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.title === title );

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('There is no such movie.')
  }
})

// READ data about a genre by name
app.get('/movies/genre/genreName', (req, res) => {
  const genreName = req.params.genreName;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
      res.status(200).json(genre);
  } else {
      res.status(400).send('There is no such genre.')
  }
})

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

// Start the Express server on a specific port (8080)
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


