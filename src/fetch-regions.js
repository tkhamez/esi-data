'use strict';

const fetch = require('node-fetch');
const fs = require('fs');

const basePath = 'https://esi.evetech.net/latest/';

async function fetchRegionIds() {
    const response = await fetch(basePath + 'universe/regions');
    return await response.json();
}

async function fetchRegion(regionId) {
    const response = await fetch(basePath + 'universe/regions/' + regionId);
    return await response.json();
}

const regions = [];

async function fetchData() {
    const regionIds = await fetchRegionIds();

    for (let regionId of regionIds) {
        const region = await fetchRegion(regionId);
        regions.push({
            id: region.region_id,
            name: region.name,
            constellations: region.constellations
        });
        console.log('Region ' + region.name);

        //break;
    } // /for regionIds
}

fetchData().then(function() {
    fs.writeFile("json/universe/regions/regions.json", JSON.stringify(regions), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Wrote json/universe/regions/regions.json");
        }
    });
});
