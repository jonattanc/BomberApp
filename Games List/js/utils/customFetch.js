/*By Luna*/
async function getAPI(path) {
  const response = await fetch(API_URL + path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return response.json();
}

async function postAPI(path, data) {
  const response = await fetch('API_URL + path', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  
  return response.json();
}

async function putAPI(path, data) {
  const response = await fetch('API_URL + path', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  
  return response.json();
}

async function patchAPI(path, data) {
  const response = await fetch('API_URL + path', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  
  return response.json();
}

async function deleteAPI(path) {
  const response = await fetch('API_URL + path', {
    method: 'DELETE', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  
  return response.json();
}

module.exports = {
  getAPI,
  postAPI,
  putAPI,
  deleteAPI
}