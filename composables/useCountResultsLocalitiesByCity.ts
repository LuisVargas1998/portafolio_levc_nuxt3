import { ILocalityWithNumberOfRecords } from "~/types/interfaces"

export default async (point: number[]) => {

    let body = {
        lat: point[0],
        lon: point[1]
    }

    const { data: totalRecordsBylocality, error } = await useFetch<ILocalityWithNumberOfRecords[]>(
        () => `http://127.0.0.1:8080/results/count-results-locality-by-city`, 
        {
            method: "POST",
            body
        }
    );

    //crear manejador de errores

    //console.log(totalRecordsBylocality)

    return totalRecordsBylocality;

}