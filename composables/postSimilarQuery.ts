export default async (datos: object) => {
  const data = await $fetch("http://127.0.0.1:8080/parejas", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  return data;
};
