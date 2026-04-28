-- Default Products (DOKZ STORE Katalog)
INSERT INTO products (name, slug, description, price, category, is_active) VALUES
('Alight Motion', 'alight-motion', 'Professional motion graphics and video editor', 5.99, 'Video Editing', TRUE),
('Bstation', 'bstation', 'Chinese streaming platform account access', 3.99, 'Streaming', TRUE),
('Canva', 'canva', 'Design tool for creating stunning visuals', 6.99, 'Design', TRUE),
('Capcut', 'capcut', 'Professional video editing tool', 4.99, 'Video Editing', TRUE),
('ChatGPT', 'chatgpt', 'ChatGPT Plus subscription account', 19.99, 'AI', TRUE),
('iQiyi', 'iqiyi', 'Chinese video streaming platform', 2.99, 'Streaming', TRUE),
('Loko Lok', 'loko-lok', 'Short video streaming application', 3.49, 'Streaming', TRUE),
('Meitu', 'meitu', 'Photo editing and beautification app', 4.49, 'Photo Editing', TRUE),
('Prime Video', 'prime-video', 'Amazon Prime Video subscription', 7.99, 'Streaming', TRUE),
('Simerah Platinum', 'simerah-platinum', 'Premium fitness and wellness platform', 8.99, 'Health', TRUE),
('Spotify', 'spotify', 'Premium music streaming service', 9.99, 'Music', TRUE),
('Viu', 'viu', 'Asian drama streaming platform', 5.49, 'Streaming', TRUE),
('WeTV', 'wetv', 'Tencent video streaming platform', 4.99, 'Streaming', TRUE),
('Wink', 'wink', 'Entertainment streaming service', 3.99, 'Streaming', TRUE),
('Youku', 'youku', 'Chinese video streaming platform', 2.99, 'Streaming', TRUE);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('store_name', 'DOKZ STORE'),
('store_description', 'Premium Account Store - Get instant access to premium services'),
('admin_email', 'admin@dokzstore.com');
