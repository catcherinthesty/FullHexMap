/* This file contains examples of special terrain. It is not intended to be called or used by any other software.
Special terrain images should be prependeded with SP_ - e.g. if plains are a special terrain, it should be SP_plains */
const SPECIAL_TERRAIN = {
    arid_canyon:
{ // Example of a special terrain.
        name: "Arid Canyon",
        image: 'SP_canyon',
        color: '#AA6C00',
        types: ['mountains','desert'],
        description: "A canyon, carving a deep, rocky expanse accross the desert.",
},
    verdant_canyon:
{ // Example of a special terrain using the same icon as another special terrain.
    // This should be done sparingly, if ever, as with the     //
    // colors disabled these icons will be indistinguishable   //
    // visually. Even the colors may not be sufficient with    //
    // people who suffer from (or enjoy) any form of color     //
    // blindness.                                              //
        name: "Verdant Canyon",
        image: 'SP_canyon',
        color: '#8ADC5C',
        types: ['mountains','forest','grassland'],
        description: "A canyon, carving a deep, lush expanse accross the verdant highlands.",
},
    stonehenge:
{ // A stonehenge. //
        name: "Stone Henge",
        image: 'SP_henge',
        color: '#8ADC57',
        types: ['grassland'],
        description: "An ancient cirlce of horizontally capped standing stones, forming an excellent henge indeed. Its origin, construction and purpose remain a mystery.",
},
    broken_lands:
{
        name: "Broken Lands",
        image: 'SP_broken_lands',
        color: '#C3AE7D',
        types: ['desolate'],
        description: "Landscape scattered with irregular fragmented formations of stone and sun baked clay.",
},
    volcano_active: {
        name: "Active Volcano",
        image: 'SP_volcano_active',
        color: '#CF1000',
        types: ['mountains','volcano'],
        description: "A previously active caldera, now but a stony bowl atop a once-terrifying titanic volcano.",
    },
    hot_springs: {
        name: "Hot Springs",,
        image: 'SP_hot_springs',
        color: '#AAAACC',
        types: ['mountains','wetland'],
        description: "A mountain with secluded geothermal springs.",
    }
},
if (typeof window !== 'undefined') {
    // Browser environment, define terrainTypes as a global variable
    window.TERRAIN_TYPES = TERRAIN_TYPES;
    window.VALID_TERRAIN_TYPES = VALID_TERRAIN_TYPES;
} else {
    // Node.js environment, export terrainTypes using module.exports
    module.exports = SPECIAL_TERRAIN;
}