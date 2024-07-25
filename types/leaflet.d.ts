// @types/leaflet-heat.d.ts
import * as L from 'leaflet';

declare module 'leaflet' {
    namespace L {
        function heatLayer(
            latlngs: LatLngExpression[] | LatLngExpression[][],
            options?: HeatMapOptions
        ): Layer;
        
        interface HeatMapOptions extends LayerOptions {
            radius?: number;
            blur?: number;
            maxZoom?: number;
        }
    }
}
