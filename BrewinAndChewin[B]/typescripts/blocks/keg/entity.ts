import { Dimension, Entity, ItemStack, Vector3, world, Block, ScoreboardObjective, Container, EntityInventoryComponent, system, BlockVolume, ItemDurabilityComponent, PlatformType, PlayerBreakBlockAfterEvent, BlockExplodeAfterEvent } from "@minecraft/server";
import ObjectUtil from "../../lib/ObjectUtil";
import { EventAPI } from "../../lib/EventAPI";
import { BlockEntity } from "../../lib/BlockWithEntity";
import { kegRecipes } from "../../data/KegRecipes";
import { KegRecipeHolder } from "../../lib/KegRecipeHolder";

//位于 block 处的发酵桶实体（按放置时记录的位置匹配）
function kegEntitiesAt(block: Block): Entity[] {
    const { x, y, z }: Vector3 = block.location;
    const location = { x: x + 0.5, y: y, z: z + 0.5 };
    return block.dimension.getEntities({ type: "brewinandchewin:keg", location: location, maxDistance: 1 })
        .filter(entity => ObjectUtil.isEqual(entity.getDynamicProperty("brewinandchewin:blockEntityDataLocation"), location));
}



export class KegEntity extends BlockEntity {
    constructor() {
        super();
        this.view()
    }
    view() {
        system.runInterval(() => {
            for (const player of world.getPlayers()) {
                const entities = player.getEntitiesFromViewDirection()
                for (let i = 0; i < entities.length; i++) {
                    const args = entities[i]
                    const distance = args.distance
                    if (distance<=3){
                        const entity = args.entity
                        const entityId = entity.typeId
                        if (entityId=="brewinandchewin:keg"){
                            const progress = entity.getDynamicProperty("brewinandchewin:progress_bar") as string ?? "0/100"
                            player.onScreenDisplay.setActionBar({rawtext:[{translate:"brewinandchewin.progress_bar.tooltip"},{text:progress}]})
                            player.getComponent
                            

                        }
                    }
                }

                
            }
        }, 10);
    }
    @EventAPI.register(world.afterEvents.dataDrivenEntityTrigger, { entityTypes: ["brewinandchewin:keg"], eventTypes: ["brewinandchewin:keg_tick"] })
    tick(args: any) {
        const entityBlockData = super.blockEntityData(args.entity);
        if (!entityBlockData) return;
        const entity: Entity = entityBlockData.entity;
        if (super.entityContainerLoot(entityBlockData, entity.typeId)) return;
        const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory?.container;
        if (!container) return;
        const progress: number = entity.getDynamicProperty("brewinandchewin:progress") as number ?? 0;
        const KegRecipe = new KegRecipeHolder(container,entity)
        const temperature = KegRecipe.checkTemperature()
        entity.setDynamicProperty("brewinandchewin:temperature",temperature)
        container.setItem(8,new ItemStack(`brewinandchewin:temperature_${temperature}`))
        KegRecipe.fillResultSlot()
        KegRecipe.fillFluidSlot()
        // 内置配方和其他附属通过 brewinandchewin:keg_recipe 注册的配方
        KegRecipe.findMatchingRecipe(kegRecipes);
    }
    //玩家破坏或爆炸炸掉发酵桶时立即掉落物品并清除实体，不等实体下一次 tick，免得实体和界面留在原地
    @EventAPI.register(world.afterEvents.playerBreakBlock, { blockTypes: ["brewinandchewin:keg"] })
    breakBlock(args: PlayerBreakBlockAfterEvent) {
        for (const entity of kegEntitiesAt(args.block)) {
            const entityBlockData = super.blockEntityData(entity);
            if (entityBlockData) super.entityContainerLoot(entityBlockData, entity.typeId);
        }
    }
    @EventAPI.register(world.afterEvents.blockExplode)
    explode(args: BlockExplodeAfterEvent) {
        if (args.explodedBlockPermutation.type.id != "brewinandchewin:keg") return;
        for (const entity of kegEntitiesAt(args.block)) {
            const entityBlockData = super.blockEntityData(entity);
            if (entityBlockData) super.entityContainerLoot(entityBlockData, entity.typeId);
        }
    }



    
}

