import { world, PlayerBreakBlockAfterEvent, PlayerBreakBlockAfterEventSignal, PlayerBreakBlockBeforeEvent, ItemComponentTypes, ItemEnchantableComponent, system, Container, EntityInventoryComponent, ItemStack, PlayerInteractWithBlockAfterEvent } from "@minecraft/server";
import { EventAPI } from "../lib/EventAPI";
import { ItemAPI } from "../lib/ItemAPI";

export class Cheese {
    @EventAPI.register(world.beforeEvents.playerBreakBlock)
    playerBreak(args: PlayerBreakBlockBeforeEvent) {
        const block = args.block
        const itemStack = args.itemStack
        if (!itemStack) return
        const cheese: string[] = [
            "brewinandchewin:flaxen_cheese_wheel",
            "brewinandchewin:scarlet_cheese_wheel"
        ];
        if (!cheese.includes(block.typeId)) return
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
        const block = args.block;
        const player = args.player;
        if (!player) return
        const location = block.location
        const stage = block.permutation.getState("brewinandchewin:food_block_stage") as number
        const inventory = args.player?.getComponent("inventory") as EntityInventoryComponent;
        const container: Container | undefined = inventory?.container
        const itemStack = container?.getItem(player.selectedSlotIndex)
        const cheeseMap: Record<string, string> = {
            "brewinandchewin:flaxen_cheese_wheel": "brewinandchewin:flaxen_cheese_wedge",
            "brewinandchewin:scarlet_cheese_wheel": "brewinandchewin:scarlet_cheese_wedge"
        };
        if (!container) return;
        if (!cheeseMap[block.typeId]) return
        if (itemStack?.hasTag("farmersdelight:is_knife")) {
            block.dimension.spawnItem(new ItemStack(cheeseMap[block.typeId]), block.location)
            if (stage != 3) block.setPermutation(block.permutation.withState("brewinandchewin:food_block_stage", stage + 1))
            else block.dimension.runCommand(`fill ${location.x} ${location.y} ${location.z} ${location.x} ${location.y} ${location.z} air [] destroy`)
            
        }
        else player.onScreenDisplay.setActionBar({ translate: 'brewinandchewin.blockfood.is_knife' });
    }

}