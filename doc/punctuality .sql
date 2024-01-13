#######ADVANCED QUERY#############
-- create index Unq_flt on red_flights(Unique_flight);
-- EXPLAIN ANALYZE
select r.ORIGIN_AIRPORT, count(r.ORIGIN_AIRPORT) as 'number of flights affected per origin airport'
-- select airline
from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
where (CHAR_LENGTH(r.ORIGIN_AIRPORT) = 3) and ((c.CANCELLED like 1) or (c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or 
(c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
group by r.ORIGIN_AIRPORT;
-- limit 15;

###############
#all flight route numbers
#1294 for dfw->ord
select red_flightsflight_route
from red_flights
where DESTINATION_AIRPORT like 'ORD'and ORIGIN_AIRPORT like 'DFW';

###############
#all airlines, with name
select distinct r.airline as 'Airline Code', a.AIRLINE
FROM red_flights r join airlines a on r.airline = a.IATA_CODE
Where DESTINATION_AIRPORT like 'ORD'and ORIGIN_AIRPORT like 'DFW';


-- ###############
-- #total no of flights by each airline
-- select airline, Count(airline) as 'Total flights per airline'
-- from red_flights
-- where DESTINATION_AIRPORT like 'ORD'and ORIGIN_AIRPORT like 'DFW'
-- group by airline;

########
#punctuality, all delayed flights
#271 delayed
#275 delayed + diverted
select *
-- select airline
from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
where (r.DESTINATION_AIRPORT like 'ORD'and r.ORIGIN_AIRPORT like 'DFW') and ((c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or (c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
;

 ###############
#total no of flights by each airline
select airline, Count(airline) as 'Total flights per airline'
from red_flights
where DESTINATION_AIRPORT like 'ORD'and ORIGIN_AIRPORT like 'DFW'
group by airline;

########
#punctuality, no of delayed and diverted flights by airline
select r.airline, count(r.airline) as 'number of flights delayed and diverted per airline'
-- select airline
from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
where (r.DESTINATION_AIRPORT like 'ORD'and r.ORIGIN_AIRPORT like 'DFW') and ((c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or (c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
group by r.airline;


-- ########
-- #punctuality, no of delayed and diverted flights by airport
select r.ORIGIN_AIRPORT, count(r.ORIGIN_AIRPORT) as 'number of flights affected per origin airport'
-- select airline
from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
where (CHAR_LENGTH(r.ORIGIN_AIRPORT) = 3) and ((c.CANCELLED like 1) or (c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or (c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
group by r.ORIGIN_AIRPORT;


#######ADVANCED QUERY#############
-- create index Unq_flt on red_flights(Unique_flight);
-- EXPLAIN ANALYZE
select r.ORIGIN_AIRPORT, count(r.ORIGIN_AIRPORT) as 'number of flights affected per origin airport'
-- select airline
from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
where (CHAR_LENGTH(r.ORIGIN_AIRPORT) = 3) and ((c.CANCELLED like 1) or (c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or 
(c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
group by r.ORIGIN_AIRPORT;
-- limit 15;

########
#punctuality, no of cancelled flights by airline
select r.airline, count(r.airline) as 'number of flights cancelled per airline'
-- select airline
from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
where (r.DESTINATION_AIRPORT like 'ORD'and r.ORIGIN_AIRPORT like 'DFW') and ((c.CANCELLED like 1))
group by r.airline;


########
#punctuality, no of affected flights by airline
select r.airline, count(r.airline) as 'number of flights cancelled per airline'
-- select airline
from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
where (r.DESTINATION_AIRPORT like 'ORD'and r.ORIGIN_AIRPORT like 'DFW') and ((c.CANCELLED like 1) or (c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or (c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
group by r.airline;


###############
#no of flights per day of week
select DAY_OF_WEEK, Count(DAY_OF_WEEK) as 'Total flights per day of week'
from red_flights
where DESTINATION_AIRPORT like 'ORD'and ORIGIN_AIRPORT like 'DFW'
group by DAY_OF_WEEK;


##############
#no of flights affected per day of week
select r.DAY_OF_WEEK, Count(r.DAY_OF_WEEK) as 'Aff_fl_day', Tot_fl_day, (Count(r.DAY_OF_WEEK)/Tot_fl_day) as prob_flight_affected
-- select airline
from (red_flights r join cancel c on r.Unique_flight = c.Unique_flight) join (
	select DAY_OF_WEEK, Count(DAY_OF_WEEK) as 'Tot_fl_day'
	from red_flights
	where DESTINATION_AIRPORT like 'ORD'and ORIGIN_AIRPORT like 'DFW'
	group by DAY_OF_WEEK
) as sub_query on sub_query.DAY_OF_WEEK = r.DAY_OF_WEEK
where (r.DESTINATION_AIRPORT like 'ORD'and r.ORIGIN_AIRPORT like 'DFW') and ((c.CANCELLED like 1) or (c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or (c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
group by r.DAY_OF_WEEK
order by prob_flight_affected ASC;


-- Group by ORIGIN_AIRPORT;

-- Select ORIGIN_AIRPORT from red_flights group by 
-- Where ORIGIN_ARIPORT like 'DFW'
-- Group by ORIGIN_ARIPORT-- , DESTINATION_AIRPORT
-- HAVING ORIGIN_AIRPORT like 'DFW' AND DESTINATION_AIRPORT like 'ORD'

########probability of an airline's flight being delayed on a given route#######
select r1.airline, count(r1.airline) as 'num_flights_canc', num_flights_airline, (count(r1.airline)/num_flights_airline) as prob_of_cancel
-- select *
from (red_flights r1 join cancel c1 on r1.Unique_flight = c1.Unique_flight) join (
	select r2.airline, count(r2.airline) as 'num_flights_airline'
	from red_flights r2 join cancel c2 on r2.Unique_flight = c2.Unique_flight
	where (r2.DESTINATION_AIRPORT like 'ORD'and r2.ORIGIN_AIRPORT like 'DFW')
	group by r2.airline
) as sub_query on r1.airline = sub_query.airline
where (r1.DESTINATION_AIRPORT like 'ORD'and r1.ORIGIN_AIRPORT like 'DFW') and ((c1.CANCELLED like 1) or (c1.DIVERTED like 1) or (c1.AIR_SYSTEM_DELAY > 0) or (c1.SECURITY_DELAY > 0) or (c1.AIRLINE_DELAY > 0) or (c1.LATE_AIRCRAFT_DELAY > 0) or (c1.WEATHER_DELAY > 0))
group by r1.airline
order by prob_of_cancel ASC;

-- select r.airline, count(r.airline) as 'num_flights_airline'
-- -- select airline
-- from red_flights r join cancel c1 on r.Unique_flight = c1.Unique_flight
-- where (r.DESTINATION_AIRPORT like 'ORD'and r.ORIGIN_AIRPORT like 'DFW')--  and ((c1.CANCELLED like 1) or (c1.DIVERTED like 1) or (c1.AIR_SYSTEM_DELAY > 0) or (c1.SECURITY_DELAY > 0) or (c1.AIRLINE_DELAY > 0) or (c1.LATE_AIRCRAFT_DELAY > 0) or (c1.WEATHER_DELAY > 0))
-- group by r.airline;

