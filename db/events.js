module.exports = function CreateEventsDB() {
  return `
      CREATE TABLE IF NOT EXISTS events (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        user_id INT NOT NULL, 
        event_content VARCHAR(255) NOT NULL,
        status ENUM('未完成', '已完成') NOT NULL DEFAULT '未完成',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      );
    `;
};
