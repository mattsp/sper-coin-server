import { Component } from '@nestjs/common';

export class Player {

    public latencyTrips;
    public averageLatency:number;
    public tickLag:number;
    
    constructor(private _x:number, private _y:number, private _direction?: string,  private _color?: number, private _id?:string){
        this.latencyTrips = [];
    }

    public getX():number{
        return this._x;
    }
    public getY():number{
        return this._y;
    }
    public getID():string{
        return this._id;
    }
    
    public setID(id:string):void{
            this._id = id;
    }

    public setX(x:number):void{
         this._x = x;
    }
    public setY(y:number):void{
         this._y = y;
    }
    public setDirection(direction: string): void {
        this._direction = direction;
    }

    public getDirection(): string {
        return this._direction;
    }

    public setColor(color: number): void {
        this._color = color;
    }

    public getColor(): number {
        return this._color;
    }
}