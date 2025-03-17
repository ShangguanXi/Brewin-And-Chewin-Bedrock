import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from '@minecraft/server-ui';
import { ItemStack, ItemUseAfterEvent, world } from "@minecraft/server";
import { kepRecipes, Recipe } from '../data/KegRcipes';
import { EventAPI } from '../lib/EventAPI';

interface RawTextEntry {
    text?: string;
    translate?: string;
}

interface RecipeResult {
    rawtext: RawTextEntry[];
}
class Book {

    private generateRecipeText(selection: number | undefined): RecipeResult {
        let result: RecipeResult = { "rawtext": [] };
        if (!selection && selection != 0) return result
        const recipe = kepRecipes[selection]
        const baseFluid = [
            { translate: "brewinandchewin.book.recipe.base_fluid" },
            { translate: recipe.basefluid?.includes("minecraft") ? "item." + recipe.basefluid.split(":")[1] + ".name" : "item." + recipe.basefluid },
            { text: "\n" }
        ]
        const time = [
            { translate: "brewinandchewin.book.recipe.time" },
            { translate: String(recipe.fermentingtime) },
            { text: "\n" }
        ]
        const temperature = [
            { translate: "brewinandchewin.book.recipe.temperature." + recipe.temperature },
            { text: "\n" }
        ]
        let ingredients: { text?: string; translate?: string }[] = [{ translate: "brewinandchewin.book.recipe.ingredients" }, { text: "\n" }];
        recipe.ingredients.forEach(ingredient => {
            if (ingredient.item) {
                ingredients.push(
                    { text: "§3—Item: §r" },
                    { translate: ingredient.item?.includes("minecraft") ? "item." + ingredient.item.split(":")[1] + ".name" : "item." + ingredient.item },
                    { text: "\n" }
                );
            }
            if (ingredient.tag) {
                ingredients.push(
                    { text: "§2—Tag: §r" },
                    { text: ingredient.tag },
                    { text: "\n" }
                );
            }
        })
        const results = [
            { translate: "brewinandchewin.book.recipe.result" },
            { text: recipe.result.count + "x " },
            { translate: recipe.result.item?.includes("minecraft") ? "item." + recipe.result.item.split(":")[1] + ".name" : "item." + recipe.result.item },
        ]
        result.rawtext.push(...baseFluid, ...time, ...temperature, ...ingredients, ...results);
        return result;
    }
    private kegRecipeFrom(player: any, selection: number | undefined) {
        console.warn(selection)
        if (!selection && selection != 0) return

        let kegForm = new ActionFormData().title({ "rawtext": [{ text: "item." + kepRecipes[selection].result.item }] })
            .button({ "rawtext": [{ text: "brewinandchewin.book.back" }] })
        kegForm.body(this.generateRecipeText(selection))
        kegForm.show(player).then((response: ActionFormResponse) => {
            this.recipeListForm(player)
        });

    }
    private recipeListForm(player: any) {
        let recipeList = new ActionFormData()
            .title({ "rawtext": [{ text: "brewinandchewin.book.recipe.title" }] })
        for (let i = 0; i < kepRecipes.length; i++) {
            recipeList.button({ "rawtext": [{ text: "item." + kepRecipes[i].result.item }] }, "textures/items/" + kepRecipes[i].result.item.replace("brewinandchewin:", ""));
        }
        recipeList.button({ "rawtext": [{ text: "brewinandchewin.book.back" }] })
        recipeList.show(player).then((response: ActionFormResponse) => {
            if (response.selection==kepRecipes.length||response.selection==undefined) this.mainForm(player)
            else this.kegRecipeFrom(player, response.selection)
            
        });

    }
    private kegForm(player: any) {
        const kegForm = new ActionFormData().title({
            "rawtext": [
                { text: "brewinandchewin.book.keg.title" }]
        }).body({
            "rawtext": [
                { text: "brewinandchewin.book.keg.body" }]
        }).button({ "rawtext": [{ text: "brewinandchewin.book.back" }] })
        kegForm.show(player).then((response: ActionFormResponse) => {
            if (!response.selection) this.mainForm(player)
        });
    }
    private temperatureForm(player: any) {
        const temperatureForm = new ActionFormData().title({
            "rawtext": [
                { text: "brewinandchewin.book.temperature.title" }]
        }).body({
            "rawtext": [
                { text: "brewinandchewin.book.temperature.body" }]
        }).button({ "rawtext": [{ text: "brewinandchewin.book.back" }] })
        temperatureForm.show(player).then((response: ActionFormResponse) => {
            if (!response.selection) this.mainForm(player)
        });
    }
    private thanksForm(player: any) {
        const thanksForm = new ActionFormData().title({
            "rawtext": [
                { text: "brewinandchewin.book.thanks.title" }]
        }).body({
            "rawtext": [
                { translate: "brewinandchewin.book.thanks.permit" },
                { text: "\n" },
                { translate: "brewinandchewin.book.thanks.license" },
                { text: "\n" },
                { translate: "brewinandchewin.book.thanks.contributors" },
            ]
        }).button({ "rawtext": [{ text: "brewinandchewin.book.back" }] })
        thanksForm.show(player).then((response: ActionFormResponse) => {
            if (!response.selection) this.mainForm(player)
        });
    }

    public mainForm(player: any) {
        const mainForm = new ActionFormData().title({ "rawtext": [{ text: "item.brewinandchewin:book_brewinandchewin" }] })
        mainForm.body({
            "rawtext": [{ text: "brewinandchewin.book.body" }]
        })
        mainForm.button({
            "rawtext": [
                { text: "brewinandchewin.book.keg.title" }]
        }).button({
            "rawtext": [
                { text: "brewinandchewin.book.temperature.title" }]
        }).button({
            "rawtext": [
                { text: "brewinandchewin.book.recipe.title" }]
        }).button({
            "rawtext": [
                { text: "brewinandchewin.book.thanks.title" }]
        })
        mainForm.show(player).then((response: ActionFormResponse) => {
            switch (response.selection) {
                case 0: this.kegForm(player); break;
                case 1: this.temperatureForm(player); break;
                case 2: this.recipeListForm(player); break
                case 3: this.thanksForm(player); break


            }
        });
    }
}

export class BookItem {
    @EventAPI.register(world.afterEvents.itemUse)
    itemUse(args: ItemUseAfterEvent) {
        const player = args.source;
        const itemStack: ItemStack | undefined = args.itemStack;
        if (itemStack?.typeId == "brewinandchewin:book_brewinandchewin") {
            const book = new Book()
            book.mainForm(player);
        }
    }
}