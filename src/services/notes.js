import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

/* The actual commands to the API */

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
};

const update = (newObject) => {
  const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return request.then(response => response.data)
}

const remove = (note) => {
  console.log('deleted')
  const request = axios.delete(`${baseUrl}/${note.id}`)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken, remove }