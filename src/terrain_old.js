const terrainTypes = {
    "Badlands": {
        image: 'badlands',
        color: "#D68C48"
    },
    "Broken Lands": {
        image: 'broken_lands',
        color: "#C3AE7D"
    },
    "Dense Forest": {
        image: 'dense_forest',
        color: "#1D7248"
    },
    "Dense Evergreen Forest": {
        image: 'dense_evergreen_forest',
        color: "#1C7048"
    },
    "Dense Jungle": {
        image: 'dense_jungle',
        color: "#008411"
    },
    "Dense Mixed Forest": {
        image: 'dense_mixed_forest',
        color: "#1A6933"
    },
    "Cactus Forest": {
        image: 'desert_cactus_forest',
        color: "#708238"
    },
    "Dense Cactus Forest": {
        image: 'desert_dense_cactus_forest',
        color: "#6B8F38"
    },
    "Desert Dunes": {
        image: 'desert_dunes',
        color: "#E0C17A"
    },
    "Sandy Desert": {
        image: 'desert_sandy',
        color: "#F9D78C"
    },
    "Foothills": {
        image: 'foothills',
        color: "#C34E21"
    },
    "Forested Evergreen Mountain": {
        image: 'forested_evergreen_mountain',
        color: "#2B7D50"
    },
    "Forested Mountain": {
        image: 'forested_mountain',
        color: "#295B33"
    },
    "Forested Mountains": {
        image: 'forested_mountains',
        color: "#6F9733"
    },
    "Grassy Hills": {
        image: 'grassy_hills',
        color: "#AA5431"
    },
    "Hills": {
        image: 'hills',
        color: "#AA4C00"
    },
    "Jungle Mountain": {
        image: 'jungle_mountain',
        color: "#005400"
    },
    "Jungle Mountains": {
        image: 'jungle_mountains',
        color: "#329659"
    },
    "Light Evergreen Forest": {
        image: 'light_evergreen_forest',
        color: "#3B9849"
    },
    "Light Forest": {
        image: 'light_forest',
        color: "#007000"
    },
    "Light Jungle": {
        image: 'light_jungle',
        color: "#00A011"
    },
    "Light Mixed Forest": {
        image: 'light_mixed_forest',
        color: "#347D63"
    },
    "Mangrove Forest": {
        image: 'mangrove_forest',
        color: "#3E8F65"
    },
    "Mixed Forested Mountain": {
        image: 'mixed_forested_mountain',
        color: "#3B8E5E"
    },
    "Mixed Forested Mountains": {
        image: 'mixed_forested_mountains',
        color: "#808080"
    },
    "Mountain": {
        image: 'mountain',
        color: "#737373"
    },
    "Mountains": {
        image: 'mountains',
        color: "#83B546"
    },
    "Plains": {
        image: 'plains',
        color: "#64B25A"
    },
    "Sparse Evergreen Forest": {
        image: 'sparse_evergreen_forest',
        color: "#6CB262"
    },
    "Sparse Forest": {
        image: 'sparse_forest',
        color: "#008000"
    },
    "Sparse Jungle": {
        image: 'sparse_jungle',
        color: "#34974E"
    },
    "Swamp": {
        image: 'swamp',
        color: "#3E8F77"
    },
    "Active Volcano": {
        image: 'volcano_active',
        color: "#8F8F8F"
    },
    "Dormant Volcano": {
        image: 'volcano_dormant',
        color: "#8F8F8F"
    },
    "Water": {
        image: 'water',
        color: "#0011FF"
    },
    "Blank": {
        image: 'blank',
        color: "#FFFFFF"
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