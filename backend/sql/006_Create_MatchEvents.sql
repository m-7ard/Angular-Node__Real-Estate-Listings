CREATE TABLE match_events (
    id VARCHAR(255) PRIMARY KEY,
    match_id VARCHAR(255) NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    team_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date_occured DATETIME NOT NULL,
    secondary_player_id VARCHAR(255),
    description TEXT NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES player(id),
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (secondary_player_id) REFERENCES player(id)
);
