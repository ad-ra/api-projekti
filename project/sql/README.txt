# API PROJECT DATABASE

## 1. OVERVIEW

This database stores information about people, their pets and their homes.
There are three tables:
- person
- pet
- home

## Relations between tables
- person and home are linked through address and zipcode
- person and pet are linked through email

## 2. SETTING UP THE DATABASE

### Ensure that SQLite is installed

### Open a terminal and navigate to the sql directory
cd your/path/to/sql

### To start SQLite and create the database give the command:
sqlite3 ../database.db

Inside SQLite prompt (sqlite >), run:

### To create the schema:
.read create.sql

### To insert test data:
.read insert.sql

### If you don't need the test data run:
.read delete.sql

### Useful SQLite commands:
.tables     -- view tables
.schema     -- view table schemas
.quit       -- exit sqlite
