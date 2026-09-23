export const cookingPotRecipes = [
    {
        "identifer": "brewinandchewin:apple_jelly",
        "tags": ["cooking_pot"],
        "type": 'farmersdelight:cooking',
        "container": { "item": 'minecraft:glass_bottle' },
        "time": 100,
        "priority": 0,
        "experience": 0.35,
        "ingredients": [
            {
                "item": "minecraft:apple"
            },
            {
                "item": "minecraft:apple"
            },
            {
                "item": "minecraft:apple"
            },
            {
                "item": "minecraft:sugar"
            }
        ],
        "recipe_book_tab": 'misc',
        "result": {
            "count": 1,
            "item": 'brewinandchewin:apple_jelly'
        }
    },
    {
        "identifer": "brewinandchewin:cheesy_pasta",
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:bowl"
        },
        "time": 100,
        "priority": 0,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "brewinandchewin:flaxen_cheese_wedge"
            },
            {
                "tag": "farmersdelight:is_pasta"
            },
            {
                "tag": "farmersdelight:is_tomato"
            },
            [
                {"tag": "farmersdelight:is_raw_fish"},
                { "item": "minecraft:salmon" },
                { "item": "minecraft:cod" }
            ]
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 1,
            "item": "brewinandchewin:cheesy_pasta"
        }
    },
    {
        "identifer": "brewinandchewin:creamy_onion_soup",
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:bowl"
        },
        "time": 100,
        "priority": 0,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "brewinandchewin:cheese_wedges"
            },
            {
                "tag": "farmersdelight:is_onion"
            },
            {
                "tag": "farmersdelight:cabbage_roll_ingredients"
            },
            {
                "item": "minecraft:bread"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "brewinandchewin:creamy_onion_soup"
        }
    },
    {
        "identifer": "brewinandchewin:fiery_fondue_pot",
        "type": "farmersdelight:cooking",
        "container": {
            "count": 1,
            "item": "minecraft:cauldron"
        },
        "time": 100,
        "priority": 0,
        "cookingtime": 400,
        "experience": 2.0,
        "ingredients": [
            {
                "item": "farmersdelight:tomato_sauce"
            },
            {
                "item": "minecraft:potato"
            },
            {
                "item": "farmersdelight:milk_bottle"
            },
            {
                "item": "brewinandchewin:scarlet_cheese_wheel"
            },
            {
                "item": "farmersdelight:ham"
            },
            {
                "item": "minecraft:bread"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 1,
            "item": "brewinandchewin:fiery_fondue_pot"
        }
    },
    {
        "identifer": "brewinandchewin:glow_berry_marmalade",
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:glass_bottle"
        },
        "time": 100,
        "priority": 0,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "minecraft:glow_berries"
            },
            {
                "item": "minecraft:glow_berries"
            },
            {
                "item": "minecraft:glow_berries"
            },
            {
                "item": "minecraft:sugar"
            }
        ],
        "recipe_book_tab": "misc",
        "result": {
            "count": 1,
            "item": "brewinandchewin:glow_berry_marmalade"
        }
    },
    {
        "identifer": "brewinandchewin:horror_lasagna",
        "type": "farmersdelight:cooking",
        "time": 100,
        "priority": 0,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "brewinandchewin:scarlet_cheese_wedge"
            },
            {
                "item": "minecraft:beetroot"
            },
            {
                "item": "farmersdelight:tomato_sauce"
            },
            {
                "tag": "farmersdelight:is_pasta"
            },
            {
                "tag": "brewinandchewin:cheese_wedges"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 1,
            "item": "brewinandchewin:horror_lasagna"
        }
    },
    {
        "identifer": "brewinandchewin:scarlet_pierogies",
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:bowl"
        },
        "time": 100,
        "priority": 0,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "brewinandchewin:scarlet_cheese_wedge"
            },
            {
                "item": "minecraft:potato"
            },
            {
                "tag": "farmersdelight:is_dough"
            },
            {
                "item": "minecraft:nether_wart"
            },
            {
                "tag": "farmersdelight:is_cabbage"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "brewinandchewin:scarlet_pierogies"
        }
    },
    {
        "identifer": "brewinandchewin:sweet_berry_jam",
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:glass_bottle"
        },
        "time": 100,
        "priority": 0,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "minecraft:sweet_berries"
            },
            {
                "item": "minecraft:sweet_berries"
            },
            {
                "item": "minecraft:sweet_berries"
            },
            {
                "item": "minecraft:sugar"
            }
        ],
        "recipe_book_tab": "misc",
        "result": {
            "count": 1,
            "item": "brewinandchewin:sweet_berry_jam"
        }
    },
    {
        "identifer": "brewinandchewin:vegetable_omelet",
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:bowl"
        },
        "time": 100,
        "priority": 0,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "brewinandchewin:cheese_wedges"
            },
            {
                "tag": "minecraft:egg"
            },
            {
                "tag": "minecraft:egg"
            },
            {
                "tag": "farmersdelight:is_onion"
            },
            {
                "item": "minecraft:carrot"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 1,
            "item": "brewinandchewin:vegetable_omelet"
        }
    }

]