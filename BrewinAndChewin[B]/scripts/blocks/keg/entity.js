var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemStack, world, system } from "@minecraft/server";
import { EventAPI } from "../../lib/EventAPI";
import { BlockEntity } from "../../lib/BlockWithEntity";
import { kegRecipes } from "../../data/KegRecipes";
import { KegRecipeHolder } from "../../lib/KegRecipeHolder";
export class KegEntity extends BlockEntity {
    constructor() {
        super();
        this.view();
    }
    view() {
        system.runInterval(() => {
            for (const player of world.getPlayers()) {
                const entities = player.getEntitiesFromViewDirection();
                for (let i = 0; i < entities.length; i++) {
                    const args = entities[i];
                    const distance = args.distance;
                    if (distance <= 3) {
                        const entity = args.entity;
                        const entityId = entity.typeId;
                        if (entityId == "brewinandchewin:keg") {
                            const progress = entity.getDynamicProperty("brewinandchewin:progress_bar") ?? "0/100";
                            player.onScreenDisplay.setActionBar({ rawtext: [{ translate: "brewinandchewin.progress_bar.tooltip" }, { text: progress }] });
                            player.getComponent;
                        }
                    }
                }
            }
        }, 10);
    }
    tick(args) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData)
            return;
        const entity = entityBlockData.entity;
        super.entityContainerLoot(entityBlockData, entity.typeId);
        const inventory = entity.getComponent("inventory");
        const container = inventory?.container;
        if (!container)
            return;
        const progress = entity.getDynamicProperty("brewinandchewin:progress") ?? 0;
        const KegRecipe = new KegRecipeHolder(container, entity);
        const temperature = KegRecipe.checkTemperature();
        entity.setDynamicProperty("brewinandchewin:temperature", temperature);
        container.setItem(8, new ItemStack(`brewinandchewin:temperature_${temperature}`));
        KegRecipe.fillResultSlot();
        KegRecipe.fillFluidSlot();
        // 内置配方和其他附属通过 brewinandchewin:keg_recipe 注册的配方
        KegRecipe.findMatchingRecipe(kegRecipes);
    }
}
__decorate([
    EventAPI.register(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["brewinandchewin:keg"], eventTypes: ["brewinandchewin:keg_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KegEntity.prototype, "tick", null);
