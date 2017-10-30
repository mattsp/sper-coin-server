import { Component } from '@nestjs/common'
import { Player } from './players.model';

@Component()
export class PlayerService {

    private _players:Map<string, Player>;
    
    constructor() {
        this._players = new Map<string, Player>();
    }

    public async getById(id: string):Promise<Player> {
        return await new Promise<Player>((resolve, reject)=>{
            resolve(this._players.get(id));
            resolve();
        })
    }

    public register(player:Player, callback:(existingPlayer:Player)=>void):void {
        for (let existingPlayer of this._players.values()) {
            callback(existingPlayer)
        }
        this._players.set(player.getID(),player);
    }

    public async delete(id: string):Promise<any> {
        return await new Promise<Player>(async (resolve, reject)=>{
            const removePlayer = await this.getById(id);
                // Player not found
                if (!removePlayer) {
                    console.log("Player not found: "+ id);
                    resolve();
                    return;
                };
                this._players.delete(id);
                resolve();
        });
    }

}