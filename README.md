# EVE ESI Data

Provides JSON files for some static data from [ESI](https://esi.evetech.net/).

Available data:
- **Regions** with ID, name, description and constellation IDs.
- **Constellations** with ID, name, region ID, system IDs and position (x, y, z).
- **Systems** with ID, name, constellation ID, star ID, station IDs, security class and status, 
  stargate IDs, position (x, y, z) and planets (with ID, moon and belt IDs).
- **Stargates** with ID, name, system ID, type ID, destination (stargate and system IDs) 
  and position (x, y, z).

## Regenerate Data

Delete existing JSON files in `json/` (keep directories).

1. Fetch regions:  
  `node src/01-fetch-regions.js`

2. Fetch constellations, systems and stargates (it processes one region after the other, 
  repeat it until it ends without an error):  
  `node src/02-fetch-constellations-systems-stargates.js`

## Copyright Notice

This project is licensed under the [MIT license](LICENSE).

The ESI data is subject to the
[EVE Developers License Agreement](https://developers.eveonline.com/resource/license-agreement)

"EVE", "EVE Online", "CCP" and all related logos and images are trademarks or registered trademarks of 
[CCP hf](https://www.ccpgames.com/). 
