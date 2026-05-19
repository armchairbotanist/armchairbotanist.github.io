(function () {
  const LEVELS = [
    {
      id: "1",
      name: "Level 1",
      plants: [
        {
          commonName: "wheat",
          scientificName: "Triticum aestivum",
          targetFamilyId: "poaceae",
          acceptedNames: ["bread wheat", "common wheat"]
        },
        {
          commonName: "bean",
          scientificName: "Phaseolus vulgaris",
          targetFamilyId: "fabaceae",
          acceptedNames: ["common bean", "green bean"]
        },
        {
          commonName: "pea",
          scientificName: "Pisum sativum",
          targetFamilyId: "fabaceae",
          acceptedNames: ["garden pea"]
        },
        {
          commonName: "daffodils",
          scientificName: "Narcissus",
          targetFamilyId: "amaryllidaceae",
          acceptedNames: ["daffodil", "narcissus"]
        },
        {
          commonName: "maple",
          scientificName: "Acer",
          targetFamilyId: "sapindaceae",
          acceptedNames: ["maples"]
        },
        {
          commonName: "magnolia",
          scientificName: "Magnolia",
          targetFamilyId: "magnoliaceae",
          acceptedNames: ["magnolias"]
        },
        {
          commonName: "apple",
          scientificName: "Malus domestica",
          targetFamilyId: "rosaceae",
          acceptedNames: ["apples"]
        },
        {
          commonName: "rose",
          scientificName: "Rosa",
          targetFamilyId: "rosaceae",
          acceptedNames: ["roses"]
        },
        {
          commonName: "orange",
          scientificName: "Citrus sinensis",
          targetFamilyId: "rutaceae",
          acceptedNames: ["sweet orange", "oranges"]
        },
        {
          commonName: "lemon",
          scientificName: "Citrus limon",
          targetFamilyId: "rutaceae",
          acceptedNames: ["lemons"]
        },
        {
          commonName: "tulip",
          scientificName: "Tulipa",
          targetFamilyId: "liliaceae",
          acceptedNames: ["tulips"]
        },
        {
          commonName: "oak",
          scientificName: "Quercus",
          targetFamilyId: "fagaceae",
          acceptedNames: ["oaks"]
        },
        {
          commonName: "orchid",
          scientificName: "Orchidaceae",
          targetFamilyId: "orchidaceae",
          acceptedNames: ["orchids"]
        }
      ]
    },
    {
      id: "2",
      name: "Level 2",
      plants: [
        {
          commonName: "sunflower",
          scientificName: "Helianthus annuus",
          targetFamilyId: "asteraceae",
          acceptedNames: ["sunflowers"]
        },
        {
          commonName: "tomato",
          scientificName: "Solanum lycopersicum",
          targetFamilyId: "solanaceae",
          acceptedNames: ["tomatoes"]
        },
        {
          commonName: "potato",
          scientificName: "Solanum tuberosum",
          targetFamilyId: "solanaceae",
          acceptedNames: ["potatoes"]
        },
        {
          commonName: "cucumber",
          scientificName: "Cucumis sativus",
          targetFamilyId: "cucurbitaceae",
          acceptedNames: ["cucumbers"]
        },
        {
          commonName: "onion",
          scientificName: "Allium cepa",
          targetFamilyId: "amaryllidaceae",
          acceptedNames: ["onions"]
        },
        {
          commonName: "carrot",
          scientificName: "Daucus carota",
          targetFamilyId: "apiaceae",
          acceptedNames: ["carrots"]
        },
        {
          commonName: "penstemon",
          scientificName: "Penstemon",
          targetFamilyId: "plantaginaceae",
          acceptedNames: ["beardtongue", "beardtongues"]
        },
        {
          commonName: "banana",
          scientificName: "Musa",
          targetFamilyId: "musaceae",
          acceptedNames: ["bananas"]
        },
        {
          commonName: "pineapple",
          scientificName: "Ananas comosus",
          targetFamilyId: "bromeliaceae",
          acceptedNames: ["pineapples"]
        },
        {
          commonName: "grape",
          scientificName: "Vitis vinifera",
          targetFamilyId: "vitaceae",
          acceptedNames: ["grapes", "grapevine"]
        },
        {
          commonName: "coffee",
          scientificName: "Coffea",
          targetFamilyId: "rubiaceae",
          acceptedNames: ["coffee plant"]
        },
        {
          commonName: "mint",
          scientificName: "Mentha",
          targetFamilyId: "lamiaceae",
          acceptedNames: ["mints"]
        },
        {
          commonName: "basil",
          scientificName: "Ocimum basilicum",
          targetFamilyId: "lamiaceae",
          acceptedNames: ["sweet basil"]
        }
      ]
    },
    {
      id: "3",
      name: "Level 3",
      plants: [
        {
          commonName: "strawberry",
          scientificName: "Fragaria",
          targetFamilyId: "rosaceae",
          acceptedNames: ["strawberries"]
        },
        {
          commonName: "peach",
          scientificName: "Prunus persica",
          targetFamilyId: "rosaceae",
          acceptedNames: ["peaches"]
        },
        {
          commonName: "cherry",
          scientificName: "Prunus",
          targetFamilyId: "rosaceae",
          acceptedNames: ["cherries"]
        },
        {
          commonName: "almond",
          scientificName: "Prunus dulcis",
          targetFamilyId: "rosaceae",
          acceptedNames: ["almonds"]
        },
        {
          commonName: "walnut",
          scientificName: "Juglans",
          targetFamilyId: "juglandaceae",
          acceptedNames: ["walnuts"]
        },
        {
          commonName: "birch",
          scientificName: "Betula",
          targetFamilyId: "betulaceae",
          acceptedNames: ["birches"]
        },
        {
          commonName: "willow",
          scientificName: "Salix",
          targetFamilyId: "salicaceae",
          acceptedNames: ["willows"]
        },
        {
          commonName: "poppy",
          scientificName: "Papaver",
          targetFamilyId: "papaveraceae",
          acceptedNames: ["poppies"]
        },
        {
          commonName: "buttercup",
          scientificName: "Ranunculus",
          targetFamilyId: "ranunculaceae",
          acceptedNames: ["buttercups"]
        },
        {
          commonName: "cotton",
          scientificName: "Gossypium",
          targetFamilyId: "malvaceae",
          acceptedNames: ["cotton plant"]
        },
        {
          commonName: "cocoa",
          scientificName: "Theobroma cacao",
          targetFamilyId: "malvaceae",
          acceptedNames: ["cacao", "cacao tree"]
        },
        {
          commonName: "pumpkin",
          scientificName: "Cucurbita pepo",
          targetFamilyId: "cucurbitaceae",
          acceptedNames: ["pumpkins"]
        },
        {
          commonName: "watermelon",
          scientificName: "Citrullus lanatus",
          targetFamilyId: "cucurbitaceae",
          acceptedNames: ["watermelons"]
        }
      ]
    },
    {
      id: "4",
      name: "Level 4",
      plants: [
        {
          commonName: "avocado",
          scientificName: "Persea americana",
          targetFamilyId: "lauraceae",
          acceptedNames: ["avocados"]
        },
        {
          commonName: "cinnamon",
          scientificName: "Cinnamomum verum",
          targetFamilyId: "lauraceae",
          acceptedNames: ["true cinnamon"]
        },
        {
          commonName: "black pepper",
          scientificName: "Piper nigrum",
          targetFamilyId: "piperaceae",
          acceptedNames: ["peppercorn"]
        },
        {
          commonName: "cactus",
          scientificName: "Cactaceae",
          targetFamilyId: "cactaceae",
          acceptedNames: ["cacti"]
        },
        {
          commonName: "spinach",
          scientificName: "Spinacia oleracea",
          targetFamilyId: "amaranthaceae",
          acceptedNames: ["spinaches"]
        },
        {
          commonName: "beet",
          scientificName: "Beta vulgaris",
          targetFamilyId: "amaranthaceae",
          acceptedNames: ["beetroot", "beets"]
        },
        {
          commonName: "cabbage",
          scientificName: "Brassica oleracea",
          targetFamilyId: "brassicaceae",
          acceptedNames: ["cabbages"]
        },
        {
          commonName: "mustard",
          scientificName: "Brassica",
          targetFamilyId: "brassicaceae",
          acceptedNames: ["mustard plant"]
        },
        {
          commonName: "clover",
          scientificName: "Trifolium",
          targetFamilyId: "fabaceae",
          acceptedNames: ["clovers"]
        },
        {
          commonName: "soybean",
          scientificName: "Glycine max",
          targetFamilyId: "fabaceae",
          acceptedNames: ["soy", "soya bean"]
        },
        {
          commonName: "raspberry",
          scientificName: "Rubus idaeus",
          targetFamilyId: "rosaceae",
          acceptedNames: ["raspberries"]
        },
        {
          commonName: "tea",
          scientificName: "Camellia sinensis",
          targetFamilyId: "theaceae",
          acceptedNames: ["tea plant"]
        },
        {
          commonName: "olive",
          scientificName: "Olea europaea",
          targetFamilyId: "oleaceae",
          acceptedNames: ["olives"]
        }
      ]
    },
    {
      id: "5",
      name: "Level 5",
      plants: [
        {
          commonName: "coconut",
          scientificName: "Cocos nucifera",
          targetFamilyId: "arecaceae",
          acceptedNames: ["coconut palm"]
        },
        {
          commonName: "date palm",
          scientificName: "Phoenix dactylifera",
          targetFamilyId: "arecaceae",
          acceptedNames: ["date"]
        },
        {
          commonName: "ginger",
          scientificName: "Zingiber officinale",
          targetFamilyId: "zingiberaceae",
          acceptedNames: ["common ginger"]
        },
        {
          commonName: "turmeric",
          scientificName: "Curcuma longa",
          targetFamilyId: "zingiberaceae",
          acceptedNames: ["turmeric plant"]
        },
        {
          commonName: "iris",
          scientificName: "Iris",
          targetFamilyId: "iridaceae",
          acceptedNames: ["irises"]
        },
        {
          commonName: "asparagus",
          scientificName: "Asparagus officinalis",
          targetFamilyId: "asparagaceae",
          acceptedNames: ["garden asparagus"]
        },
        {
          commonName: "aloe",
          scientificName: "Aloe",
          targetFamilyId: "asphodelaceae",
          acceptedNames: ["aloes"]
        },
        {
          commonName: "yam",
          scientificName: "Dioscorea",
          targetFamilyId: "dioscoreaceae",
          acceptedNames: ["true yam"]
        },
        {
          commonName: "taro",
          scientificName: "Colocasia esculenta",
          targetFamilyId: "araceae",
          acceptedNames: ["cocoyam"]
        },
        {
          commonName: "water lily",
          scientificName: "Nymphaea",
          targetFamilyId: "nymphaeaceae",
          acceptedNames: ["waterlily", "water lilies"]
        },
        {
          commonName: "lotus",
          scientificName: "Nelumbo nucifera",
          targetFamilyId: "nelumbonaceae",
          acceptedNames: ["sacred lotus"]
        },
        {
          commonName: "nutmeg",
          scientificName: "Myristica fragrans",
          targetFamilyId: "myristicaceae",
          acceptedNames: ["nutmeg tree"]
        },
        {
          commonName: "vanilla",
          scientificName: "Vanilla planifolia",
          targetFamilyId: "orchidaceae",
          acceptedNames: ["vanilla orchid"]
        }
      ]
    }
  ];

  window.PLANT_GAME_LEVELS = LEVELS;
  window.PLANT_GAME_PLANTS = LEVELS.flatMap((level) =>
    level.plants.map((plant) => ({ ...plant, level: level.id }))
  );
})();
