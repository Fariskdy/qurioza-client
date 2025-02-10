import { api } from '../axios'

export const createCoordinator = async (coordinatorData) => {
  const { data } = await api.post('/coordinators', coordinatorData)
  return data
}

export const updateCoordinator = async ({ id, ...data }) => {
  const { data: response } = await api.put(`/coordinators/${id}`, data)
  return response
}

export const deleteCoordinator = async (id) => {
  const { data } = await api.delete(`/coordinators/${id}`)
  return data
} 