var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ItemStack, world, system, PlayerBreakBlockAfterEvent, BlockExplodeAfterEvent } from "@minecraft/server";
import ObjectUtil from "../../lib/ObjectUtil";
import { EventAPI } from "../../lib/EventAPI";
import { BlockEntity } from "../../lib/BlockWithEntity";
import { kegRecipes } from "../../data/KegRecipes";
import { KegRecipeHolder } from "../../lib/KegRecipeHolder";
//位于 block 处的发酵桶实体（按放置时记录的位置匹配）
function kegEntitiesAt(block) {
    const { x, y, z } = block.location;
    const location = { x: x + 0.5, y: y, z: z + 0.5 };
    return block.dimension.getEntities({ type: "brewinandchewin:keg", location: location, maxDistance: 1 })
        .filter(entity => ObjectUtil.isEqual(entity.getDynamicProperty("brewinandchewin:blockEntityDataLocation"), location));
}
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
        if (super.entityContainerLoot(entityBlockData, entity.typeId))
            return;
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
    //玩家破坏或爆炸炸掉发酵桶时立即掉落物品并清除实体，不等实体下一次 tick，免得实体和界面留在原地
    breakBlock(args) {
        for (const entity of kegEntitiesAt(args.block)) {
            const entityBlockData = super.blockEntityData(entity);
            if (entityBlockData)
                super.entityContainerLoot(entityBlockData, entity.typeId);
        }
    }
    explode(args) {
        if (args.explodedBlockPermutation.type.id != "brewinandchewin:keg")
            return;
        for (const entity of kegEntitiesAt(args.block)) {
            const entityBlockData = super.blockEntityData(entity);
            if (entityBlockData)
                super.entityContainerLoot(entityBlockData, entity.typeId);
        }
    }
}
__decorate([
    EventAPI.register(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["brewinandchewin:keg"], eventTypes: ["brewinandchewin:keg_tick"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KegEntity.prototype, "tick", null);
__decorate([
    EventAPI.register(world.afterEvents.playerBreakBlock, { blockTypes: ["brewinandchewin:keg"] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerBreakBlockAfterEvent]),
    __metadata("design:returntype", void 0)
], KegEntity.prototype, "breakBlock", null);
__decorate([
    EventAPI.register(world.afterEvents.blockExplode),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BlockExplodeAfterEvent]),
    __metadata("design:returntype", void 0)
], KegEntity.prototype, "explode", null);
