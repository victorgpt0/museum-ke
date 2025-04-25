// resources/js/Pages/Map.tsx
import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng, LatLngBounds, LeafletMouseEvent } from 'leaflet';

// Fix marker icon issues in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Component to set view to specific coordinates
function SetViewOnLoad({ coords, zoom }: { coords: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(new LatLng(coords[0], coords[1]), zoom);
  }, [map, coords, zoom]);
  return null;
}

// ClickHandler component to capture map clicks
function ClickHandler({ onMapClick }: { onMapClick: (e: LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

// Kenya's main museums data
const museums = [
  {
    id: 1,
    name: "Nairobi National Museum",
    coordinates: [-1.2722, 36.8166] as [number, number],
    description: "Kenya's premier museum, showcasing the country's rich heritage through ethnography, paleontology, and art collections.",
    address: "Museum Hill, Nairobi, Kenya",
    yearEstablished: 1929,
  },
  {
    id: 2,
    name: "Nairobi Gallery",
    coordinates: [-1.2871, 36.8175] as [number, number],
    description: "Historic building housing temporary exhibitions and the permanent Murumbi Collection.",
    address: "Kenyatta Avenue & Uhuru Highway, Nairobi",
    yearEstablished: 1913,
  }
];

export default function Map({ mapType = 'all' }) {
  // Setup map configuration based on the mapType
  const [mapConfig, setMapConfig] = useState({
    center: [0.0236, 37.9062] as [number, number],
    zoom: 7,
    selectedMuseum: null as typeof museums[0] | null
  });
  
  // State for clicked position
  const [clickedPosition, setClickedPosition] = useState<{
    latlng: [number, number],
    address: string | null,
    isLoading: boolean
  } | null>(null);

  // State for custom markers added by the user
  const [customMarkers, setCustomMarkers] = useState<Array<{
    id: number,
    position: [number, number],
    name: string
  }>>([]);
  
  // Handle map click events
  const handleMapClick = async (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const position: [number, number] = [lat, lng];
    
    // Set the clicked position with loading state
    setClickedPosition({
      latlng: position,
      address: null,
      isLoading: true
    });
    
    // Try to reverse geocode the location (optional)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      
      if (data && data.display_name) {
        setClickedPosition({
          latlng: position,
          address: data.display_name,
          isLoading: false
        });
      } else {
        setClickedPosition({
          latlng: position,
          address: 'Address not found',
          isLoading: false
        });
      }
    } catch (error) {
      setClickedPosition({
        latlng: position,
        address: 'Failed to fetch address',
        isLoading: false
      });
    }
  };

  // Add a custom marker at the clicked position
  const addCustomMarker = () => {
    if (clickedPosition) {
      const newMarker = {
        id: Date.now(),
        position: clickedPosition.latlng,
        name: `Marker #${customMarkers.length + 1}`
      };
      
      setCustomMarkers([...customMarkers, newMarker]);
    }
  };

  useEffect(() => {
    // Configure map based on the type passed
    if (mapType === 'museums') {
      setMapConfig({
        center: museums[0].coordinates,
        zoom: 16,
        selectedMuseum: museums[0]
      });
    } else {
      // Default Kenya map
      setMapConfig({
        center: [0.0236, 37.9062] as [number, number],
        zoom: 7,
        selectedMuseum: null
      });
    }
  }, [mapType]);

  useEffect(() => {
    // Fix for default icon issue
    const DefaultIcon = new Icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    
    // @ts-ignore
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: icon,
      iconUrl: icon,
      shadowUrl: iconShadow
    });
  }, []);
  
  // Setting bounds to focus on Kenya
  const kenyaBounds = new LatLngBounds(
    [4.62, 33.5], // Southwest corner
    [-4.68, 41.9]  // Northeast corner
  );
  
  // Render different content based on map type
  if (mapType === 'museums') {
    return (
      <>
        <Head title="Museums Map" />
        
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Nairobi Museums Map</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {mapConfig.selectedMuseum && (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                  <h2 className="text-xl font-semibold mb-3">{mapConfig.selectedMuseum.name}</h2>
                  <div className="space-y-2">
                    <p className="text-gray-700">{mapConfig.selectedMuseum.description}</p>
                    <div className="text-sm">
                      <p><span className="font-medium">Address:</span> {mapConfig.selectedMuseum.address}</p>
                      <p><span className="font-medium">Established:</span> {mapConfig.selectedMuseum.yearEstablished}</p>
                      <p><span className="font-medium">Coordinates:</span> {mapConfig.selectedMuseum.coordinates[0]}, {mapConfig.selectedMuseum.coordinates[1]}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="font-semibold mb-2">Museums in Database</h3>
                <ul className="space-y-2">
                  {museums.map(museum => (
                    <li 
                      key={museum.id}
                      className={`p-2 rounded cursor-pointer ${mapConfig.selectedMuseum?.id === museum.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                      onClick={() => setMapConfig(prev => ({...prev, selectedMuseum: museum, center: museum.coordinates, zoom: 16}))}
                    >
                      {museum.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              {clickedPosition && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-2">Clicked Location</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Latitude:</span> {clickedPosition.latlng[0].toFixed(6)}</p>
                    <p><span className="font-medium">Longitude:</span> {clickedPosition.latlng[1].toFixed(6)}</p>
                    {clickedPosition.isLoading ? (
                      <p className="text-gray-500">Loading address...</p>
                    ) : (
                      <p><span className="font-medium">Address:</span> {clickedPosition.address}</p>
                    )}
                    <button 
                      onClick={addCustomMarker}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Add Marker Here
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden shadow">
                <MapContainer 
                  center={mapConfig.center}
                  zoom={mapConfig.zoom} 
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Click handler component */}
                  <ClickHandler onMapClick={handleMapClick} />
                  
                  {/* Museum markers */}
                  {museums.map(museum => (
                    <Marker 
                      key={museum.id}
                      position={museum.coordinates}
                      eventHandlers={{
                        click: () => {
                          setMapConfig(prev => ({...prev, selectedMuseum: museum}));
                        }
                      }}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-bold">{museum.name}</h3>
                          <p className="text-sm">Established in {museum.yearEstablished}</p>
                          <p className="text-xs mt-1">Coordinates: {museum.coordinates[0]}, {museum.coordinates[1]}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Custom markers added by user */}
                  {customMarkers.map(marker => (
                    <Marker 
                      key={marker.id}
                      position={marker.position}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-bold">{marker.name}</h3>
                          <p className="text-xs mt-1">
                            Lat: {marker.position[0].toFixed(6)}, Lng: {marker.position[1].toFixed(6)}
                          </p>
                          <button
                            onClick={() => {
                              setCustomMarkers(customMarkers.filter(m => m.id !== marker.id));
                            }}
                            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Marker at clicked position */}
                  {clickedPosition && (
                    <Marker 
                      position={clickedPosition.latlng}
                      opacity={0.7}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-bold">Selected Location</h3>
                          <p className="text-xs">
                            Lat: {clickedPosition.latlng[0].toFixed(6)}, 
                            Lng: {clickedPosition.latlng[1].toFixed(6)}
                          </p>
                          {!clickedPosition.isLoading && clickedPosition.address && (
                            <p className="text-xs mt-1">{clickedPosition.address}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {mapConfig.selectedMuseum && (
                    <SetViewOnLoad coords={mapConfig.selectedMuseum.coordinates} zoom={16} />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  // Default Kenya map view
  return (
    <>
      <Head title="Kenya Map" />
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Kenya Map</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Map Information</h2>
            
            {clickedPosition && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Clicked Location</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">Latitude: {clickedPosition.latlng[0].toFixed(6)}</p>
                  <p className="text-sm">Longitude: {clickedPosition.latlng[1].toFixed(6)}</p>
                  
                  {clickedPosition.isLoading ? (
                    <p className="text-sm text-gray-500 mt-2">Loading address...</p>
                  ) : (
                    <p className="text-sm mt-2">Address: {clickedPosition.address}</p>
                  )}
                  
                  <button 
                    onClick={addCustomMarker}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Save as Marker
                  </button>
                </div>
              </div>
            )}
            
            {customMarkers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Your Markers</h3>
                <ul className="space-y-2">
                  {customMarkers.map(marker => (
                    <li key={marker.id} className="text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                      <span>{marker.name}</span>
                      <button
                        onClick={() => {
                          setCustomMarkers(customMarkers.filter(m => m.id !== marker.id));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-3">
            <div style={{ height: '600px', width: '100%' }} className="rounded-lg overflow-hidden shadow">
              <MapContainer 
                center={mapConfig.center}
                zoom={mapConfig.zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                bounds={kenyaBounds}
                maxBounds={kenyaBounds.pad(0.5)}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Click handler component */}
                <ClickHandler onMapClick={handleMapClick} />
                
                {/* Nairobi marker */}
                <Marker position={[-1.2921, 36.8219]}>
                  <Popup>
                    Nairobi - Capital City of Kenya
                  </Popup>
                </Marker>
                
                {/* Museum markers */}
                {museums.map(museum => (
                  <Marker key={museum.id} position={museum.coordinates}>
                    <Popup>
                      <div>
                        <h3 className="font-bold">{museum.name}</h3>
                        <p>{museum.description.substring(0, 100)}...</p>
                        <p className="text-sm mt-1">Coordinates: {museum.coordinates[0]}, {museum.coordinates[1]}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Custom markers added by user */}
                {customMarkers.map(marker => (
                  <Marker 
                    key={marker.id}
                    position={marker.position}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-bold">{marker.name}</h3>
                        <p className="text-xs mt-1">
                          Lat: {marker.position[0].toFixed(6)}, Lng: {marker.position[1].toFixed(6)}
                        </p>
                        <button
                          onClick={() => {
                            setCustomMarkers(customMarkers.filter(m => m.id !== marker.id));
                          }}
                          className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Marker at clicked position */}
                {clickedPosition && (
                  <Marker 
                    position={clickedPosition.latlng}
                    opacity={0.7}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-bold">Selected Location</h3>
                        <p className="text-xs">
                          Lat: {clickedPosition.latlng[0].toFixed(6)}, 
                          Lng: {clickedPosition.latlng[1].toFixed(6)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}