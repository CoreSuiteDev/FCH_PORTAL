import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ZTCCreateAuthor, ZTCUpdateAuthor, ZTCAuthorOutput } from "@workspace/types"

interface GetAuthorsResponse {
  data: ZTCAuthorOutput[]
  meta: {
    totalCount: number
    page: number
    limit: number
    totalPages: number
  }
}

export const useAuthors = (page = 1, limit = 10) => {
  return useQuery<GetAuthorsResponse>({
    queryKey: ["authors", page, limit],
    queryFn: () =>
      api.get("/authors", { params: { page, limit } }).then((res) => res.data),
  })
}

export const useCreateAuthor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ZTCCreateAuthor) =>
      api.post("/authors", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] })
    },
  })
}

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ZTCUpdateAuthor }) =>
      api.patch(`/authors/${id}`, { data }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] })
    },
  })
}

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/authors/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] })
    },
  })
}
