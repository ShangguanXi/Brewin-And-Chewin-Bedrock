import { Dimension, Entity, ItemStack, Vector3, world, Block, ScoreboardObjective, Container, EntityInventoryComponent, system, BlockVolume, ItemDurabilityComponent, PlatformType } from "@minecraft/server";
import ObjectUtil from "../../lib/ObjectUtil";
import { EventAPI } from "../../lib/EventAPI";
import { BlockEntity } from "../../lib/BlockWithEntity";
import { kegRecipes } from "../../data/KegRecipes";
import { KegRecipeHolder } from "../../lib/KegRecipeHolder";




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
        super.entityContainerLoot(entityBlockData, entity.typeId);
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



    
}

