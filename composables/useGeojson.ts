import geojson from "~/assets/geojson";
import { IBarrios } from '~/types/interfaces'

export default () => {

    const barrios: IBarrios = geojson;

    return barrios.features;

}