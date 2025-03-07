const { VENDOR_BASE_URL, VENDOR_API_TOKEN } = process.env;

async function get(url) {
  try {
    const response = await fetch(VENDOR_BASE_URL + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${VENDOR_API_TOKEN}`,
      },
      credentials: "include",
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    throw new Error(e);
  }
}

async function post(url, data = {}) {
  try {
    const response = await fetch(process.env.VENDOR_BASE_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${VENDOR_API_TOKEN}`,
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : null,
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    throw new Error(e);
  }
}

async function put(url, data = {}) {
  try {
    const response = await fetch(process.env.VENDOR_BASE_URL + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${VENDOR_API_TOKEN}`,
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : null,
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    throw new Error(e);
  }
}

const fetcher = { get, post, put };

export default fetcher;
