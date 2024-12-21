import { Layer } from "@types/leaflet/index"

export class MarkerCluster<P = any> extends Layer {
    //constructor(options?: LayerOptions);
    
    /**
     * Adds the given layer to the group.
     */
    addLayer(layer: Layer): this;

    /**
     * Removes the layer with the given internal ID or the given layer from the group.
     */
    removeLayer(layer: number | Layer): this;

    /**
     * Returns an array of all the layers added to the group.
     */
    getLayers(): Layer[];

    /**
     * Provisional
     */
    getElement(): HTMLElement | undefined;
    _leaflet_id: any;
}

export function markerCluster(options?: LayerOptions): MarkerCluster;