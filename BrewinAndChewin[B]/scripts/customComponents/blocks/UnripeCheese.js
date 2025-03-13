var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WorldInitializeBeforeEvent, world } from "@minecraft/server";
import { EventAPI } from "../../lib/EventAPI";
class UnripeCheeseComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
    }
    onRandomTick(args) {
        const block = args.block;
        const blockId = block.typeId;
        const cheeseMap = {
            "brewinandchewin:unripe_flaxen_cheese_wheel": "brewinandchewin:flaxen_cheese_wheel",
            "brewinandchewin:unripe_scarlet_cheese_wheel": "brewinandchewin:scarlet_cheese_wheel"
        };
        const ripeBlockId = cheeseMap[blockId];
        if (ripeBlockId) {
            const face = block.permutation.getState("minecraft:cardinal_direction");
            block.dimension.setBlockType(block.location, ripeBlockId);
            block.dimension.setBlockPermutation(block.location, block.permutation.withState("minecraft:cardinal_direction", face));
        }
    }
}
export class UnripeCheeseComponentRegister {
    register(args) {
        args.blockComponentRegistry.registerCustomComponent('brewinandchewin:unripe_cheese', new UnripeCheeseComponent());
    }
}
__decorate([
    EventAPI.register(world.beforeEvents.worldInitialize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorldInitializeBeforeEvent]),
    __metadata("design:returntype", void 0)
], UnripeCheeseComponentRegister.prototype, "register", null);
