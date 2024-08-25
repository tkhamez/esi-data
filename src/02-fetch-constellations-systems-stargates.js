/**
 * Fetches constellations, systems and stargates
 */

'use strict';

const fetch = require('node-fetch');
const fs = require('fs');

const basePath = 'https://esi.evetech.net/latest/';

async function fetchConstellation(constellationId) {
    const response = await fetch(basePath + 'universe/constellations/' + constellationId);
    return await response.json();
}

async function fetchSystem(systemId) {
    const response = await fetch(basePath + 'universe/systems/' + systemId);
    return await response.json();
}

async function fetchStargate(stargateId) {
    const response = await fetch(basePath + 'universe/stargates/' + stargateId);
    return await response.json();
}

/**
 * @param {object} region
 * @returns {Promise}
 */
async function fetchData(region) {
    const constellations = [];
    const systems = [];
    const stargates = [];

    for (let constellationId of region.constellations) {
        const constellation = await fetchConstellation(constellationId);
        constellations.push({
            id: constellation.constellation_id,
            name: constellation.name,
            regionId: constellation.region_id,
            systems: constellation.systems, // list of integers
            position: { x: constellation.position.x, y: constellation.position.y, z: constellation.position.z }
        });
        console.log('  Constellation ' + constellation.name);

        for (let systemId of constellation.systems) {
            const system = await fetchSystem(systemId);
            const planets = [];
            if (system.planets) {
                for (let planet of system.planets) {
                    planets.push({
                        planetId: planet.planet_id,
                        moons: planet.moons, // list of integers
                        asteroidBelts: planet.asteroid_belts // list of integers
                    });
                }
            }
            systems.push({
                id: system.system_id,
                name: system.name,
                constellationId: system.constellation_id,
                starId: system.star_id,
                planets: planets,
                stations: system.stations, // list of integers
                securityClass: system.security_class,
                securityStatus: system.security_status,
                stargates: system.stargates, // list of integers
                position: { x: system.position.x, y: system.position.y, z: system.position.z }
            });
            console.log('    System ' + system.name);

            if (! Array.isArray(system.stargates)) {
                continue;
            }
            for (let stargateId of system.stargates) {
                const stargate = await fetchStargate(stargateId);
                stargates.push({
                    id: stargate.stargate_id,
                    name: stargate.name,
                    systemId: stargate.system_id,
                    typeId: stargate.type_id,
                    destination: {
                        stargateId: stargate.destination.stargate_id,
                        systemId: stargate.destination.system_id
                    },
                    position: { x: stargate.position.x, y: stargate.position.y, z: stargate.position.z }
                });
                console.log('      ' + stargate.name);

                //break;
            } // /for stargates

            //break;
        } // /for systems

        //break;
    } // /for constellations

    return {
        constellations: constellations,
        systems: systems,
        stargates: stargates
    };
}

/**
 * @param {object} region
 * @param {object} data
 */
function writeFiles(region, data) {
    const constFile = "json/universe/constellations/" + region.name + "-constellations.json";
    fs.writeFileSync(constFile, JSON.stringify(data.constellations));
    console.log("Wrote " + constFile);

    const systemFile = "json/universe/systems/" + region.name + "-systems.json";
    fs.writeFileSync(systemFile, JSON.stringify(data.systems));
    console.log("Wrote " + systemFile);

    const gatesFile = "json/universe/stargates/" + region.name + "-stargates.json";
    fs.writeFileSync(gatesFile, JSON.stringify(data.stargates));
    console.log("Wrote " + gatesFile);
}

async function run(regionsData) {
    const regions = JSON.parse(regionsData);

    for (let region of regions) {
        if (fs.existsSync("json/universe/systems/" + region.name + "-systems.json")) {
            continue;
        }

        console.log('Region ' + region.name);
        const data = await fetchData(region);
        writeFiles(region, data);

        //break;
    }
}

fs.readFile("json/universe/regions/regions.json", "utf8", function read(err, data) {
    if (err) {
        return console.log(err);
    }
    run(data).then(() => { console.log('All done.'); });
});
