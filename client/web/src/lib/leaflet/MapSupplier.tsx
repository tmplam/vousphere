import { memo, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, useMapEvents, Popup } from "react-leaflet";
import { Icon, LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapPin } from "lucide-react";

type MapLocation = LatLngLiteral & { id: string };

export type Location = {
    lat: number;
    lng: number;
};

// const renderMarks = () => {
//     return locations.map((location) => (
//         <div key={location.id}>
//             <Marker
//                 icon={location.id === selectedLocation?.id ? mapMarkActiveIcon : mapMarkIcon}
//                 position={{ lat: location.lat, lng: location.lng }}
//                 eventHandlers={{
//                     click: () => {
//                         setSelectedLocation(location);
//                     },
//                 }}
//             />
//         </div>
//     ));
// };

export const mapMarkActiveIcon = new Icon({
    iconUrl:
        "https://png.pngtree.com/png-clipart/20230122/original/pngtree-pin-map-location-icon-logo-symbol-vector-design-transparent-background-free-png-image_8926577.png",
    iconSize: [75, 65],
});

export const RenderSelectedLocation: React.FC<{
    center: LatLngLiteral;
}> = ({ center }) => {
    const map = useMap();
    map.panTo(center, { animate: true });
    return (
        <Marker icon={mapMarkActiveIcon} position={center}>
            <Popup autoClose={true}>
                <p>Latitude: {center.lat}</p>
                <p>Longtitude: {center.lng}</p>
            </Popup>
        </Marker>
    );
};

export function useGeolocation() {
    const [position, setPosition] = useState({
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        const geo = navigator.geolocation;

        function onSuccess(position: any) {
            setPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }

        function onError(error: any) {
            console.error("Error retrieving geolocation:", error);
        }

        const watcher = geo.watchPosition(onSuccess, onError);

        return () => geo.clearWatch(watcher);
    }, []);

    return position;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
