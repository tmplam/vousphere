import { RenderSelectedLocation } from "@/lib/leaflet/MapSupplier";
import React, { memo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

function ViewMap({ location }: { location: { lat: number; lng: number } }) {
    const renderMarks = () => {
        if (!location) return null;
        return <RenderSelectedLocation center={location} />;
    };

    return (
        <MapContainer
            center={location}
            zoom={14}
            minZoom={10}
            zoomControl={true}
            attributionControl={true}
            style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "10px", zIndex: 0 }}
        >
            <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}" />

            {renderMarks()}
        </MapContainer>
    );
}

export default memo(ViewMap);
