import { Entity, system, world } from "@minecraft/server";
import { EventAPI } from "../EventAPI";


export const playerMap = new Map();
export class TickEvent {
    public subscribe(callBack: any): any {
        this.playerJoin;
        this.playerLeave;
        system.runInterval(() => {
            for (const [key, value] of playerMap) {
                const player: Entity | undefined = world.getEntity(value);
                callBack(player);
            }
        })
    }
    @EventAPI.register(world.afterEvents.playerJoin)
    private playerJoin(args: any) {
        playerMap.set(args.playerName, args.playerId);
    }
    @EventAPI.register(world.afterEvents.playerLeave)
    private playerLeave(args: any) {
        playerMap.delete(args.playerName);
    }
}