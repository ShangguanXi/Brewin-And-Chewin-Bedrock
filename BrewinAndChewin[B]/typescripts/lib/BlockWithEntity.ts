import { Block, Container, Dimension, Entity, EntityInventoryComponent, EntityQueryOptions, ScoreboardObjective, system, Vector3, world } from "@minecraft/server";
import ObjectUtil from "./ObjectUtil";
const scoreboard = world.scoreboard;

export class BlockWithEntity {
    //名为setblock实际上是放置对应方块实体的实体，若成功则返回放置的实体
    public setBlock(dimension: Dimension, location: Vector3, entityId: string): Entity {
        const entity: Entity = dimension.spawnEntity(entityId, location);
        entity.setDynamicProperty("brewinandchewin:blockEntityDataLocation", location);
        entity.setDynamicProperty("brewinandchewin:entityId", entity.id);
        return entity
    }
    //获取方块实体数据
    public entityBlockData(block: Block, opt: EntityQueryOptions) {
        const dimension = block.dimension;
        const entities = dimension.getEntitiesAtBlockLocation(opt.location as Vector3);
        let entityBlock: Entity | undefined = undefined;
        for (const entity of entities) {
            if (
                ObjectUtil.isEqual(entity.getDynamicProperty('brewinandchewin:blockEntityDataLocation'), entity.location) &&
                entity.id == entity.getDynamicProperty("brewinandchewin:entityId") &&
                entity.typeId == opt.type
            ) {
                entityBlock = entity;
                break;
            };
        };
        if (!entityBlock) return undefined;
        const scoreboardObjective: ScoreboardObjective | null = scoreboard.getObjective(entityBlock.typeId + entityBlock.id) ?? null;
        const blockEntityDataLocation: Vector3 = entityBlock.getDynamicProperty('brewinandchewin:blockEntityDataLocation') as Vector3;
        return { block: block, dimension: dimension, entity: entityBlock, scoreboardObjective: scoreboardObjective, blockEntityDataLocation: blockEntityDataLocation };
    }
}

interface BlockEntityData {
    readonly entity: Entity,
    readonly dimension: Dimension,
    readonly blockEntityDataLocation: Vector3,
    readonly block: Block,
    readonly scoreboardObjective: ScoreboardObjective | null
}


export class BlockEntity {
    //获取方块实体数据
    public blockEntityData(entity: Entity): BlockEntityData | undefined {
        try {
            const dimension: Dimension = entity?.dimension ?? undefined;
            const blockEntityDataLocation = entity.getDynamicProperty('brewinandchewin:blockEntityDataLocation') as Vector3;
            const block = dimension.getBlock(blockEntityDataLocation) as Block;
            const scoreboardObjective = scoreboard.getObjective(entity.typeId + entity.id) ?? null;
            const blockEntityData: BlockEntityData = { entity: entity, dimension: dimension, blockEntityDataLocation: blockEntityDataLocation, block: block, scoreboardObjective: scoreboardObjective }
            return blockEntityData;
        } catch (error) {
            return undefined;
        }
    };
    //对使用容器组件存储物品的方块实体检测掉落
    public entityContainerLoot(args: BlockEntityData, id: string) {
        if (!ObjectUtil.isEqual(args.entity.location, args.blockEntityDataLocation)) args.entity.teleport(args.blockEntityDataLocation);
        if (args.block?.typeId == id) return;
        const entity = args.entity as Entity;
        const dimension = args.dimension;
        const inventory = entity.getComponent("inventory") as EntityInventoryComponent
        const container = inventory.container as Container;
        for (let i = 0, length = container.size; i < length; i++) {
            if(i==5||i==7||i==8) continue
            const itemStack = container.getItem(i)
            if (itemStack) {
                dimension.spawnItem(itemStack, entity.location)
            }
        };
        BlockEntity.clearEntity(args);
    };
    //清除方块实体
    public static clearEntity(args: BlockEntityData) {
        if (args.scoreboardObjective) {
            scoreboard.removeObjective(args.entity.typeId + args.entity.id);
        }
        system.runTimeout(() => {
            args.entity.remove();
        });
    }
}
