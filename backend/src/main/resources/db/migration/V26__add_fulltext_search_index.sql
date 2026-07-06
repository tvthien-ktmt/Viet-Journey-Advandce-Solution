ALTER TABLE tours ADD FULLTEXT INDEX idx_tours_fulltext (name, location, overview);
ALTER TABLE hotels ADD FULLTEXT INDEX idx_hotels_fulltext (name, location);
ALTER TABLE blogs ADD FULLTEXT INDEX idx_blogs_fulltext (title, excerpt);
