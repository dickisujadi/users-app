import axios from "axios";

export const fetchUsers = async (payload) => {
  let query = "";

  if (payload !== undefined) {
    let idx = 0;
    for (var key of Object.keys(payload)) {
      if (payload[key]) {
        const addQuery =
          idx === 0 ? `?${key}=${payload[key]}` : `&${key}=${payload[key]}`;
        query += addQuery;
      }
      idx += 1;
    }
  }

  console.log("payload Ref 1", query);

  return axios
    .get(`https://randomuser.me/api/${query}`)
    .then((data) => {
      return JSON.stringify(data, null, 2);
    })
    .catch((error) => {
      console.log(error);
    });
};
