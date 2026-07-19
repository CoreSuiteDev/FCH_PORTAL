import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ZTCCreateNews, ZTCUpdateNews,  ZTCNewsOutput } from "@workspace/types"

interface GetNewsResponse {
  data: ZTCNewsOutput[]
  meta: {
    totalCount: number
    page: number
    limit: number
    totalPages: number
  }
}

export const useNewsList = (params: {
  page?: number
  limit?: number
  status?: string
  newsType?: string
  authorId?: string
  search?: string
}) => {
  return useQuery<GetNewsResponse>({
    queryKey: ["news-list", params],
    queryFn: () =>
      api.get("/news", { params }).then((res) => res.data),
  })
}

export const useNewsBySlug = (slug: string) => {
  return useQuery<ZTCNewsOutput>({
    queryKey: ["news-by-slug", slug],
    queryFn: () =>
      api.get(`/news/slug/${slug}`).then((res) => res.data),
    enabled: !!slug,
  })
}

export const useCreateNews = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ZTCCreateNews) =>
      api.post("/news", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-list"] })
    },
  })
}

export const useUpdateNews = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ZTCUpdateNews }) =>
      api.patch(`/news/${id}`, { data }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-list"] })
    },
  })
}

export const useDeleteNews = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/news/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-list"] })
    },
  })
}
