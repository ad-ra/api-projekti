-- INSERT HOME --
INSERT INTO home (address, city, region, zipcode)
VALUES ('Kasarmikatu 11', 'Helsinki', 'Uusimaa', '00100');
INSERT INTO home (address, city, region, zipcode)
VALUES ('Brahenkatu 13', 'Turku', 'Varsinais-Suomi', '20100');
INSERT INTO home (address, city, region, zipcode)
VALUES ('Verkatehtaankatu 14', 'Tampere', 'Pirkanmaa', '33100');
INSERT INTO home (address, city, region, zipcode)
VALUES ('Kiviharjuntie 15', 'Oulu', 'Pohjois-Pohjanmaa', '90100');
INSERT INTO home (address, city, region, zipcode)
VALUES ('Yliopistonkatu 24', 'Jyväskylä', 'Keski-Suomi', '40100');

-- INSERT PERSON --

INSERT INTO person (fname, lname, phone, email, salary, job, birth, homeaddress, homezip)
VALUES ('John', 'Doe', '+123456789', 'john@email.com', 50000, 'Software Engineer', '1990-05-15', 'Kasarmikatu 11', '00100');

INSERT INTO person (fname, lname, phone, email, salary, job, birth, homeaddress, homezip)
VALUES ('Jane', 'Smith', '+987654321', 'jane@email.com', 60000, 'Data Analyst', '1988-08-20', 'Brahenkatu 13', '20100');

INSERT INTO person (fname, lname, phone, email, salary, job, birth, homeaddress, homezip)
VALUES ('Alice', 'Turner', '+111222333', 'alice@email.com', NULL, 'Student', '2001-12-25', 'Verkatehtaankatu 14', '33100');

INSERT INTO person (fname, lname, phone, email, salary, job, birth, homeaddress, homezip)
VALUES ('Bob', 'Williams', '+444555666', 'bob@email.com', 55000, 'Teacher', '1995-10-10', 'Kiviharjuntie 15', '90100');

INSERT INTO person (fname, lname, phone, email, salary, job, birth, homeaddress, homezip)
VALUES ('Emma', 'Johnson', '+555666777', 'emma@email.com', 60000, 'Accountant', '1992-09-20', 'Yliopistonkatu 24', '40100');

-- INSERT PET --

INSERT INTO pet (name, type, breed, age, birthday, weight, specialneeds, owneremail)
VALUES ('Ulla', 'Dog', 'Swedish Vallhund', 1, '2023-03-14', 10.4, 'Has separation anxiety', 'john@email.com');

INSERT INTO pet (name, type, breed, age, birthday, weight, specialneeds, owneremail)
VALUES ('Veksi', 'Cat', 'Korat', 8, '2016-04-24', 5.2, 'Has Asthma', 'jane@email.com');

INSERT INTO pet (name, type, breed, age, birthday, weight, specialneeds, owneremail)
VALUES ('Helmi', 'Cat', 'Korat', 8, '2016-04-24', 4.6, 'Only eats tuna', 'jane@email.com');

INSERT INTO pet (name, type, breed, age, birthday, weight, specialneeds, owneremail)
VALUES ('Tweety', 'Bird', 'Canary', 2, '2022-03-10', 0.1, NULL, 'alice@email.com');

INSERT INTO pet (name, type, breed, age, birthday, weight, specialneeds, owneremail)
VALUES ('Goldie', 'Goldfish', 'Comet', 0, '2024-02-01', 0.2, NULL, 'bob@email.com');

INSERT INTO pet (name, type, breed, age, birthday, weight, specialneeds, owneremail)
VALUES ('Nibbles', 'Hamster', 'Syrian', 1, '2023-09-05', 0.3, NULL, 'emma@email.com');
