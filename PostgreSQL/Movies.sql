CREATE TABLE Movies (
  MovieId serial PRIMARY KEY,
  Title varchar(50) NOT NULL,
  Description varchar(1000),
  DirectorID integer NOT NULL,
  GenreID integer NOT NULL,
  ImageURL varchar(300),
  Featured boolean,
  CONSTRAINT GenreKey FOREIGN KEY (GenreID)
    REFERENCES Genres (GenreID),
  CONSTRAINT DirectorKey FOREIGN KEY (DirectorID)
    REFERENCES Directors (DirectorID)
);