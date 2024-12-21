export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const listCities = await useFetch("http://127.0.0.1:8080/results/city-by-point", {
        method: "POST",
        body
    })

    return listCities
  
});