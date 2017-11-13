import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';

@Module({
    modules: [PlayersModule],
})
export class ApplicationModule {}