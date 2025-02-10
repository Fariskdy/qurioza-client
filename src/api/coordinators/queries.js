import { api } from '../axios'

export const coordinatorKeys = {
  all: ['coordinators'],
  list: () => [...coordinatorKeys.all, 'list'],
  detail: (id) => [...coordinatorKeys.all, 'detail', id],
}

export const getCoordinators = async () => {
  const { data } = await api.get('/coordinators')
  return data
}

export const getCoordinator = async (id) => {
  const { data } = await api.get(`/coordinators/${id}`)
  return data
} 