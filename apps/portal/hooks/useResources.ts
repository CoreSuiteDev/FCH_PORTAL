import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface ResourceCategory {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Resource {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileType: string
  categoryId: string
  visibility: "MEMBER" | "PASTORAL" | "BOARD" | "ADMIN" | "COMMITTEE" | "SUPER_ADMIN"
  createdAt: string
  updatedAt: string
  category?: ResourceCategory
}

export const useCategoriesList = () => {
  return useQuery<ResourceCategory[]>({
    queryKey: ["resource-categories"],
    queryFn: () => api.get("/resources/categories").then((res) => res.data),
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string; description?: string }) =>
      api.post("/resources/categories", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-categories"] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name, description }: { id: string; name?: string; description?: string }) =>
      api.patch(`/resources/categories/${id}`, { id, name, description }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-categories"] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/resources/categories/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-categories"] })
    },
  })
}

export const useResourcesList = (
  params: {
    categoryId?: string
    categoryName?: string
    sortOrder?: "asc" | "desc"
  } = {}
) => {
  return useQuery<Resource[]>({
    queryKey: ["resources", params],
    queryFn: () => api.get("/resources", { params }).then((res) => res.data),
  })
}

export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      title: string
      description?: string
      fileUrl: string
      fileType: string
      categoryId: string
      visibility: Resource["visibility"]
    }) => api.post("/resources", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] })
    },
  })
}

export const useUpdateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string
      title?: string
      description?: string
      fileUrl?: string
      fileType?: string
      categoryId?: string
      visibility?: Resource["visibility"]
    }) => api.patch(`/resources/${id}`, { id, ...body }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] })
    },
  })
}

export const useDeleteResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/resources/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] })
    },
  })
}
