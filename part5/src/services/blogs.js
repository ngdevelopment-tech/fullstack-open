const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment })
  return response.data
}


export default { getAll, create, update, remove, setToken, addComment }