CREATE TABLE team_membership_histories (
    id VARCHAR(255) PRIMARY KEY,
    team_membership_id VARCHAR(255) NOT NULL,
    date_effective_from DATETIME NOT NULL,
    number INT(11) NOT NULL,
    position VARCHAR(255) NOT NULL,
    FOREIGN KEY (team_membership_id) REFERENCES team_membership(id)
);
