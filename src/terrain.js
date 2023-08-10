const VALID_TERRAIN_TYPES = [
    "blank",
    "desolate",
    "grasslands",
    "hills",
    "mountains",
    "wetlands",
    "forest",
    "desert",
    "jungle",
    "water"
];

const TERRAIN_TYPES = {
    badlands: {
        name: "Badlands",
        image: 'badlands',
        color: '#D68C48',
        types: ["desolate","hills"],
    },
    blank: {
        name: "Blank",
        image: 'blank',
        color: '#FFFFFF',
        types: ['blank'],
    },
    broken_lands: {
        name: "Broken Lands",
        image: 'broken_lands',
        color: '#C3AE7D',
        types: ['desolate'],
    },
    dense_evergreen_forest: {
        name: "Dense Evergreen Forest",
        image: 'dense_evergreen_forest',
        color: '#1C7048',
        types: ['forest'],
    },
    dense_forest: {
        name: "Dense Forest",
        image: 'dense_forest',
        color: '#1A6933',
        types: ['forest'],
    },
    dense_jungle: {
        name: "Dense Jungle",
        image: 'dense_jungle',
        color: '#006400',
        types: ['forest'],
    },
    dense_mixed_forest: {
        name: "Dense Mixed Forest",
        image: 'dense_mixed_forest',
        color: '#007000',
        types: ['forest'],
    },
    desert_cactus_forest: {
        name: "Desert Cactus Forest",
        image: 'desert_cactus_forest',
        color: '#C9B57C',
        types: ['forest','desert'],
    },
    desert_dense_cactus_forest: {
        name: "Dense Desert Cactus Forest",
        image: 'desert_dense_cactus_forest',
        color: '#A0A258',
        types: ['forest','desert'],
    },
    desert_dunes: {
        name: "Desert Dunes",
        image: 'desert_dunes',
        color: '#E0C17A',
        types: ['desert','hills'],
    },
    desert_sandy: {
        name: "Trackless Desert",
        image: 'desert_sandy',
        color: '#F9D78C',
        types: ['desert'],
    },
    fen: {
        name: "Fens",
        image: 'fen',
        color: '#1DC989',
        types: ['wetland','grassland'],
    },
    foothills: {
        name: "Foothills",
        image: 'foothills',
        color: '#A34E21',
        types: ['hills','mountains'],
    },
    forested_evergreen_hills: {
        name: "Forested Evergreen Hills",
        image: 'forested_evergreen_hills',
        color: '#007000',
        types: ['forest','hills'],
    },
    forested_evergreen_mountain: {
        name: "Forested Evergreen Mountain",
        image: 'forested_evergreen_mountain',
        color: '#004C00',
        types: ['forest','mountain'],
    },
    forested_evergreen_mountains: {
        name: "Forested Evergreen Mountains",
        image: 'forested_evergreen_mountains',
        color: '#296D50',
        types: ['forest','mountain'],
    },
    forested_hills: {
        name: "Forested Hills",
        image: 'forested_hills',
        color: '#004C00',
        types: ['forest','hills'],
    },
    forested_mountain: {
        name: "Forested Mountain",
        image: 'forested_mountain',
        color: '#295B33',
        types: ['forest','mountain'],
    },
    forested_mountains: {
        name: "Forested Mountains",
        image: 'forested_mountains',
        color: '#556B2F',
        types: ['forest','mountain'],
    },
    grassy_hills: {
        name: "Grassy Hills",
        image: 'grassy_hills',
        color: '#AA5431',
        types: ['grassland','hills'],
    },
    hills: {
        name: "Hills",
        image: 'hills',
        color: '#8B4513',
        types: ['hills'],
    },
    jungle_hills: {
        name: "Jungle Hills",
        image: 'jungle_hills',
        color: '#007000',
        types: ['forest','hills','jungle'],
    },
    jungle_mountain: {
        name: "Jungle Mountain",
        image: 'jungle_mountain',
        color: '#005400',
        types: ['forest','mountains','jungle'],
    },
    jungle_mountains: {
        name: "Jungle Mountains",
        image: 'jungle_mountains',
        color: '#329659',
        types: ['forest','mountain','jungle'],
    },
    light_evergreen_forest: {
        name: "Light Evergreen Forest",
        image: 'light_evergreen_forest',
        color: '#3B9849',
        types: ['forest'],
    },
    light_forest: {
        name: "Light Forest",
        image: 'light_forest',
        color: '#006400',
        types: ['forest'],
    },
    light_jungle: {
        name: "Light Jungle",
        image: 'light_jungle',
        color: '#006400',
        types: ['forest','jungle'],
    },
    light_mixed_forest: {
        name: "Light Mixed Forest",
        image: 'light_mixed_forest',
        color: '#007000',
        types: ['forest'],
    },
    marsh: {
        name: "Marsh",
        image: 'marsh',
        color: '#1DC9A9',
        types: ['wetland'],
    },
    mixed_forested_hills: {
        name: "Mixed Forested Hills",
        image: 'mixed_forested_hills',
        color: '#005E3E',
        types: ['forest','hills'],
    },
    mixed_forested_mountain: {
        name: "Mixed Forested Mountain",
        image: 'mixed_forested_mountain',
        color: '#004C00',
        types: ['forest','mountains'],
    },
    mixed_forested_mountains: {
        name: "Mixed Forested Mountains",
        image: 'mixed_forested_mountains',
        color: '#005E3E',
        types: ['forest','mountains'],
    },
    mountain: {
        name: "Mountain",
        image: 'mountain',
        color: '#808080',
        types: ['mountains'],
    },
    mountains: {
        name: "Mountain",
        image: 'mountains',
        color: '#6F7D7D',
        types: ['mountains'],
    },
    plains: {
        name: "Grassy Plains",
        image: 'plains',
        color: '#228B22',
        types: ['grassland'],
    },
    sparse_evergreen_forest: {
        name: "Sparse Evergreen Forest",
        image: 'sparse_evergreen_forest',
        color: '#006400',
        types: ['forest','grasslands'],
    },
    sparse_forest: {
        name: "Sparse Forest",
        image: 'sparse_forest',
        color: '#006400',
        types: ['forest','grasslands'],
    },
    sparse_jungle: {
        name: "Sparse Jungle",
        image: 'sparse_jungle',
        color: '#006400',
        types: ['forest','grasslands','jungle'],
    },
    swamp: {
        name: "Swamp",
        image: 'swamp',
        color: '#2EBB57',
        types: ['forest','wetland'],
    },
    volcano_active: {
        name: "Active Volcano",
        image: 'volcano_active',
        color: '#FF4500',
        types: ['mountains','volcano'],
    },
    volcano_dormant: {
        name: "Dormant Volcano",
        image: 'volcano_dormant',
        color: '#8F8F8F',
        types: ['mountains','volcano'],
    },
    water: {
        name: "Water",
        image: 'water',
        color: '#0000FF',
        types: ['water'],
    },
};
// Check if running in a browser environment
if (typeof window !== 'undefined') {
    // Browser environment, define terrainTypes as a global variable
    window.TERRAIN_TYPES = TERRAIN_TYPES;
    window.VALID_TERRAIN_TYPES = VALID_TERRAIN_TYPES;
} else {
    // Node.js environment, export terrainTypes using module.exports
    module.exports = {TERRAIN_TYPES, VALID_TERRAIN_TYPES};
}