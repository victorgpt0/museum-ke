import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngBounds } from 'leaflet';

// Fix marker icon issues in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function Map() {
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
    
    // Kenya's approximate center coordinates
    const kenyaCenter: [number, number] = [0.0236, 37.9062];
    
    // Nairobi coordinates for marker example
    const nairobi: [number, number] = [-1.2921, 36.8219];
    
    // Setting bounds to focus on Kenya
    const kenyaBounds = new LatLngBounds(
        [4.62, 33.5], // Southwest corner
        [-4.68, 41.9]  // Northeast corner
    );
    
    return (
        <>
            <Head title="Map" />
            <div className="text-center text-4xl font-bold font-mono text-indigo-600 my-8">
                INTERESTED?
            </div>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">Kenya Map</h1>
                            <div style={{ height: '600px', width: '100%' }}>
                                <MapContainer 
                                    center={kenyaCenter}
                                    zoom={7} 
                                    scrollWheelZoom={true}
                                    style={{ height: '100%', width: '100%' }}
                                    bounds={kenyaBounds}
                                    maxBounds={kenyaBounds.pad(0.5)}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={nairobi}>
                                        <Popup>
                                            Nairobi - Capital City of Kenya
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}