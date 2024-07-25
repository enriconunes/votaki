declare module 'leaflet.heat' {
    import * as L from 'leaflet';

    interface HeatLayerOptions extends L.LayerOptions {
        radius?: number;
        blur?: number;
        maxZoom?: number;
    }

    class HeatLayer extends L.Layer {
        constructor(latlngs: L.LatLngExpression[], options?: HeatLayerOptions);
    }

    function heatLayer(latlngs: L.LatLngExpression[], options?: HeatLayerOptions): HeatLayer;

    export = heatLayer;
}
