export class EffectsMap {
    public alcoholicEffectsMap: Map<string, { effect: string; duration: number; amplifier: number }[]> = new Map([
        ["brewinandchewin:egg_grog", [{ effect: "absorption", duration: 30 * 20, amplifier: 0 }]],
        ["brewinandchewin:strongroot_ale", [{ effect: "resistance", duration: 30 * 20, amplifier: 0 }]],
        ["brewinandchewin:salty_folly", [{ effect: "water_breathing", duration: 30 * 20, amplifier: 0 }]],
        ["brewinandchewin:steel_toe_stout", [{ effect: "resistance", duration: 60 * 20, amplifier: 0 }]],
        ["brewinandchewin:glittering_grenadine", [{ effect: "night_vision", duration: 60 * 20, amplifier: 0 }]],
        ["brewinandchewin:withering_dross", [
            { effect: "weakness", duration: 60 * 20, amplifier: 0 },
            { effect: "blindness", duration: 150 * 20, amplifier: 0 },
            { effect: "slowness", duration: 150 * 20, amplifier: 0 },
            { effect: "wither", duration: 60 * 20, amplifier: 0 }
        ]],
        ["brewinandchewin:dread_nog", [
            { effect: "bad_omen", duration: 60 * 60 * 20, amplifier: 0 },
            { effect: "wither", duration: 60 * 20, amplifier: 0 }
        ]],
        ["brewinandchewin:kombucha", [{ effect: "haste", duration: 60 * 20, amplifier: 1 }]],
        ["brewinandchewin:cocoa_fudge", [{ effect: "speed", duration: 40 * 20, amplifier: 1 }]]
    ]);
}