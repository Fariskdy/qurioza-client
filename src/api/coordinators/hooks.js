import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coordinatorKeys, getCoordinators, getCoordinator } from './queries'
import { createCoordinator, updateCoordinator, deleteCoordinator } from './mutations'

export const useCoordinators = () => {
  return useQuery({
    queryKey: coordinatorKeys.list(),
    queryFn: getCoordinators,
  })
}

export const useCoordinator = (id) => {
  return useQuery({
    queryKey: coordinatorKeys.detail(id),
    queryFn: () => getCoordinator(id),
  })
}

export const useCreateCoordinator = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCoordinator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coordinatorKeys.list() })
    },
  })
}

export const useUpdateCoordinator = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateCoordinator,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: coordinatorKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: coordinatorKeys.list() })
    },
  })
}

export const useDeleteCoordinator = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteCoordinator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coordinatorKeys.list() })
    },
  })
} 