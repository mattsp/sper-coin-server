import { LatencyService } from './../latency/latency.service';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';

import { CONFIG } from '../../environment';
import { Player } from './players.model';
import { PlayerService } from './players.service';
import { PlayerEvent } from './players.event';
import { LatencyEvent } from '../latency/latency.event';

@WebSocketGateway({ port: CONFIG.WS_PORT})

export class PlayersGateway {
    
    constructor(private playerService: PlayerService, private latencyService:LatencyService) {}

    @SubscribeMessage(PlayerEvent.Disconnect)
    public async handleDisconnectPlayer(client){
        console.log('Player has disconnected: ' + client.id);
        
        await this.playerService.delete(client.id);
    
        // Broadcast removed player to connected socket clients
        client.broadcast.emit(PlayerEvent.RemovePlayer, {id: client.id});
    }

    @SubscribeMessage(PlayerEvent.NewPlayer)
    public handleNewPlayer(client, data){
        console.log('new player: ' + client.id);
        const newPlayer = new Player(data.x, data.y);

        this.latencyService.mesure(client, newPlayer);
        
        newPlayer.setID(client.id);
        newPlayer.setColor(data.color);
        client.broadcast.emit(PlayerEvent.NewPlayer, {id: newPlayer.getID(), x: newPlayer.getX(), y: newPlayer.getY(), color: newPlayer.getColor()});
        this.playerService.register(newPlayer, (existingPlayer)=>{
            client.emit(PlayerEvent.NewPlayer, {id: existingPlayer.getID(), x: existingPlayer.getX(), y: existingPlayer.getY(), color: existingPlayer.getColor()});
        });
    }

    @SubscribeMessage(PlayerEvent.MovePlayer)
    public async handlemovePlayer(client, data){
        // Find player in array
	    const movePlayer = await this.playerService.getById(client.id);
    
        // Player not found
        if (!movePlayer) {
            console.log('Player not found: '+client.id);
            return;
        };
    
        // Update player position
        movePlayer.setX(data.x);
        movePlayer.setY(data.y);
        movePlayer.setDirection(data.direction);
    
        // Broadcast updated position to connected socket clients
        client.broadcast.emit(PlayerEvent.MovePlayer, {id: movePlayer.getID(), x: movePlayer.getX(), y: movePlayer.getY(), direction: movePlayer.getDirection()});
    }

    @SubscribeMessage(PlayerEvent.StopPlayer)
    public async handleStopPlayer(client, data){

         // Find player in array
	    const stopPlayer = await this.playerService.getById(client.id);
        
            // Player not found
            if (!stopPlayer) {
                console.log('Player not found: '+client.id);
                return;
            };
        
            // Update player position
            stopPlayer.setX(data.x);
            stopPlayer.setY(data.y);
        
            // Broadcast updated position to connected socket clients
            client.broadcast.emit(PlayerEvent.StopPlayer, {id: stopPlayer.getID(), x: stopPlayer.getX(), y: stopPlayer.getY()});
    
    }
    @SubscribeMessage(LatencyEvent.LatencyPong)
    public async handleLatencyPongPlayer(client, data){
        this.latencyService.finishMeasuring(data);
        if(data.latencyTrips.length < 3){
            this.latencyService.mesure(client, data);
        }
    }
}