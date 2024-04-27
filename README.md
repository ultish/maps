# maps
This repo tests Leaflet, Openlayers, and maybe D3 for rendering geojson. How does it render these polygons when it crosses the antimeridian boundary (180degrees)? How does it render geojson when you scroll around the world? What if you're clipping half way across the antimeridian?

## Openlayer
### No GeoJson parsing
<img width="1390" alt="image" src="https://github.com/ultish/maps/assets/3677031/98ff2063-3d4a-408d-b6da-a333d5a921a5">


### GeoJson parsing
When your view splits the polygon in half. Russia is rendered correctly, diamond is rendered correctly
<img width="1395" alt="image" src="https://github.com/ultish/maps/assets/3677031/b35622b8-c657-46dd-b7c2-f2ef39b57f67">
When your view has the full polygon visible. Russia is rendered correctly, diamond is rendered correctly
<img width="1391" alt="image" src="https://github.com/ultish/maps/assets/3677031/5d2f9160-7c33-4036-a7ae-3ecbc5b3c447">

Openlayer automatically duplicates the polygons over the antimeridian boundary
<img width="1393" alt="image" src="https://github.com/ultish/maps/assets/3677031/ecd2b481-89dc-4a30-8000-8df62495ddb5">
<img width="1393" alt="image" src="https://github.com/ultish/maps/assets/3677031/3e3bbb52-62af-4f18-8d58-2e015b117e32">
X renders perfectly across the border
<img width="1388" alt="image" src="https://github.com/ultish/maps/assets/3677031/8cd56658-33bf-415d-81e2-d76e06908b69">


## Leaflet
### No GeoJson parsing
<img width="1391" alt="image" src="https://github.com/ultish/maps/assets/3677031/755bb879-2e4a-44d3-b021-ecb89788d4ce">

### GeoJson parsing
Still a small bug in rendering Russia with the small island on the left side but not on the right
<img width="1389" alt="image" src="https://github.com/ultish/maps/assets/3677031/e449214b-8a82-4959-99f1-7688997167ed">

Leaflet won't duplicate the polygons, ie you should see the right-part of the diamond on the left side of the map
<img width="1393" alt="image" src="https://github.com/ultish/maps/assets/3677031/ede191d9-54d3-4301-be9b-da4f74cd4c43">
One copy per "world". Enabling `worldCopyJump:true` will copy the polygons once you scroll to the next world view but it can look odd like this where Russia and the diamond aren't shown on the left.
<img width="1391" alt="image" src="https://github.com/ultish/maps/assets/3677031/bde4f20b-3ea3-420c-835d-70758d9a851a">
Because of no real copy, the X doesn't render correctly with the parsing
<img width="1385" alt="image" src="https://github.com/ultish/maps/assets/3677031/d3a05809-34f9-4a77-8670-a710166084a9">


# Chart.js
Chart rendering using canvas instead of SVG for performance, and chart.js looks nice out of the box
<img width="653" alt="image" src="https://github.com/ultish/maps/assets/3677031/59bcb547-f566-4af2-b7b7-a7af57b47ab1">

