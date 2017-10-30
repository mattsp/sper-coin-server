import { LatencyService } from './latency.service';
import { Module } from '@nestjs/common';

@Module({
    components: [LatencyService],
    modules: [],
    exports: [LatencyService]
})
export class LatencyModule { }