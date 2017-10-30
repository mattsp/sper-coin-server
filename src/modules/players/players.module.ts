import { LatencyModule } from './../latency/latency.module';
import { Module } from '@nestjs/common';
import { PlayerService } from './players.service';
import { PlayersGateway } from './players.gateway';

@Module({
    components: [PlayersGateway, PlayerService],
    modules: [LatencyModule]
})
export class PlayersModule { }