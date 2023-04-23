import React, { useEffect, useRef } from 'react';

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';
import countries from './countries.json';
import worldCountriesJSON from 'assets/countries-110m.json';
import Loading from 'utils/Loading';
import Card from '@mui/material/Card';
import Backdrop from '@mui/material/Backdrop';
import { useData } from 'context/data/DataContextProvider';
import { CountryObject } from 'utils/types';
interface Props {
  countryList: string[];
}
interface Marker {
  index?: number;
  markerOffset: number;
  name: string;
  coordinates: [number, number];
}
const generateMarks = (countriesProp: string[]) => {
  let markerList: Marker[] = [];
  countries.forEach((co) => {
    const name = co[3] as string;
    const long = co[1] as number;
    const lat = co[2] as number;
    if (countriesProp.includes(name)) {
      markerList.push({ markerOffset: 15, name, coordinates: [lat, long] });
    }
  });
  return markerList;
};
const Map = () => {
  const [markers, setMarkers] = React.useState<Marker[]>([]);
  const [textSize, setTextSize] = React.useState(0);
  const [scale, setScale] = React.useState(300);
  const [center, setCenter] = React.useState<[number, number]>([0, 0]);
  const originalState = useData();
  React.useEffect(() => {
    if (!originalState) return;
    const countryList = originalState.map(
      (country: CountryObject) => country.info.name
    );
    const list = generateMarks(countryList);
    setMarkers(list);
  }, [originalState]);

  React.useEffect(() => {
    const length = markers.length;
    let ind = 0;
    if (length === 0) {
      setScale(300);
      setTextSize(0);
      setCenter([0, 0]);
      return;
    }
    if (length === 1) {
      setCenter(markers[0].coordinates);
      setScale(800);
      setTextSize(20);
      return;
    }
    const countryRotation = setInterval(() => {
      if (length > 1) {
        if (ind < length) {
          setCenter(markers[ind].coordinates);
          setScale(800);
          setTextSize(20);
          ind++;
        } else {
          setScale(300);
          setTextSize(0);
          setCenter([0, 0]);
          ind = 0;
        }
      }
    }, 3000);
    return () => clearInterval(countryRotation);
  }, [markers]);
  return (
    <div
      style={{
        position: 'relative',
        zIndex: '-1',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
      <Backdrop open={markers.length < 1} style={{ position: 'absolute' }}>
        <Loading />
      </Backdrop>
      <ComposableMap
        projection='geoMercator'
        style={{
          width: '100%',
          height: '100%',
          strokeWidth: '1',
          border: 'none',
        }}
        // fill='black'
        // stroke='#a8a8a8'
        projectionConfig={{ scale, center }}>
        <ZoomableGroup>
          <Geographies geography={worldCountriesJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryNameMatch = markers.find(
                  (marker: Marker) =>
                    marker.name.toLowerCase() ===
                    geo.properties.name.toLowerCase()
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={countryNameMatch ? 'mediumseagreen' : '#f7f7f7'}
                  />
                );
              })
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates}>
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
    </div>
  );
};

export default Map;
