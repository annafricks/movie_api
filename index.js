const express = require('express');
const Path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// Top RomCom movies
const topMovies = [
  {
    title: 'How to Lose a Guy in 10 Days',
    director: 'Donald Petrie',
    year: 2003,
    genre: 'Romantic Comedy',
      description: 'A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.',
  },
  {
    title: 'Clueless',
    director: 'Amy Heckerling',
    year: 1995,
    genre: 'Romantic Comedy',
    description: 'A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.',
  },
  {
    title: '10 Things I Hate About You',
    director: 'Gil Junger',
    year: 1999,
    genre: 'Romantic Comedy',
    description: 'A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.',
  },
        {
    title: 'The Proposal',
    director: 'Anne Fletcher',
    year: 2009,
    genre: 'Romantic Comedy',
    description: 'A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.',
  },
        {
    title: 'About Time',
    director: 'Richard Curtis',
    year: 2013,
    genre: 'Romantic Comedy',
    description: 'A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.',
    },
        {
    title: 'She\'s All That',
    director: 'Robert Iscove',
    year: 1999,
    genre: 'Romantic Comedy',
    description: 'A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.',
    },
        {
    title: 'Crazy Stupid Love',
    director: 'Glenn Ficarra, John Requa',
    year: 2011,
    genre: 'Romantic Comedy',
    description: 'A subgenre of comedy and romance films that focuses on two people falling in love amidst comical circumstances.',
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
  const id = req.params.id;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
  } else {
      res.status(400).send('No such user found.')
  }
})

// POST new favorite movie for user
app.post('/users/:id/movies/:MovieID', (req, res) => {
  const id = req.params.id;
  const movieTitle = req.params.movieTitle;

  let user = users.find( user => user.id == id );


  if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(movieTitle + ' has been added to user ' + id + '\'s array');
  } else {
      res.status(400).send('There is no such user')
  }
})

// DELETE favorite movie for user
app.delete('/users/:id/movies/:MovieID', (req, res) => {
  const id = req.params.id;
  const movieTitle = req.params.movieTitle;

  let user = users.find( user => user.id == id );


  if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send(movieTitle + ' has been removed from user ' + id + '\'s array.');
  } else {
      res.status(400).send('No such user found')
  }
})

// DELETE user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  let user = users.find( user => user.id == id );


  if (user) {
      users = users.filter( user => user.id != id);
      res.status(200).send('User ' + id + ' has been deleted.');
  } else {
      res.status(400).send('No such user found')
  }
})

// READ index page
app.get('/', (req, res) => {
  res.send('Welcome to my movie page!');
});

// READ movie list
app.get('/movies', (req, res) => {
  res.status(200).json(topMovies);
});

// READ movie by title
app.get('/movies/:Title', (req, res) => {
  const title = req.params.title;
  const movie = topMovies.find( movie => movie.title === title );

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('There is no such movie.')
  }
})

// READ movie info by title
app.get('/movies/:[title]', (req, res) => {
  const title = req.params.title;
  const movie = topMovies.find( movie => movie.title === title );

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('There is no such movie.')
  }
})

// READ data about a genre by name
app.get('/movies/genre/[genreName]', (req, res) => {
  const genreName = req.params.genreName;
  const genre = topMovies.find( movie => movie.genre.genreName === genreName ).genre;

  if (genre) {
      res.status(200).json(genre);
  } else {
      res.status(400).send('There is no such genre.')
  }
})

// READ director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const directorName = req.params.directorName;
  const director = topMovies.find( movie => movie.director.directorName === directorName ).director;

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
  res.json({ topMovies });
});

// Define a GET route at "/" that returns a default textual response
app.get('/', (req, res) => {
  res.send('Welcome to my Top Rom Coms!');
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