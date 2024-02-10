CREATE TABLE Directors (
  DirectorID serial PRIMARY KEY,
  Name varchar(50) NOT NULL,
  Bio varchar(1000),
  Birthyear date,
  Deathyear date
);