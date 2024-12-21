export default async (token: string) => {
    const data = await $fetch(`https://graph.facebook.com/me?fields=name,email,picture&access_token=${token}`, {
      method: "Get",
    });
  
    return data;
};
  