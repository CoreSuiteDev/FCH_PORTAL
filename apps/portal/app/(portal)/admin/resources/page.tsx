"use client"
"use no compiler"

import React, { useState, useMemo } from "react"
import {
  IconUpload,
  IconPlus,
  IconTrash,
  IconEdit,
  IconFileText,
  IconLoader,
  IconExternalLink,
  IconLock,
} from "@tabler/icons-react"
import { toast } from "@workspace/ui/components/sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { api } from "@/lib/axios"
import {
  useCategoriesList,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useResourcesList,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  Resource,
} from "@/hooks/useResources"

export default function AdminResourcesPage() {
  const { data: categories, isLoading: isCatLoading } = useCategoriesList()
  const { data: resources, isLoading: isResLoading } = useResourcesList()

  const createCatMutation = useCreateCategory()
  const updateCatMutation = useUpdateCategory()
  const deleteCatMutation = useDeleteCategory()

  const createResMutation = useCreateResource()
  const updateResMutation = useUpdateResource()
  const deleteResMutation = useDeleteResource()

  // Tab State
  const [activeTab, setActiveTab] = useState("resources")

  // Category Dialog States
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false)
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [catName, setCatName] = useState("")
  const [catDesc, setCatDesc] = useState("")

  // Resource Dialog States
  const [isResDialogOpen, setIsResDialogOpen] = useState(false)
  const [editingResId, setEditingResId] = useState<string | null>(null)
  const [resTitle, setResTitle] = useState("")
  const [resDesc, setResDesc] = useState("")
  const [resCatId, setResCatId] = useState("")
  const [resVisibility, setResVisibility] = useState<Resource["visibility"]>("MEMBER")
  const [resFileUrl, setResFileUrl] = useState("")
  const [resFileType, setResFileType] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  // Search Filter
  const [searchQuery, setSearchQuery] = useState("")

  // --- Category Actions ---
  const handleOpenCatCreate = () => {
    setEditingCatId(null)
    setCatName("")
    setCatDesc("")
    setIsCatDialogOpen(true)
  }

  const handleOpenCatEdit = (cat: any) => {
    setEditingCatId(cat.id)
    setCatName(cat.name)
    setCatDesc(cat.description || "")
    setIsCatDialogOpen(true)
  }

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName.trim()) {
      toast.error("Category name is required")
      return
    }

    try {
      if (editingCatId) {
        await updateCatMutation.mutateAsync({
          id: editingCatId,
          name: catName,
          description: catDesc || undefined,
        })
        toast.success("Category updated successfully!")
      } else {
        await createCatMutation.mutateAsync({
          name: catName,
          description: catDesc || undefined,
        })
        toast.success("Category created successfully!")
      }
      setIsCatDialogOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed")
    }
  }

  const handleCatDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All resources in it will also be deleted.")) return
    try {
      await deleteCatMutation.mutateAsync(id)
      toast.success("Category deleted successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category")
    }
  }

  // --- Resource Actions ---
  const handleOpenResCreate = () => {
    setEditingResId(null)
    setResTitle("")
    setResDesc("")
    setResCatId(categories?.[0]?.id || "")
    setResVisibility("MEMBER")
    setResFileUrl("")
    setResFileType("")
    setIsResDialogOpen(true)
  }

  const handleOpenResEdit = (res: any) => {
    setEditingResId(res.id)
    setResTitle(res.title)
    setResDesc(res.description || "")
    setResCatId(res.categoryId)
    setResVisibility(res.visibility)
    setResFileUrl(res.fileUrl)
    setResFileType(res.fileType)
    setIsResDialogOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1]
        const response = await api.post("/upload", {
          base64,
          filename: file.name,
          mimetype: file.type,
          folder: "resources",
        })

        if (response.data?.success) {
          setResFileUrl(response.data.data.url)
          setResFileType(file.name.split(".").pop() || "bin")
          toast.success("File uploaded successfully!")
        } else {
          toast.error("Failed to upload file")
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      toast.error("Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleResSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resTitle.trim()) {
      toast.error("Resource title is required")
      return
    }
    if (!resCatId) {
      toast.error("Please select a category")
      return
    }
    if (!resFileUrl) {
      toast.error("Please upload a file")
      return
    }

    try {
      const payload = {
        title: resTitle,
        description: resDesc || undefined,
        fileUrl: resFileUrl,
        fileType: resFileType,
        categoryId: resCatId,
        visibility: resVisibility,
      }

      if (editingResId) {
        await updateResMutation.mutateAsync({
          id: editingResId,
          ...payload,
        })
        toast.success("Resource updated successfully!")
      } else {
        await createResMutation.mutateAsync(payload)
        toast.success("Resource created successfully!")
      }
      setIsResDialogOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed")
    }
  }

  const handleResDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this resource?")) return
    try {
      await deleteResMutation.mutateAsync(id)
      toast.success("Resource deleted successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete resource")
    }
  }

  // Filtered Resources
  const filteredResources = useMemo(() => {
    const list = resources || []
    return list.filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [resources, searchQuery])

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            FCH Resource Center
          </h2>
          <p className="text-sm text-slate-500">
            Create, publish, and manage general member, pastoral, and board documents.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleOpenCatCreate}
            variant="outline"
            className="shadow-sm border-slate-200"
          >
            <IconPlus className="mr-2 h-4 w-4" /> New Category
          </Button>
          <Button
            onClick={handleOpenResCreate}
            disabled={!categories || categories.length === 0}
            className="shadow-sm bg-primary hover:bg-primary/95 text-white"
          >
            <IconPlus className="mr-2 h-4 w-4" /> New Resource
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="resources" className="rounded-lg">
            Resources
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg">
            Categories
          </TabsTrigger>
        </TabsList>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">All Uploaded Resources</CardTitle>
                <CardDescription className="text-xs">
                  Filter by resource title or category name.
                </CardDescription>
              </div>
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs border-slate-200"
              />
            </CardHeader>
            <CardContent className="p-0">
              {isResLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Resource Details</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.length > 0 ? (
                      filteredResources.map((res) => (
                        <TableRow key={res.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                <IconFileText className="h-5 w-5" />
                              </div>
                              <div className="truncate max-w-[200px] sm:max-w-[300px]">
                                <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                  {res.title}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {res.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                              {res.category?.name || "Uncategorized"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                              res.visibility === "MEMBER"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : res.visibility === "PASTORAL"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : res.visibility === "BOARD"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-purple-50 text-purple-600 border-purple-200"
                            }`}>
                              {res.visibility}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {new Date(res.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={res.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-primary rounded-lg transition-colors"
                              >
                                <IconExternalLink className="h-4 w-4" />
                              </a>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleOpenResEdit(res)}
                                className="h-8 w-8 text-slate-400 hover:text-amber-600"
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleResDelete(res.id)}
                                className="h-8 w-8 text-slate-400 hover:text-rose-600"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                          No resources found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Resource Categories</CardTitle>
              <CardDescription className="text-xs">
                Manage groupings for different resource types.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isCatLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-12 w-full rounded" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => (
                        <TableRow key={cat.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-bold text-slate-800 dark:text-slate-100">
                            {cat.name}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {cat.description || "No description provided"}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {new Date(cat.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleOpenCatEdit(cat)}
                                className="h-8 w-8 text-slate-400 hover:text-amber-600"
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleCatDelete(cat.id)}
                                className="h-8 w-8 text-slate-400 hover:text-rose-600"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                          No categories created yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resource Form Dialog */}
      <Dialog open={isResDialogOpen} onOpenChange={setIsResDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingResId ? "Edit Resource" : "Create New Resource"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Resource Title *</label>
              <Input
                placeholder="e.g. FCH Governance Protocol"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <Textarea
                placeholder="Brief description of what this document contains..."
                value={resDesc}
                onChange={(e) => setResDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category *</label>
                <select
                  value={resCatId}
                  onChange={(e) => setResCatId(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="" disabled>Select category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Access Visibility *</label>
                <select
                  value={resVisibility}
                  onChange={(e) => setResVisibility(e.target.value as any)}
                  required
                  className="w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="MEMBER">General Member</option>
                  <option value="PASTORAL">Pastoral Member</option>
                  <option value="BOARD">Board Member</option>
                  <option value="ADMIN">Admin Only</option>
                  <option value="SUPER_ADMIN">Super Admin Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase block">Upload Resource File *</label>
              {resFileUrl ? (
                <div className="flex items-center justify-between border rounded-md p-3 bg-slate-50/50">
                  <div className="flex items-center gap-2 truncate">
                    <IconFileText className="text-primary h-5 w-5" />
                    <span className="text-xs font-semibold truncate max-w-[250px]">{resFileUrl.split("/").pop()}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">({resFileType})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResFileUrl("")
                      setResFileType("")
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-rose-500"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                  {isUploading ? (
                    <>
                      <IconLoader className="h-8 w-8 animate-spin text-primary mb-2" />
                      <span className="text-xs font-semibold text-slate-600">Uploading to R2...</span>
                    </>
                  ) : (
                    <>
                      <IconUpload className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-600">Click to upload resource</span>
                      <span className="text-[10px] text-slate-400">PDF, DOCX, ZIP, MP4 (Max 20MB)</span>
                    </>
                  )}
                  <input type="file" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                </label>
              )}
            </div>

            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setIsResDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !resFileUrl} className="bg-primary hover:bg-primary/95 text-white">
                {editingResId ? "Update Resource" : "Create Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Form Dialog */}
      <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingCatId ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCatSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Category Name *</label>
              <Input
                placeholder="e.g. Liturgy and Seasonal Guides"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <Textarea
                placeholder="Short description of resources in this category..."
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
              />
            </div>
            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCatDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/95 text-white">
                {editingCatId ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
