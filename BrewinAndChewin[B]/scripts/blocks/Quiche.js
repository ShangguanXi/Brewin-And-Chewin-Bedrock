var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { world, PlayerBreakBlockBeforeEvent, ItemComponentTypes, system, PlayerInteractWithBlockAfterEvent, ItemStack } from "@minecraft/server";
import { EventAPI } from "../lib/EventAPI";
import { ItemAPI } from "../lib/ItemAPI";
export class Quiche {
    playerBreak(args) {
        const block = args.block;
        const itemStack = args.itemStack;
        if (!itemStack)
            return;
        if (block.typeId != "brewinandchewin:quiche")
            return;
        const stage = block.permutation.getState("brewinandchewin:food_block_stage");
        if (stage == 0)
            return;
        const enchant = itemStack.getComponent(ItemComponentTypes.Enchantable);
        const silkTouch = enchant?.getEnchantment('silk_touch');
        if (silkTouch) {
            args.cancel = true;
            system.runTimeout(() => {
                ItemAPI.damage(args.player, args.player.selectedSlotIndex);
                block.dimension.runCommand(`fill ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.x} ${block.location.y} ${block.location.z} air destroy`);
            });
        }
    }
    use(args) {
        const block = args.block;
        const player = args.player;
        const itemStack = args.itemStack;
        const location = block.location;
        const dimension = block.dimension;
        if (block.typeId != "brewinandchewin:quiche")
            return;
        if (player.isSneaking)
            return;
        if ((!itemStack) || (!itemStack.hasTag("farmersdelight:is_knife")))
            player.addEffect("speed", 30 * 20);
        else
            dimension.spawnItem(new ItemStack("brewinandchewin:quiche_slice"), { x: location.x + 0.5, y: location.y + 0.5, z: location.z + 0.5 });
        const stage = block.permutation.getState("brewinandchewin:food_block_stage");
        if (stage < 3)
            block.setPermutation(block.permutation.withState("brewinandchewin:food_block_stage", stage + 1));
        else
            dimension.setBlockType(location, "minecraft:air");
    }
}
__decorate([
    EventAPI.register(world.beforeEvents.playerBreakBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockBeforeEvent]),
    __metadata("design:returntype", void 0)
], Quiche.prototype, "playerBreak", null);
__decorate([
    EventAPI.register(world.afterEvents.playerInteractWithBlock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerInteractWithBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], Quiche.prototype, "use", null);
