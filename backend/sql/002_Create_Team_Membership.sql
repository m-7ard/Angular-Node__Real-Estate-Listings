CREATE TABLE team_membership (
    id VARCHAR(255) PRIMARY KEY,
    team_id VARCHAR(255) NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    active_from DATETIME NOT NULL,
    active_to DATETIME NULL,
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (player_id) REFERENCES player(id)
);