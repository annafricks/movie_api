const express = require('express');
const Path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// Top 10 RomCom movies
const top10Movies = [
  {
    title: 'How to Lose a Guy in 10 Days',
    director: 'Donald Petrie',
    year: 2003
  },
  {
    title: 'Clueless',
    director: 'Amy Heckerling',
    year: 1995
  },
    {
    title: '10 Things I Hate About You',
    director: 'Gil Junger',
    year: 1999
    },
        {
    title: 'The Proposal',
    director: 'Anne Fletcher',
    year: 2009
        },
            {
    title: 'About Time',
    director: 'Richard Curtis',
    year: 2013
            },
                {
    title: 'She\'s All That',
    director: 'Robert Iscove',
    year: 1999
                },
                    {  
    title: 'Crazy Stupid Love',
    director: 'Glenn Ficarra, John Requa',
    year: 2011
                    }
];

const accessLogStream = fs.createWriteStream(
  Path.join(__dirname, 'access.log'),
  { flags: 'a' } // 'a' means appending (old data will be preserved)
  );
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

// Define the GET route at "/movies"
app.get('/movies', (req, res) => {
  res.json({ top10Movies });
});

// Define a GET route at "/" that returns a default textual response
app.get('/', (req, res) => {
  res.send('Welcome to my Top10 Rom Coms!');
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