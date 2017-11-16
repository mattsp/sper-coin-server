import { EnemyEvent } from './../enemies/enemies.enum';
import { CoinEvent } from './../coins/coins.enum';
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
        client.broadcast.emit(PlayerEvent.Remove, {id: client.id});
    }

    @SubscribeMessage(PlayerEvent.New)
    public handleNewPlayer(client, data){
        console.log('new player: ' + client.id);
        this.playerService.create(new Player(client.id, data.color));
        client.broadcast.emit(PlayerEvent.New, {id: client.id, color: data.color});
        for(let player  of this.playerService.players.values()) {
            client.emit(PlayerEvent.New, {id: player.getID(), color: player.getColor()});
        }
    }

    @SubscribeMessage(PlayerEvent.Move)
    public async handleMovePlayer(client, data){
        client.emit(PlayerEvent.Move, {id: client.id, direction: data.direction});
        client.broadcast.emit(PlayerEvent.Move, {id: client.id, direction: data.direction});
    }

    @SubscribeMessage(PlayerEvent.Stop)
    public async handleStopPlayer(client, data){
        client.emit(PlayerEvent.Stop, {id: client.id});
        client.broadcast.emit(PlayerEvent.Stop, {id: client.id});
    
    }

    @SubscribeMessage(EnemyEvent.Move)
    public async handleMoveEnemy(client, data){
        client.emit(EnemyEvent.Move, {index: data.index, direction: data.direction});
        client.broadcast.emit(EnemyEvent.Move, {index: data.index, direction: data.direction});
    }

    @SubscribeMessage(EnemyEvent.Respawn)
    public async handleRespawnEnemy(client, data){
        client.emit(EnemyEvent.Respawn, {index: data.index});
        client.broadcast.emit(EnemyEvent.Respawn, {index: data.index});
    }

    @SubscribeMessage(CoinEvent.Respawn)
    public async handleRespawnCoin(client, data){
        client.emit(CoinEvent.Respawn, {newPosition: data.newPosition});
        client.broadcast.emit(CoinEvent.Respawn, {newPosition: data.newPosition});
    }
}