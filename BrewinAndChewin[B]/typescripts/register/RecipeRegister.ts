import { WorldLoadAfterEvent, system, world } from "@minecraft/server";
import { EventAPI } from "../lib/EventAPI";
import { cookingPotRecipes } from "../data/CookingPotRecipes";

/**
 * 通过农夫乐事的脚本事件注册配方
 * @param id 脚本事件ID
 * @param recipes 配方列表
 */
function sendRecipes(id: string, recipes: object[]) {
    for (const recipe of recipes) {
        system.sendScriptEvent(id, JSON.stringify(recipe));
    }
}

export class RecipeRegister {
    @EventAPI.register(world.afterEvents.worldLoad)
    register(args: WorldLoadAfterEvent) {
        system.run(() => {
            sendRecipes("farmersdelight:cooking_pot_recipe", cookingPotRecipes);
        })
    }
}
