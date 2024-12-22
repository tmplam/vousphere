"use client";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, useMapEvents, Popup } from "react-leaflet";
import { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { memo, useState } from "react";
import { RenderSelectedLocation } from "@/lib/leaflet/MapSupplier";

const MapWithClick = memo(({ location, onChange }: { location?: number[]; onChange: (location: number[]) => void }) => {
    const [selectedLocation, setSelectedLocation] = useState<LatLngLiteral | null>(
        location ? { lat: location[0], lng: location[1] } : null
    );
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setSelectedLocation({ lat, lng });
                onChange([lat, lng]);
            },
        });
        return null;
    };

    const renderMarks = () => {
        if (!selectedLocation) return null;
        return <RenderSelectedLocation center={selectedLocation} />;
    };

    return (
        <MapContainer
            center={{ lat: 10.7628, lng: 106.6825 }}
            zoom={14}
            minZoom={10}
            zoomControl={true}
            attributionControl={true}
            style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "10px", zIndex: 0 }}
        >
            <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}" />
            <MapClickHandler />
            {renderMarks()}
        </MapContainer>
    );
});

export default MapWithClick;
