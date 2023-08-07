const terrainTypes = {
    badlands: {
        image: 'badlands',
        color: '#D68C48',
        types: '',
    },
    blank: {
        image: 'blank',
        color: '#FFFFFF',
        types: '',
    },
    broken_lands: {
        image: 'broken_lands',
        color: '#C3AE7D',
        types: '',
    },
    dense_evergreen_forest: {
        image: 'dense_evergreen_forest',
        color: '#1C7048',
        types: '',
    },
    dense_forest: {
        image: 'dense_forest',
        color: '#1A6933',
        types: '',
    },
    dense_jungle: {
        image: 'dense_jungle',
        color: '#006400',
        types: '',
    },
    dense_mixed_forest: {
        image: 'dense_mixed_forest',
        color: '#007000',
        types: '',
    },
    desert_cactus_forest: {
        image: 'desert_cactus_forest',
        color: '#708238',
        types: '',
    },
    desert_dense_cactus_forest: {
        image: 'desert_dense_cactus_forest',
        color: '#6B8F38',
        types: '',
    },
    desert_dunes: {
        image: 'desert_dunes',
        color: '#E0C17A',
        types: '',
    },
    desert_sandy: {
        image: 'desert_sandy',
        color: '#F9D78C',
        types: '',
    },
    fen: {
        image: 'fen',
        color: '#1DC989',
        types: '',
    },
    foothills: {
        image: 'foothills',
        color: '#A34E21',
        types: '',
    },
    forested_evergreen_hills: {
        image: 'forested_evergreen_hills',
        color: '#007000',
        types: '',
    },
    forested_evergreen_mountain: {
        image: 'forested_evergreen_mountain',
        color: '#004C00',
        types: '',
    },
    forested_evergreen_mountains: {
        image: 'forested_evergreen_mountains',
        color: '#296D50',
        types: '',
    },
    forested_hills: {
        image: 'forested_hills',
        color: '#004C00',
        types: '',
    },
    forested_mountain: {
        image: 'forested_mountain',
        color: '#295B33',
        types: '',
    },
    forested_mountains: {
        image: 'forested_mountains',
        color: '#556B2F',
        types: '',
    },
    grassy_hills: {
        image: 'grassy_hills',
        color: '#AA5431',
        types: '',
    },
    hills: {
        image: 'hills',
        color: '#8B4513',
        types: '',
    },
    jungle_hills: {
        image: 'jungle_hills',
        color: '#007000',
        types: '',
    },
    jungle_mountain: {
        image: 'jungle_mountain',
        color: '#005400',
        types: '',
    },
    jungle_mountains: {
        image: 'jungle_mountains',
        color: '#329659',
        types: '',
    },
    light_evergreen_forest: {
        image: 'light_evergreen_forest',
        color: '#3B9849',
        types: '',
    },
    light_forest: {
        image: 'light_forest',
        color: '#006400',
        types: '',
    },
    light_jungle: {
        image: 'light_jungle',
        color: '#006400',
        types: '',
    },
    light_mixed_forest: {
        image: 'light_mixed_forest',
        color: '#007000',
        types: '',
    },
    marsh: {
        image: 'marsh',
        color: '#1DC9A9',
        types: '',
    },
    mixed_forested_hills: {
        image: 'mixed_forested_hills',
        color: '#005E3E',
        types: '',
    },
    mixed_forested_mountain: {
        image: 'mixed_forested_mountain',
        color: '#004C00',
        types: '',
    },
    mixed_forested_mountains: {
        image: 'mixed_forested_mountains',
        color: '#005E3E',
        types: '',
    },
    mountain: {
        image: 'mountain',
        color: '#808080',
        types: '',
    },
    mountains: {
        image: 'mountains',
        color: '#6F7D7D',
        types: '',
    },
    plains: {
        image: 'plains',
        color: '#228B22',
        types: '',
    },
    sparse_evergreen_forest: {
        image: 'sparse_evergreen_forest',
        color: '#006400',
        types: '',
    },
    sparse_forest: {
        image: 'sparse_forest',
        color: '#006400',
        types: '',
    },
    sparse_jungle: {
        image: 'sparse_jungle',
        color: '#006400',
        types: '',
    },
    swamp: {
        image: 'swamp',
        color: '#2EBB57',
        types: '',
    },
    volcano_active: {
        image: 'volcano_active',
        color: '#FF4500',
        types: '',
    },
    volcano_dormant: {
        image: 'volcano_dormant',
        color: '#8F8F8F',
        types: '',
    },
    water: {
        image: 'water',
        color: '#0000FF',
        types: '',
    },
};
// Check if running in a browser environment
if (typeof window !== 'undefined') {
    // Browser environment, define terrainTypes as a global variable
    window.terrainTypes = terrainTypes;
} else {
    // Node.js environment, export terrainTypes using module.exports
    module.exports = terrainTypes;
}