CREATE TABLE images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('Weddings','Lifestyle','Portraits','Commercials') NOT NULL,
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
