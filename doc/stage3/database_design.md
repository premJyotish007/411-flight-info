These are the DDL commands for the tables in the database. The database is called `flight_db` and the tables are `airlines`, `airports`, `red_flights`, `cancel`, `favorites`, and `userLogin`. The `red_flights` table is the main table that contains all the information about the flights. The `cancel` table contains the cancellation information for each flight. The `airlines` table contains the airline name and the IATA code for each airline. The `airports` table contains the airport name, city, country, IATA code, latitude, longitude, and state for each airport. The `favorites` table contains the ranking, email, and IATA code for each favorite airport. The `userLogin` table contains the email, username, and password for each user.

```
CREATE TABLE `airlines` (
  `Airline` varchar(45) NOT NULL,
  `IATA_CODE` varchar(45) NOT NULL,
  PRIMARY KEY (`IATA_CODE`)
)

CREATE TABLE `airports` (
  `AIRPORT` varchar(100) NOT NULL,
  `CITY` varchar(45) NOT NULL,
  `COUNTRY` varchar(45) NOT NULL,
  `IATA_CODE` varchar(45) NOT NULL,
  `LATITUDE` float DEFAULT NULL,
  `LONGITUDE` float DEFAULT NULL,
  `STATE` varchar(45) NOT NULL,
  PRIMARY KEY (`IATA_CODE`),
  KEY `idx_IATA_CODE` (`IATA_CODE`)
)

CREATE TABLE `red_flights` (
  `Unique_flight` varchar(150) NOT NULL,
  `DAY_OF_WEEK` int NOT NULL,
  `TAIL_NUMBER` varchar(45) DEFAULT NULL,
  `ORIGIN_AIRPORT` varchar(45) NOT NULL,
  `DESTINATION_AIRPORT` varchar(45) NOT NULL,
  `DEPARTURE_TIME` int DEFAULT NULL,
  `DEPARTURE_DELAY` int DEFAULT NULL,
  `TAXI_OUT` int DEFAULT NULL,
  `WHEELS_OFF` int DEFAULT NULL,
  `SCHEDULED_TIME` int DEFAULT NULL,
  `ELAPSED_TIME` int DEFAULT NULL,
  `AIR_TIME` int DEFAULT NULL,
  `DISTANCE` int NOT NULL,
  `WHEELS_ON` int DEFAULT NULL,
  `TAXI_IN` int DEFAULT NULL,
  `SCHEDULED_ARRIVAL` int NOT NULL,
  `ARRIVAL_TIME` int DEFAULT NULL,
  `ARRIVAL_DELAY` int DEFAULT NULL,
  `CANCELLED` binary(1) NOT NULL,
  `flight_date` varchar(255) DEFAULT NULL,
  `flight_route` varchar(255) DEFAULT NULL,
  `scheduled_dept` int DEFAULT NULL,
  `airline` varchar(45) DEFAULT NULL,
  `flight_number` int DEFAULT NULL,
  PRIMARY KEY (`Unique_flight`),
  KEY `idx_red_flights_unique_flight` (`Unique_flight`),
  KEY `idx_airline` (`airline`)
)


CREATE TABLE `cancel` (
  `CANCELLATION_ID` int NOT NULL AUTO_INCREMENT,
  `Unique_flight` varchar(150) DEFAULT NULL,
  `DIVERTED` binary(1) NOT NULL,
  `CANCELLED` binary(1) NOT NULL,
  `CANCELLATION_REASON` char(1) DEFAULT NULL,
  `AIR_SYSTEM_DELAY` int DEFAULT NULL,
  `SECURITY_DELAY` int DEFAULT NULL,
  `AIRLINE_DELAY` int DEFAULT NULL,
  `LATE_AIRCRAFT_DELAY` int DEFAULT NULL,
  `WEATHER_DELAY` int DEFAULT NULL,
  PRIMARY KEY (`CANCELLATION_ID`),
  KEY `Unique_flight_idx` (`Unique_flight`),
  CONSTRAINT `Unique_flight` FOREIGN KEY (`Unique_flight`) REFERENCES `red_flights` (`Unique_flight`)
)


CREATE TABLE `favorites` (
  `ranking` int unsigned NOT NULL,
  `email` varchar(150) NOT NULL,
  `iata_code` varchar(45) NOT NULL,
  PRIMARY KEY (`email`,`iata_code`),
  CONSTRAINT `fk_airport_code` FOREIGN KEY (`iata_code`) REFERENCES `airports` (`IATA_CODE`),
  CONSTRAINT `fk_email` FOREIGN KEY (`email`) REFERENCES `userLogin` (`email`)
)

CREATE TABLE `userLogin` (
  `email` varchar(150) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`email`)
)
```

