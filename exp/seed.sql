create database IOT;
use IOT;
create table student ( uid INT primary key, rfid varchar(50), name varchar(50), year int, email varchar(50) , pass varchar(50));
drop table student;
insert into student (uid, rfid, name, year,email, pass) values (2024801002, "B136DB1B47", "Rehan Ansari", 3, "oprio0912@gmail.com" , "123" );
insert into student (uid, rfid, name, year,email, pass) values (2024801001, "FA37E63F14", "Aasim Shaikh", 3, "rehanansari0912@gmail.com" ,"123" );

create table timetable (cid int, cname varchar(50), start_time int, end_time int);
INSERT INTO timetable (cid, cname, start_time, end_time) VALUES
(1,  'Internet of Things Lecture',             8,  9),
(2,  'Theory of Computation Lecture',          9, 10),
(3,  'Distributed Computing Lecture',          10, 11),
(4,  'Artificial Intelligence and Soft Computing Lecture', 11, 12),
(5,  'Software Engineering Lecture',           12, 13),
(6,  'Cryptography and Network Security Lecture', 13, 14),
(7,  'Internet of Things Practical',           14, 16),
(8,  'Software Engineering Practical',         16, 18);

create table attendance (date date, name varchar(50), uid int);
CREATE TABLE attendance (
    date DATE,
    name VARCHAR(50),
    uid INT
);

-- Example attendance for 3 days
INSERT INTO attendance (date, name, uid) VALUES
('2025-10-20', 'Internet of Things Lecture', 2024801002),
('2025-10-20', 'Internet of Things Lecture', 2024801001),
('2025-10-20', 'Theory of Computation Lecture', 2024801002),
('2025-10-20', 'Theory of Computation Lecture', 2024801001),
('2025-10-20', 'Internet of Things Practical', 2024801002),
('2025-10-20', 'Internet of Things Practical', 2024801001),

('2025-10-21', 'Distributed Computing Lecture', 2024801002),
('2025-10-21', 'Distributed Computing Lecture', 2024801001),
('2025-10-21', 'Software Engineering Lecture', 2024801002),
('2025-10-21', 'Software Engineering Lecture', 2024801001),
('2025-10-21', 'Software Engineering Practical', 2024801002),
('2025-10-21', 'Software Engineering Practical', 2024801001),

('2025-10-22', 'Artificial Intelligence and Soft Computing Lecture', 2024801002),
('2025-10-22', 'Artificial Intelligence and Soft Computing Lecture', 2024801001),
('2025-10-22', 'Cryptography and Network Security Lecture', 2024801002),
('2025-10-22', 'Cryptography and Network Security Lecture', 2024801001),
('2025-10-22', 'Internet of Things Practical', 2024801002),
('2025-10-22', 'Internet of Things Practical', 2024801001);

select * from student;
select * from attendance;
