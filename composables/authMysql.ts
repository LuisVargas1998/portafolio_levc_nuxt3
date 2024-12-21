export default async (datos: Object) => {
    const data = await $fetch("http://127.0.0.1:8081/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(datos),
    });
  
    return data;
};
  