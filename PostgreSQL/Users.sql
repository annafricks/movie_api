CREATE TABLE Users (
  UserID serial PRIMARY KEY,
  Username varchar(50) NOT NULL,
  Password varchar(50) NOT NULL,
  Email varchar(50) NOT NULL,
  Birth_date date
);
