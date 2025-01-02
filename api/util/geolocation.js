export const getGeolocation = async (ip) => {
  const res = await fetch(
    `http://ip-api.com/json/${ip}?fields=city,regionName`
  );
  const data = await res.json();
  return data;
};
