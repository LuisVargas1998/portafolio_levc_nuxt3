export default async (token: string) => {
    const data = await $fetch("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos", {
      method: "Get",
      headers: {
        "Authorization": "Bearer " + token,
      },
    });
  
    return data;
};
  