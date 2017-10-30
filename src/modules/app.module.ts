import { LatencyModule } from './latency/latency.module';
import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';

@Module({
    modules: [PlayersModule, LatencyModule],
})
export class ApplicationModule {}