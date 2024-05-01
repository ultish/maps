# maps
This repo tests Leaflet, Openlayers, and maybe D3 for rendering geojson. How does it render these polygons when it crosses the antimeridian boundary (180degrees)? How does it render geojson when you scroll around the world? What if you're clipping half way across the antimeridian?

## D3
### No GeoJson parsing
<img width="1310" alt="image" src="https://github.com/ultish/maps/assets/3677031/003c69af-6ea5-494a-8495-c7c9ab9718d7">

<img width="942" alt="image" src="https://github.com/ultish/maps/assets/3677031/d4a900a3-dfe6-461e-9f68-1602857c1ab0">
D3 doesn't need any parsing :) 

Border overlaps when using geojson (thicker lines on neighbouring borders)
<img width="995" alt="image" src="https://github.com/ultish/maps/assets/3677031/5e2805d5-6d6f-4183-8f48-b7abeffd159c">
Convert to topojson, mesh, then back to geojson and it disappears. Mesh function removes overlapping lines
<img width="901" alt="image" src="https://github.com/ultish/maps/assets/3677031/f55fb10e-3e32-4c93-952d-c2fc027fec82">



## Openlayer
### No GeoJson parsing
<img width="1390" alt="image" src="https://github.com/ultish/maps/assets/3677031/98ff2063-3d4a-408d-b6da-a333d5a921a5">


### GeoJson Antimeridian Cutting 
Cutting along antimeridian, leaves veritcal lines on 180degrees due to cutting
<img width="1353" alt="image" src="https://github.com/ultish/maps/assets/3677031/781e7977-853d-4e81-bf89-4ed779b41619">
Scroll to right and polys duplicate correctly
<img width="1355" alt="image" src="https://github.com/ultish/maps/assets/3677031/40765fae-3d83-469a-aeb4-e0dc83223cb5">

#### custom geojson shifting instead of cutting
<img width="1345" alt="image" src="https://github.com/ultish/maps/assets/3677031/f6653f79-4f24-497d-8ff4-364c6ab98bb3">
Red Cross isn't displayed, ol thinks its not within current extent?
<img width="1349" alt="image" src="https://github.com/ultish/maps/assets/3677031/a8fd4db4-3e90-4aa7-b876-aad3df9328fd">
Scroll to right and polys duplicate correctly



## Leaflet
### No GeoJson parsing
<img width="1391" alt="image" src="https://github.com/ultish/maps/assets/3677031/755bb879-2e4a-44d3-b021-ecb89788d4ce">

### GeoJson Antimeridian Cutting 
Looks a bit odd due to lack of duplication, scrolling left or right into next world view will copy them but you only ever see 1 copy at a time
<img width="1356" alt="image" src="https://github.com/ultish/maps/assets/3677031/e2660bb8-2702-48a6-925f-a2d29f49d61b">
#### custom geojson shifting instead of cutting
everything fits on the one world view except for a bit of russia you see floating on top left corner
<img width="1353" alt="image" src="https://github.com/ultish/maps/assets/3677031/5c0241e4-9e4b-4a30-9c10-d922eb39382c">

# Chart.js
Chart rendering using canvas instead of SVG for performance, and chart.js looks nice out of the box
<img width="653" alt="image" src="https://github.com/ultish/maps/assets/3677031/59bcb547-f566-4af2-b7b7-a7af57b47ab1">

