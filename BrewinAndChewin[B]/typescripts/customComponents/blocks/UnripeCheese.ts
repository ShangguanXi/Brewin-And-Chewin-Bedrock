import { BlockCustomComponent, BlockComponentPlayerInteractEvent, WorldInitializeBeforeEvent, world, Dimension, Vector3, BlockVolumeBase, BlockVolume, EntityInventoryComponent, Container, ItemStack, BlockComponentRandomTickEvent, BlockType } from "@minecraft/server";
import { EventAPI } from "../../lib/EventAPI";

class UnripeCheeseComponent implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
    }

    onRandomTick(args: BlockComponentRandomTickEvent): void {
        const block = args.block;
        const blockId = block.typeId
        const cheeseMap: Record<string, string> = {
            "brewinandchewin:unripe_flaxen_cheese_wheel": "brewinandchewin:flaxen_cheese_wheel",
            "brewinandchewin:unripe_scarlet_cheese_wheel": "brewinandchewin:scarlet_cheese_wheel"
        };
        const ripeBlockId = cheeseMap[blockId];
        if (ripeBlockId) {
            const face = block.permutation.getState("minecraft:cardinal_direction") as string;
            block.dimension.setBlockType(block.location, ripeBlockId);
            block.dimension.setBlockPermutation(block.location, block.permutation.withState("minecraft:cardinal_direction", face));
        }
           
    }

}
export class UnripeCheeseComponentRegister {
    @EventAPI.register(world.beforeEvents.worldInitialize)
    register(args: WorldInitializeBeforeEvent) {
        args.blockComponentRegistry.registerCustomComponent('brewinandchewin:unripe_cheese', new UnripeCheeseComponent());
    }

}
