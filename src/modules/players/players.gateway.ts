import { Player } from './players.model';
import { PlayerService } from './players.service';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';

import { CONFIG } from '../../environment';
import { PlayerEvent } from './players.event';

@WebSocketGateway({ port: CONFIG.WS_PORT})

export class PlayersGateway {
    
    constructor(private playerService:PlayerService) {}

    @SubscribeMessage(PlayerEvent.Disconnect)
    public async handleDisconnectPlayer(client){
        console.log('Player has disconnected: ' + client.id);
        this.playerService.delete(client.id);
        client.broadcast.emit(PlayerEvent.RemovePlayer, {id: client.id});
    }

    @SubscribeMessage(PlayerEvent.NewPlayer)
    public handleNewPlayer(client, data){
        console.log('new player: ' + client.id);
        this.playerService.create(new Player(client.id, data.color));
        client.broadcast.emit(PlayerEvent.NewPlayer, {id: client.id, color: data.color});
        for(let player  of this.playerService.players.values()) {
            client.emit(PlayerEvent.NewPlayer, {id: player.getID(), color: player.getColor()});
        }
    }

    @SubscribeMessage(PlayerEvent.MovePlayer)
    public async handleMovePlayer(client, data){
        client.emit(PlayerEvent.MovePlayer, {id: client.id, direction: data.direction});
        client.broadcast.emit(PlayerEvent.MovePlayer, {id: client.id, direction: data.direction});
    }

    @SubscribeMessage(PlayerEvent.StopPlayer)
    public async handleStopPlayer(client, data){
        client.emit(PlayerEvent.StopPlayer, {id: client.id});
        client.broadcast.emit(PlayerEvent.StopPlayer, {id: client.id});
    
    }
}