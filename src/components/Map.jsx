import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Map = ({ locations }) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} className="h-96 w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

