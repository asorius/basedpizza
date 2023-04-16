import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import * as topojson from 'topojson-client';
// import worldData from './world-50m.json';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';
import countries from './countries.json';
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface Props {
  countryList: string[];
}
interface Marker {
  index?: number;
  markerOffset: number;
  name: string;
  coordinates: [number, number];
}
const Map = ({ countryList }: Props) => {
  const [markers2, setMarkers] = React.useState<Marker[]>([]);
  const [textSize, setTextSize] = React.useState(0);
  React.useEffect(() => {
    countries.forEach((co) => {
      const name = co[3] as string;
      const long = co[1] as number;
      const lat = co[2] as number;
      if (countryList.includes(name)) {
        setMarkers((olds) => [
          ...olds,
          { markerOffset: 15, name, coordinates: [lat, long] },
        ]);
      }
    });
  }, [countryList]);
  return (
    <ComposableMap
      projection='geoMercator'
      style={{ width: '40rem', strokeWidth: '1' }}
      fill='#f7f7f7'
      stroke='#a8a8a8'
      strokeWidth={1}>
      <ZoomableGroup
        onMoveEnd={({ zoom }) => {
          zoom > 4 ? setTextSize(Math.floor(16 - zoom)) : setTextSize(0);
        }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryNameMatch = markers2.find(
                (marker: Marker) =>
                  marker.name.toLowerCase() ===
                  geo.properties.name.toLowerCase()
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={countryNameMatch ? '#b7e1ba' : '#f7f7f7'}
                />
              );
            })
          }
        </Geographies>
        {markers2.map(({ index, name, coordinates, markerOffset }) => (
          <Marker key={index} coordinates={coordinates}>
            <g
              fill='none'
              stroke='#FF5533'
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
              transform='translate(-12, -24)'>
              <circle
                cx='12'
                cy='10'
                r='3'
                fill='#FF5533'
                stroke='#FF5533'
                strokeWidth='1'
              />
              <path d='M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z' />
            </g>
            <text
              textAnchor='middle'
              y={textSize}
              fill='black'
              strokeWidth={0}
              style={{ fontSize: `${textSize}px`, fontFamily: 'Arial' }}>
              {name}
            </text>
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default Map;
