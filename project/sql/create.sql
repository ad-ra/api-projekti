DROP TABLE IF EXISTS home;

CREATE TABLE home
(
    id              INTEGER         NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    , address       VARCHAR(200)    NOT NULL
    , city          VARCHAR(100)    NOT NULL
    , region        VARCHAR(50)     NOT NULL
    , zipcode       VARCHAR(20)     NOT NULL
    , created       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
    , updated       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP

    , UNIQUE        (address, zipcode)
);

DROP TABLE IF EXISTS person;

CREATE TABLE person
(
    id              INTEGER         NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    , fname         VARCHAR(100)
    , lname         VARCHAR(100)
    , phone         VARCHAR(15)
    , email         VARCHAR(100)    NOT NULL UNIQUE
    , salary        NUMERIC(7)
    , job           VARCHAR(50)
    , birth         DATE
    , homeaddress   VARCHAR(200)    NOT NULL
    , homezip       VARCHAR(20)     NOT NULL
    , created       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
    , updated       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP

    , CONSTRAINT    person_home_fk
    FOREIGN KEY     (homeaddress, homezip)
    REFERENCES      home(address, zipcode)
);

DROP TABLE IF EXISTS pet;

CREATE TABLE pet
(
    id              INTEGER         NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    , name          VARCHAR(100)
    , type          VARCHAR(100)
    , breed         VARCHAR(100)
    , age           INTEGER
    , birthday      DATE
    , weight        NUMERIC(6, 2)
    , specialneeds  VARCHAR(2000)
    , owneremail    VARCHAR(100)    NOT NULL
    , created       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
    , updated       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP

    , CONSTRAINT    pet_owner_fk
    FOREIGN KEY     (owneremail)
    REFERENCES      person(email)
);
