import { IGeometry, ICenterPoint, ILocationRegistros } from "~/types/interfaces"

const radios = {
    14: 0.020,
    15: 0.015,
    16: 0.010,
    17: 0.005
}

export default async (point: number[], zoom: number) => {

    let centerPoint: ICenterPoint = {
        lat: point[0],
        lon: point[1]
    }

    let radio: number = radios[zoom]

    console.log(radio)

    const { data, error } = await useFetch<ILocationRegistros[]>(
        () => `http://127.0.0.1:8080/results/near-results?lat=${centerPoint.lat}&lon=${centerPoint.lon}&radio=${radio}`, 
    );

    //crear anejador de errores

    return data.value;

}