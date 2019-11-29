INSERT INTO users (user_name, user_password)
    VALUES
        ('demo_user', '$2a$04$HNAwLgr8vBhbKfbHUKRane/eBWJ5WLzT12WmANApEAex7W.d91jhG');

INSERT INTO business (business_id) 
    VALUES
        ("ONE");

INSERT INTO user_businesses (user_id, business_id)
    VALUES 
        (1, 1);