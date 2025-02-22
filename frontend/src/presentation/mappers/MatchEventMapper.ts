import MatchEvent from '../models/MatchEvent';
import IMatchEventApiModel from '@apiModels/IMatchEventApiModel';
import PlayerMapper from './PlayerMapper';

class MatchEventMapper {
    static apiModelToDomain(source: IMatchEventApiModel) {
        return new MatchEvent({
            id: source.id,
            matchId: source.matchId,
            player: PlayerMapper.apiModelToDomain(source.player),
            teamId: source.teamId,
            type: source.type,
            dateOccurred: new Date(source.dateOccured),
            secondaryPlayer: source.secondaryPlayer == null ? null : PlayerMapper.apiModelToDomain(source.secondaryPlayer),
            description: source.description,
        });
    }
}

export default MatchEventMapper;
