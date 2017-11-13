import { PlayerService } from './players.service';
import { Module } from '@nestjs/common';
import { PlayersGateway } from './players.gateway';

@Module({
    components: [PlayersGateway, PlayerService]
})
export class PlayersModule { }