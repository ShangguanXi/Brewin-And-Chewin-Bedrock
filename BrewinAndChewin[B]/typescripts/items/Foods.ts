import { ItemStopUseAfterEvent, world } from "@minecraft/server";
import { EventAPI } from "../lib/EventAPI";
import { EffectsMap } from "../data/EffectsMap";

const effectsMap = new EffectsMap

export class Foods {
  @EventAPI.register(world.afterEvents.itemStopUse)
  food(args: ItemStopUseAfterEvent) {
    const itemStack = args.itemStack;
    if (!itemStack) return
    const player = args.source
    const useDuration = args.useDuration
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