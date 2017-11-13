import { Component } from '@nestjs/common';
import { Player } from './players.model';

@Component()
export class PlayerService {
    private _existingPlayers:Map<string, Player>

    constructor() {
        this._existingPlayers = new Map<string, Player>();
    }

    create(player:Player) {
        this._existingPlayers.set(player.getID(), player);
    }

    delete(id:string) {
        this._existingPlayers.delete(id);
    }

    public get players(): Map<string, Player> {
        return this._existingPlayers;
    }
}