
--
-- Database: `db_contact`
--

CREATE DATABASE IF NOT EXISTS `question_db` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `question_db`;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_contact`
--

DROP TABLE IF EXISTS `klausimai_atsakymai`;
CREATE TABLE `klausimai_atsakymai` (
  `klausimo_nr` int(11) NOT NULL,
  `klausimas` varchar(50) NOT NULL,
  `atsakymas` varchar(150) NOT NULL,

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_contact`
--
ALTER TABLE `klausimai_atsakymai`
 ADD PRIMARY KEY (`klausimo_nr`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_contact`
--
ALTER TABLE `klausimai_atsakymai`
MODIFY `klausimo_nr` int(11) NOT NULL AUTO_INCREMENT;
