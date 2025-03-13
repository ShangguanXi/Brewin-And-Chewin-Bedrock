import { world, PlayerBreakBlockAfterEvent, PlayerBreakBlockAfterEventSignal, PlayerBreakBlockBeforeEvent, ItemComponentTypes, ItemEnchantableComponent, system, PlayerInteractWithBlockAfterEvent, ItemStack } from "@minecraft/server";
import { EventAPI } from "../lib/EventAPI";
import { ItemAPI } from "../lib/ItemAPI";

export class Pizza {
    @EventAPI.register(world.beforeEvents.playerBreakBlock)
    playerBreak(args: PlayerBreakBlockBeforeEvent) {
        const block = args.block
        const itemStack = args.itemStack
        if (!itemStack) return
        if (block.typeId != "brewinandchewin:pizza") return
        const stage = block.permutation.getState("brewinandchewin:food_block_stage") as number
        if (stage==0) return
        const enchant = itemStack.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent;
        const silkTouch = enchant?.getEnchantment('silk_touch');
        if (silkTouch) {
            args.cancel = true
            system.runTimeout(() => {
                ItemAPI.damage(args.player, args.player.selectedSlotIndex)
                block.dimension.runCommand(`fill ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.x} ${block.location.y} ${block.location.z} air destroy`)
            })
        }

    }
    @EventAPI.register(world.afterEvents.playerInteractWithBlock)
    use(args: PlayerInteractWithBlockAfterEvent) {
        const block = args.block
        const player = args.player
        const itemStack = args.itemStack
        const location = block.location
        const dimension = block.dimension
        if (block.typeId!="brewinandchewin:pizza") return
        if (player.isSneaking) return
        dimension.spawnItem(new ItemStack("brewinandchewin:pizza_slice"),{x:location.x+0.5,y:location.y+0.5,z:location.z+0.5})
        const stage = block.permutation.getState("brewinandchewin:food_block_stage") as number
        if (stage<3) block.setPermutation(block.permutation.withState("brewinandchewin:food_block_stage",stage+1))
        else dimension.setBlockType(location,"minecraft:air")
    }
}