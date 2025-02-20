module.exports = function CreateUserDB() {
  return `
    CREATE TABLE IF NOT EXISTS user (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;
};
