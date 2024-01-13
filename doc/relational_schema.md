## Relational Schema

```
FLIGHTS(
    FLIGHT_ID:VARCHAR [PK] [FK to FLIGHTS.FLIGHT_ID],
    ORIGIN_AIRPORT:VARCHAR [FK to AIRPORTS.IATA_CODE_AIRPORT],
    DESTINATION_AIRPORT:VARCHAR [FK to AIRPORTS.IATA_CODE_AIRPORT],
    DEPARTURE_TIME:TIME,
    DEPARTURE_DELAY:INT,
    TAXI_OUT:INT,
    TAXI_IN:INT,
    SCHEDULED_ARRIVAL:TIME,
    ARRIVAL_DELAY:TIME,
    TAIL_NUMBER:VARCHAR,
    CANCELLED: BOOL)

// Using date, airline, flight number, and scheduled departure time to create a primary key called flight_id

FLIGHTS_KEY(
    FLIGHT_ID:VARCHAR [PK],
    DATE:DATE,
    AIRLINE:VARCHAR,
    FLIGHT_NUMBER:INT,
    SCHEDULED_DEPARTURE:TIME)


AIRPORTS(
    IATA_CODE_AIRPORT:VARCHAR [PK],
    AIRPORT:VARCHAR)

USER_LOGIN(
    EMAIL:VARCHAR [PK],
    PASSWORD:VARCHAR,
    USERNAME:VARCHAR)

// (Email and Username are forming a composite primary key)

FAVORITES_KEY(
    EMAIL:VARCHAR [PK] [FK to USER_LOGIN.EMAIL],
    FAVORITE_NAME: [PK] VARCHAR
)

AIRPORT_LOCATION(
    IATA_CODE_AIRPORT:VARCHAR [PK],
    LATITUDE:DECIMAL [FK to CITY_ID.LATITUDE],
    LONGITUDE:DECIMAL [FK to CITY_ID.LONGITUDE]
)

CITY_ID(
    CITY: VARCHAR [FK to STATE_ID.CITY],
    LATITUDE:DECIMAL [PK],
    LONGITUDE:DECIMAL [PK]
)

STATE_ID(
    CITY: VARCHAR [PK],
    STATE:VARCHAR,
    COUNTRY:VARCHAR
)

AIRLINES(
    IATA_CODE_AIRLINE:VARCHAR [PK],
    AIRLINE:VARCHAR)

Relations for the ER diagram


```

## Relations

(a) Airlines to Flight Relation:
ONE TO MANY
As one specific airlines, in will have multiple flights throught the day/month/year.

(b) Flight to Airlines Relation:
ONE TO ONE
As each flight in the Flights table, correspond to only one Flight number in the Airlines table.

(c) Aiports to Flight Relation:
ONE TO MANY

(d) Flight to Airports Relation:
ONE TO ONE

(e) Airports to User Login:
ONE TO ONE

(f) User Login to Airports:
ONE TO ONE

(g) Airports to Airport Location:
ONE TO ONE

(h) Airport Location to Airports:
ONE TO ONE



## Normalization
We were tasked to normalize our entities as portrayed in the ER diagram to the 3rd Normal Form.

#### First Normal Form
To ensure our tables/database was in First Normal Form, we made sure that the tables consisted of Atomic values
For this we decomposed the User Login Entity into the following tables:

USER_LOGIN(
    EMAIL:VARCHAR [PK],
    PASSWORD:VARCHAR,
    USERNAME:VARCHAR)
FAVORITES_KEY(
    EMAIL:VARCHAR [PK] [FK to USER_LOGIN.EMAIL],
    FAVORITE_NAME: [PK] VARCHAR
)

As the favorites field in the original entity had multiple values, decomposing this entity ensured that the values in the fields
of all the tables were atomic and with no repeating groups.

#### Second Normal Form
Since all our tables are constructed with only one field acting as the primary key, there is are no non-key attributes
partially depended on the primary key.
The CITY_ID is constructed with a primary composite key, with a non-key attribute City, being fully dependend on the
primary composite key.
Thus all our tables satisfy the Second Normal Form.

#### Third Normal Form
Third Normal Form requires all our non-key attributes to not be depended on each other which is why we decomposed the following entities:

Airport Location:
AIRPORT_LOCATION(
    IATA_CODE_AIRPORT:VARCHAR [PK],
    LATITUDE:DECIMAL [FK to CITY_ID.LATITUDE],
    LONGITUDE:DECIMAL [FK to CITY_ID.LONGITUDE]
)
CITY_ID(
    CITY: VARCHAR [FK to STATE_ID.CITY],
    LATITUDE:DECIMAL [PK],
    LONGITUDE:DECIMAL [PK]
)
STATE_ID(
    CITY: VARCHAR [PK],
    STATE:VARCHAR,
    COUNTRY:VARCHAR
)
This made sure that none of the non-key attributes were not dependent on each other as originally, state and country were dependent
on knowing the city and the city was dependent on knowing the latitude and longitude.

