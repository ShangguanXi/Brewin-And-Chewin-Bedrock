var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemStopUseAfterEvent, world } from "@minecraft/server";
import { EventAPI } from "../lib/EventAPI";
import { EffectsMap } from "../data/EffectsMap";
const effectsMap = new EffectsMap;
export class Foods {
    food(args) {
        const itemStack = args.itemStack;
        if (!itemStack)
            return;
        const player = args.source;
        const useDuration = args.useDuration;
        const effects = effectsMap.alcoholicEffectsMap.get(itemStack.typeId);
        if (itemStack && useDuration == 0) {
            if (itemStack.hasTag("brewinandchewin:alcoholic_beverage"))
                player.addEffect('nausea', 10 * 20, { amplifier: 0 });
            if (effects) {
                effects.forEach(({ effect, duration, amplifier }) => {
                    player.addEffect(effect, duration, { amplifier });
                });
            }
        }
    }
}
__decorate([
    EventAPI.register(world.afterEvents.itemStopUse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ItemStopUseAfterEvent]),
    __metadata("design:returntype", void 0)
], Foods.prototype, "food", null);
