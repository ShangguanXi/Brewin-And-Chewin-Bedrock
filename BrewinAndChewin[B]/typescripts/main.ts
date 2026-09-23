import { Cheese } from "./blocks/Cheese";
import { FieryFonduePot } from "./blocks/FieryFonduePot";
import { Keg } from "./blocks/keg/block";
import { KegEntity } from "./blocks/keg/entity";
import { Pizza } from "./blocks/Pizza";
import { Quiche } from "./blocks/Quiche";
import { UnripeCheeseComponentRegister } from "./customComponents/blocks/UnripeCheese";
import { BookItem } from "./items/Book";
import { KegRecipeRegister } from "./register/KegRecipeRegister";
import { RecipeRegister } from "./register/RecipeRegister";

new KegEntity();
new Keg()
new KegRecipeRegister();

new Cheese()
new FieryFonduePot();
new Quiche();
new Pizza();

new BookItem()

new UnripeCheeseComponentRegister();


new RecipeRegister();
