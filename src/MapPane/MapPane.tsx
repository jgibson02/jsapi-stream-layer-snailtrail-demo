import * as React from 'react';

import EsriLoaderReact from 'esri-loader-react';

const urls = {
  jsAPI: 'https://js.arcgis.com/4.13/',
  buses:
    'https://us-iotdev.arcgis.com/a4iotdemo/um0sork7qoxq4nx5/streams/arcgis/rest/services/Charlotte_Buses_AllBuses_OneRogue/StreamServer',
  routes:
    'https://gis.charlottenc.gov/arcgis/rest/services/CATS/CATSMasterService/MapServer/1',
  stops:
    'https://gis.charlottenc.gov/arcgis/rest/services/CATS/CATSMasterService/MapServer/0'
};

class MapPane extends React.Component {
  render() {
    const options = {
      url: urls.jsAPI
    };

    function getBusesRenderer() {
      return {
        type: 'simple',
        verticalOffset: {
          screenLength: 15
        },
        symbol: {
          type: 'point-3d',
          symbolLayers: [
            {
              type: 'object', // autocasts as new ObjectSymbol3DLayer()
              width: 30, // diameter of the object from east to west in meters
              height: 30, // height of object in meters
              depth: 30, // diameter of the object from north to south in meters
              resource: { primitive: 'sphere' },
              material: { color: '#1ad6c3' }
            }
          ]
        }
      };
    }

    function getRoutesRenderer() {
      const options = {
        profile: 'quad',
        cap: 'round',
        join: 'miter',
        width: 15,
        height: 2,
        color: [200, 200, 200],
        profileRotation: 'all'
      };

      /* The colors used for the each transit line */
      const routeColors = {
        Local: [255, 0, 16],
        'Village Rider': [0, 170, 227],
        Express: [248, 150, 29],
        'Neighborhood Shuttle': [0, 166, 63],
        F1: [189, 239, 133],
        F2: [189, 239, 133]
      };

      const renderer = {
        type: 'unique-value',
        field: 'Route_Type',
        uniqueValueInfos: Object.entries(routeColors).map(([value, color]) => {
          return {
            value,
            symbol: {
              type: 'line-3d',
              symbolLayers: [
                {
                  type: 'path',
                  profile: options.profile,
                  material: {
                    color: [...color, 0.1]
                  },
                  width: options.width,
                  height: options.height,
                  join: options.join,
                  cap: options.cap,
                  anchor: 'bottom',
                  profileRotation: options.profileRotation
                }
              ]
            }
          };
        })
      };

      return renderer;
    }

    return (
      <EsriLoaderReact
        options={options}
        modulesToLoad={[
          'esri/WebScene',
          'esri/views/SceneView',
          'esri/layers/StreamLayer',
          'esri/layers/FeatureLayer',
          'esri/renderers/UniqueValueRenderer'
        ]}
        onReady={({
          loadedModules: [
            WebScene,
            SceneView,
            StreamLayer,
            FeatureLayer,
            UniqueValueRenderer
          ],
          containerNode
        }) => {
          // ==== Initialize layer objects ====
          const buses = new StreamLayer({
            url: urls.buses,
            objectIdField: 'globalid',
            renderer: getBusesRenderer(),
            popupEnabled: true
          });

          const routes = new FeatureLayer({
            url: urls.routes,
            renderer: getRoutesRenderer(),
            labelsVisible: false
          });

          const stops = new FeatureLayer({
            url: urls.stops
          });

          // ==== Initialize scene ====
          const map = new WebScene({
            basemap: 'streets-night-vector',
            layers: [buses, routes]
          });

          new SceneView({
            container: containerNode,
            camera: {
              position: [
                -80.843056, // lon
                35.197222, // lat
                3000 // elevation in meters
              ],
              heading: 0,
              tilt: 40
            },
            map
          });
        }}
      />
    );
  }
}

export default MapPane;
