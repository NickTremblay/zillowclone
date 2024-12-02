create database ZillowClone; 

use ZillowClone; 

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS building;
DROP TABLE IF EXISTS offer;
DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS listing;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE listing (
  lid INT AUTO_INCREMENT NOT NULL,
  bid INT NOT NULL,
  uid INT NOT NULL,
  dateListed DATETIME NOT NULL,
  price INT NOT NULL,
  bedCount INT NOT NULL,
  bathCount INT NOT NULL,
  squareFootage INT NOT NULL,
  listingType INT NOT NULL,
  PRIMARY KEY (lid),
  FOREIGN KEY (bid) REFERENCES building(bid) ON DELETE CASCADE,
  FOREIGN KEY (uid) REFERENCES user(uid) ON DELETE CASCADE
);

CREATE TABLE image (
  img_id INT AUTO_INCREMENT NOT NULL,
  url VARCHAR(255) NOT NULL,
  lid INT NOT NULL,
  PRIMARY KEY (img_id),
  FOREIGN KEY (lid) REFERENCES listing(lid) ON DELETE CASCADE
);

CREATE TABLE offer (
  oid INT AUTO_INCREMENT NOT NULL,
  amount INT NOT NULL,
  dateOffered DATETIME NOT NULL,
  lid INT NOT NULL,
  PRIMARY KEY (oid),
  FOREIGN KEY (lid) REFERENCES listing(lid) ON DELETE CASCADE
);

CREATE TABLE building (
  bid INT AUTO_INCREMENT NOT NULL,
  streetNumber INT NOT NULL,
  streetName VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  zipCode INT NOT NULL,
  state VARCHAR(2) NOT NULL,
  appraisedValue INT NOT NULL,
  PRIMARY KEY (bid),
  UNIQUE (streetNumber, streetName, city, zipCode, state)
);

CREATE TABLE amenities (
  amenity_id INT AUTO_INCREMENT NOT NULL,
  description VARCHAR(100) NOT NULL,
  lid INT NOT NULL,
  PRIMARY KEY (amenity_id),
  FOREIGN KEY (lid) REFERENCES listing(lid) ON DELETE CASCADE
);

CREATE TABLE user (
  uid INT AUTO_INCREMENT NOT NULL,
  email VARCHAR(255) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  middleInit CHAR(1),
  PRIMARY KEY (uid),
  UNIQUE (email)
);

INSERT INTO user (uid, email, firstName, lastName, middleInit) VALUES
(1, 'user1@example.com', 'John', 'Doe', 'A'),
(2, 'user2@example.com', 'Jane', 'Smith', 'B'),
(3, 'user3@example.com', 'Alice', 'Johnson', 'C'),
(4, 'user4@example.com', 'Bob', 'Brown', 'D'),
(5, 'user5@example.com', 'Charlie', 'Davis', 'E'),
(6, 'user6@example.com', 'David', 'Wilson', 'F'),
(7, 'user7@example.com', 'Eve', 'Moore', 'G'),
(8, 'user8@example.com', 'Frank', 'Taylor', 'H'),
(9, 'user9@example.com', 'Grace', 'Anderson', 'I'),
(10, 'user10@example.com', 'Henry', 'Thomas', 'J');

INSERT INTO building (bid, streetNumber, streetName, city, zipCode, state, appraisedValue) VALUES
(1, 101, 'Main St', 'New York', 10001, 'NY', 520000),
(2, 202, 'Elm St', 'Los Angeles', 90001, 'CA', 620000),
(3, 303, 'Pine St', 'Chicago', 60601, 'IL', 460000),
(4, 404, 'Oak St', 'Houston', 77001, 'TX', 720000),
(5, 505, 'Maple St', 'Phoenix', 85001, 'AZ', 820000),
(6, 606, 'Cedar St', 'Philadelphia', 19101, 'PA', 320000),
(7, 707, 'Birch St', 'San Antonio', 78201, 'TX', 770000),
(8, 808, 'Walnut St', 'San Diego', 92101, 'CA', 870000),
(9, 909, 'Ash St', 'Dallas', 75201, 'TX', 420000),
(10, 1001, 'Willow St', 'San Jose', 95101, 'CA', 970000);

INSERT INTO listing (lid, bid, uid, dateListed, price, bedCount, bathCount, squareFootage, listingType) VALUES
(1, 1, 1, '2023-10-01 10:00:00', 500000, 3, 2, 1500, 1),
(2, 2, 2, '2023-10-02 11:00:00', 600000, 4, 3, 2000, 2),
(3, 3, 3, '2023-10-03 12:00:00', 450000, 2, 1, 1200, 1),
(4, 4, 4, '2023-10-04 13:00:00', 700000, 5, 4, 2500, 2),
(5, 5, 5, '2023-10-05 14:00:00', 800000, 4, 3, 2300, 3),
(6, 6, 6, '2023-10-06 15:00:00', 300000, 2, 1, 1100, 1),
(7, 7, 7, '2023-10-07 16:00:00', 750000, 3, 2, 1800, 3),
(8, 8, 8, '2023-10-08 17:00:00', 850000, 4, 3, 2200, 2),
(9, 9, 9, '2023-10-09 18:00:00', 400000, 3, 2, 1600, 1),
(10, 10, 10, '2023-10-10 19:00:00', 3000000, 5, 4, 3000, 3);

INSERT INTO image (img_id, url, lid) VALUES
(1, 'https://photos.zillowstatic.com/fp/edce60177645900d537da798599cf274-cc_ft_1536.webp', 1),
(2, 'https://photos.zillowstatic.com/fp/ce6f4712734f8eaff3c600f75606c930-cc_ft_1536.webp', 1),
(3, 'https://photos.zillowstatic.com/fp/51f6cfe046654ee5699c6f9bd27020d7-cc_ft_1536.webp', 1),
(4, 'https://photos.zillowstatic.com/fp/d0f09ef1258d9cb51e2ba81207ca955b-cc_ft_1536.webp', 2),
(5, 'https://photos.zillowstatic.com/fp/2907e64d47184d138d5632c4a9649494-cc_ft_1536.webp', 2),
(6, 'https://photos.zillowstatic.com/fp/9e020b9ebdf710328de2e3bb030966ae-cc_ft_1536.webp', 2),
(7, 'https://photos.zillowstatic.com/fp/33adb04d3f408e7536b41f57ea5199b3-cc_ft_1536.webp', 3),
(8, 'https://photos.zillowstatic.com/fp/e62401f54801596f64a1219a46d46b59-cc_ft_1536.webp', 3),
(9, 'https://photos.zillowstatic.com/fp/cfeb08647368b2864d3b4a1b1cbb877a-cc_ft_1536.webp', 3),
(10, 'https://photos.zillowstatic.com/fp/901e2e449dbd2e7d94c824d1f5b7e83c-cc_ft_1536.webp', 4),
(11, 'https://photos.zillowstatic.com/fp/db62c2f7c1d7baf2028e9fcff9bcd9d3-cc_ft_1536.webp', 4),
(12, 'https://photos.zillowstatic.com/fp/46455b6db1f38be8d3c15589685cb4c7-cc_ft_1536.webp', 4),
(13, 'https://photos.zillowstatic.com/fp/5ae3942344d3fe20fed53901d619b458-cc_ft_1536.webp', 5),
(14, 'https://photos.zillowstatic.com/fp/0e5d1618a516033710f3c01250b50548-cc_ft_1536.webp', 5),
(15, 'https://photos.zillowstatic.com/fp/3461f5550ec0e4f86435a7ded1685b30-cc_ft_1536.webp', 5),
(16, 'https://photos.zillowstatic.com/fp/faba24b9e0fb1ae9023a60e27a63b0f8-cc_ft_1536.webp', 6),
(17, 'https://photos.zillowstatic.com/fp/54c9f6b83a25aa6247a9c2902c2a5ef0-cc_ft_1536.webp', 6),
(18, 'https://photos.zillowstatic.com/fp/19348f4bc49d8b54dd0815fb10b083ed-cc_ft_1536.webp', 6),
(19, 'https://photos.zillowstatic.com/fp/282496dc2a440e5b73292bc8f6120860-cc_ft_1536.webp', 7),
(20, 'https://photos.zillowstatic.com/fp/31f0c98652c127ccaa564d092fe8f1b4-cc_ft_1536.webp', 7),
(21, 'https://photos.zillowstatic.com/fp/d05086cde26267ef75dee1061b6eb62f-cc_ft_1536.webp', 7),
(22, 'https://photos.zillowstatic.com/fp/37a932156204e2e918ca8596474f669d-cc_ft_1536.webp', 8),
(23, 'https://photos.zillowstatic.com/fp/59faf8cc90ec31677e16b982a096ccd0-cc_ft_1536.webp', 8),
(24, 'https://photos.zillowstatic.com/fp/9f3e7c616bf4eaa624ccdac434d2cb4a-cc_ft_1536.webp', 8),
(25, 'https://photos.zillowstatic.com/fp/a33ec956fd58a081e34e38d7862762e8-cc_ft_1536.webp', 9),
(26, 'https://photos.zillowstatic.com/fp/1c2717ba10460383a68e8fd03bf310cf-cc_ft_1536.webp', 9),
(27, 'https://photos.zillowstatic.com/fp/b734c5d8c713e806c7fe212f65b60e34-cc_ft_1536.webp', 9),
(28, 'https://photos.zillowstatic.com/fp/093e338ee84323c0bce4d74b85df55c2-cc_ft_1536.webp', 10),
(29, 'https://photos.zillowstatic.com/fp/727d80151075838bc86dda3b8cd6510d-cc_ft_1536.webp', 10),
(30, 'https://photos.zillowstatic.com/fp/b9ae77fd22fe6cdcbca2a3e837a574dd-cc_ft_1536.webp', 10);

INSERT INTO offer (oid, amount, dateOffered, lid) VALUES
(1, 500000, '2023-10-15 10:00:00', 1),
(2, 600000, '2023-10-16 11:00:00', 2),
(3, 450000, '2023-10-17 12:00:00', 3),
(4, 700000, '2023-10-18 13:00:00', 4),
(5, 800000, '2023-10-19 14:00:00', 5),
(6, 300000, '2023-10-20 15:00:00', 6),
(7, 750000, '2023-10-21 16:00:00', 7),
(8, 850000, '2023-10-22 17:00:00', 8),
(9, 400000, '2023-10-23 18:00:00', 9),
(10, 2500000, '2023-10-24 19:00:00', 10);

INSERT INTO amenities (description, lid) VALUES
('Pool', 1),
('Gym', 1),
('Parking', 2),
('Elevator', 2),
('Garden', 3),
('Playground', 3),
('Rooftop', 4),
('Security', 4),
('Pet-friendly', 5),
('Community Room', 6),
('Pool', 7),
('Gym', 7),
('Parking', 8),
('Elevator', 8),
('Pet-friendly', 9),
('Community Room', 9),
('Pool', 10),
('Gym', 10),
('Parking', 10),
('Elevator', 10),
('Garden', 10);

-- Create an index on foreign keys for faster lookups
CREATE INDEX idx_listing_url ON image(lid);
CREATE INDEX idx_building_lid ON listing(bid);
CREATE INDEX idx_user_email ON user(email);

-- Create a composite index for searching buildings by city and state
CREATE INDEX idx_city_state ON building(city, state);

-- Ensure the price is positive
ALTER TABLE listing ADD CONSTRAINT chk_price CHECK (price > 0);

-- Ensure the number of beds and baths is non-negative
ALTER TABLE listing ADD CONSTRAINT chk_beds CHECK (bedCount >= 0);
ALTER TABLE listing ADD CONSTRAINT chk_baths CHECK (bathCount >= 0);

-- Ensure offers are non-negative
ALTER TABLE offer ADD CONSTRAINT chk_offer_amount CHECK (amount >= 0);