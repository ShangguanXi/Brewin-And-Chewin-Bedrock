import { Block, Dimension, Entity, EntityQueryOptions, PlayerPlaceBlockAfterEvent, ScoreboardObjective, Vector3, world } from "@minecraft/server";

import { EventAPI } from "../../lib/EventAPI";
import { BlockWithEntity } from "../../lib/BlockWithEntity";

export class Keg extends BlockWithEntity {
    @EventAPI.register(world.afterEvents.playerPlaceBlock)
    placeBlock(args: PlayerPlaceBlockAfterEvent) {
        const block: Block = args.block;
        if (block.typeId!="brewinandchewin:keg") return;
        const { x, y, z }: Vector3 = block.location;
        const entity = super.setBlock(args.block.dimension, { x: x + 0.5, y: y, z: z + 0.5 }, block.typeId);
        entity.nameTag = `brewinandchewin:keg`;
    }
}