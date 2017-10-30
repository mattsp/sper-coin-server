import { Player } from '../players/players.model';
import { Component } from '@nestjs/common'
import {LatencyEvent} from './latency.event';

@Component()
export class LatencyService {

    public mesure(connection, player:Player):void {
        const measurement = {start: Date.now()};
        player.latencyTrips.push(measurement);
        connection.emit(LatencyEvent.LatencyPing, player);
    }

    public finishMeasuring(player:Player):void {
        var measurement = player.latencyTrips[player.latencyTrips.length-1];
        measurement.end = Date.now();
        measurement.roundTrip = measurement.end - measurement.start;
        player.averageLatency = 0;
        for (let latencyTtrip of player.latencyTrips) {
            player.averageLatency += measurement.roundTrip/2;
        };
        player.averageLatency = player.averageLatency/player.latencyTrips.length;
        player.tickLag = Math.round(player.averageLatency * 2/100)+1;
        console.log('Measuring Latency for player. Attempt', player.latencyTrips.length, '-Average Latency:',player.averageLatency, 'Tick Lag:', player.tickLag);
    }
}