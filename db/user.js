module.exports = function CreateUserDB() {
  return `CREATE TABLE IF NOT EXISTS user (
    id INT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL)`;
};
