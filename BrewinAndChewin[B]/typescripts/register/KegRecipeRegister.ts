import { ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { EventAPI } from "../lib/EventAPI";
import { Ingredient, kegRecipes, Recipe } from "../data/KegRecipes";
import { fluidTypes } from "../data/FluidType";

const isId = (value: unknown): value is string => typeof value === "string" && value.includes(":");

/** 校验外部发来的发酵桶配方，返回整理后的配方，不合法时返回原因 */
function parseKegRecipe(data: any): Recipe | string {
    if (!data || typeof data !== "object") return "message is not a JSON object";
    const { basefluid, fermentingtime, temperature, ingredients, result } = data;
    if (basefluid !== undefined && !isId(basefluid)) return "'basefluid' must be an item id";
    if (!Number.isInteger(fermentingtime) || fermentingtime <= 0) return "'fermentingtime' must be a positive number of ticks";
    if (!Number.isInteger(temperature) || temperature < 1 || temperature > 5) return "'temperature' must be 1 ~ 5";
    if (!Array.isArray(ingredients) || ingredients.length < 1 || ingredients.length > 4) return "'ingredients' must have 1 ~ 4 entries";
    const parsed: Ingredient[] = [];
    for (const ingredient of ingredients) {
        if (isId(ingredient?.item)) parsed.push({ item: ingredient.item });
        else if (isId(ingredient?.tag)) parsed.push({ tag: ingredient.tag });
        else return "every ingredient needs an 'item' or a 'tag'";
    }
    if (!isId(result?.item)) return "'result.item' must be an item id";
    const count = result.count ?? 1;
    if (!Number.isInteger(count) || count < 1) return "'result.count' must be a positive integer";
    return { ...(basefluid ? { basefluid } : {}), fermentingtime, ingredients: parsed, result: { count, item: result.item }, temperature };
}

export class KegRecipeRegister {
    /**
     * 其他附属通过 scriptEvent 注册发酵桶配方，用法和农夫乐事的配方注册一样，message 为 JSON：
     *
     * brewinandchewin:keg_recipe
     * {
     *   "basefluid": "minecraft:water_bucket",   // 可选，液体槽里需要的基底液体
     *   "fermentingtime": 9600,                   // 发酵时间（刻）
     *   "temperature": 3,                         // 1 冰冻 2 寒冷 3 常温 4 温暖 5 炎热
     *   "ingredients": [{ "item": "minecraft:wheat" }, { "tag": "farmersdelight:is_tomato" }],   // 1 ~ 4 个
     *   "result": { "item": "mod:drink", "count": 4 }
     * }
     *
     * brewinandchewin:keg_fluid —— 产物是要用容器（比如酒杯）装取的液体时，登记它的容器：
     * { "fluid": "mod:drink", "container": "brewinandchewin:tankard" }
     *
     * 例：system.sendScriptEvent("brewinandchewin:keg_recipe", JSON.stringify(recipe))
     */
    @EventAPI.register(system.afterEvents.scriptEventReceive, { namespaces: ["brewinandchewin"] })
    register(args: ScriptEventCommandMessageAfterEvent) {
        if (args.id !== "brewinandchewin:keg_recipe" && args.id !== "brewinandchewin:keg_fluid") return;
        let data: any;
        try {
            data = JSON.parse(args.message);
        } catch (error) {
            console.warn(`[Brewin' And Chewin'] ${args.id}: invalid JSON: ${args.message}`);
            return;
        }
        if (args.id === "brewinandchewin:keg_fluid") {
            if (!isId(data?.fluid) || !isId(data?.container)) {
                console.warn(`[Brewin' And Chewin'] ${args.id}: 'fluid' and 'container' must be item ids: ${args.message}`);
                return;
            }
            fluidTypes[data.fluid] = data.container;
            return;
        }
        const recipe = parseKegRecipe(data);
        if (typeof recipe === "string") {
            console.warn(`[Brewin' And Chewin'] ${args.id}: ${recipe}: ${args.message}`);
            return;
        }
        const key = JSON.stringify(recipe);
        if (kegRecipes.some(existing => JSON.stringify(existing) === key)) return;
        kegRecipes.push(recipe);
    }
}
