declare module 'react-leaflet-heatmap-layer' {
    import { Component } from 'react';
    import { Layer } from 'leaflet';

    interface HeatmapLayerProps {
        points: [number, number, number][];
        longitudeExtractor: (point: [number, number]) => number;
        latitudeExtractor: (point: [number, number]) => number;
        intensityExtractor: (point: [number, number, number]) => number;
        radius?: number;
        blur?: number;
        maxZoom?: number;
    }

    export default class HeatmapLayer extends Component<HeatmapLayerProps> {}
}
