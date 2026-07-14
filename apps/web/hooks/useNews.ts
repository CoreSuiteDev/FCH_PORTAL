import { api } from "@/lib/api-client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ZTCNewsOutput } from "@workspace/types"

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
}) => {
  return useQuery<GetNewsResponse>({
    queryKey: ["news-list", params],
    queryFn: () =>
      api.get("/news", { params }).then((res) => res.data),
  })
}

export const useNewsById = (id: string) => {
  return useQuery<ZTCNewsOutput | null>({
    queryKey: ["news-detail-id", id],
    queryFn: () =>
      api.get(`/news/${id}`).then((res) => res.data),
    enabled: !!id,
  })
}

export const useNewsBySlug = (slug: string) => {
  return useQuery<ZTCNewsOutput | null>({
    queryKey: ["news-detail-slug", slug],
    queryFn: () =>
      api.get(`/news/slug/${slug}`).then((res) => res.data),
    enabled: !!slug,
  })
}

export const useIncrementViews = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/news/${id}/views`).then((res) => res.data),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["news-detail-id", id] })
    },
  })
}
