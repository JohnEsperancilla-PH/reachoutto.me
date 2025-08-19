"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfilePhotoUpload } from "@/components/profile-photo-upload"
import { PortfolioImageUpload } from "@/components/portfolio-image-upload"
import LinkCard from "@/components/link-card"
import PortfolioCard from "@/components/portfolio-card"
import { IconPicker } from "@/components/icon-picker"
import { ColorPicker } from "@/components/color-picker"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
import { Switch } from "@/components/ui/switch"
import { 
  Link as LinkIcon, 
  User as UserIcon, 
  Plus, 
  Trash2, 
  GripVertical,
  LogOut,
  Eye,
  Settings,
  X,
  Check,
  Briefcase,
  Upload,
  Image as ImageIcon
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { uploadPortfolioImage, deletePortfolioImage } from "@/lib/supabase/storage"
import { useRouter } from "next/navigation"
import type { User as AuthUser } from "@supabase/supabase-js"
import type { User, Link as LinkType, PortfolioItem } from "@/lib/types/database"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


interface SortableLinkProps {
  link: LinkType
  onEdit: (link: LinkType) => void
  onDelete: (id: string) => void
  isBeingEdited?: boolean
}

function SortableLink({ link, onEdit, onDelete, isBeingEdited = false }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3"
    >
      <div
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <LinkCard
          link={link}
          onEdit={onEdit}
          showControls={true}
          isBeingEdited={isBeingEdited}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(link.id)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface DashboardClientProps {
  user: AuthUser
  profile: User | null
  initialLinks: LinkType[]
  initialPortfolioItems: PortfolioItem[]
}

export default function DashboardClient({ user, profile, initialLinks, initialPortfolioItems }: DashboardClientProps) {
  const [mounted, setMounted] = React.useState(false)
  const [links, setLinks] = React.useState<LinkType[]>([])
  const [portfolioItems, setPortfolioItems] = React.useState<PortfolioItem[]>([])
  const [username, setUsername] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [showLinks, setShowLinks] = React.useState(true)
  const [showPortfolio, setShowPortfolio] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [editingLink, setEditingLink] = React.useState<LinkType | null>(null)
  const [editingPortfolio, setEditingPortfolio] = React.useState<PortfolioItem | null>(null)
  const [linkTitle, setLinkTitle] = React.useState("")
  const [linkUrl, setLinkUrl] = React.useState("")
  const [linkIcon, setLinkIcon] = React.useState("Link")
  const [linkColor, setLinkColor] = React.useState("default")
  const [showAddLink, setShowAddLink] = React.useState(false)
  const [portfolioTitle, setPortfolioTitle] = React.useState("")
  const [portfolioDescription, setPortfolioDescription] = React.useState("")
  const [portfolioImageUrl, setPortfolioImageUrl] = React.useState("")
  const [portfolioProjectUrl, setPortfolioProjectUrl] = React.useState("")
  const [showAddPortfolio, setShowAddPortfolio] = React.useState(false)

  // Initialize state after mount to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
    setLinks(initialLinks)
    setPortfolioItems(initialPortfolioItems)
    setUsername(profile?.username || "")
    setBio(profile?.bio || "")
    setShowLinks(profile?.show_links ?? true)
    setShowPortfolio(profile?.show_portfolio ?? false)
  }, [initialLinks, initialPortfolioItems, profile])
  
  const router = useRouter()
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          username: username,
          bio: bio,
          show_links: showLinks,
          show_portfolio: showPortfolio,
        })

      if (error) throw error
      
      // Update the URL if username changed
      if (username !== profile?.username) {
        router.refresh()
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionToggleUpdate = async (field: 'show_links' | 'show_portfolio', value: boolean) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ [field]: value })
        .eq("id", user.id)

      if (error) throw error
    } catch (error: any) {
      console.error("Error updating section visibility:", error.message)
    }
  }

  const handleAddLink = async () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return

    setLoading(true)
    try {
      const newLink = {
        user_id: user.id,
        title: linkTitle,
        url: linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`,
        position: links.length,
        icon: linkIcon,
        color: linkColor,
      }

      // Optimistically add to UI
      const tempId = Date.now().toString()
      const tempLink = { ...newLink, id: tempId } as LinkType
      setLinks([...links, tempLink])

      const { data, error } = await supabase
        .from("links")
        .insert(newLink)
        .select()
        .single()

      if (error) {
        // Revert on error
        setLinks(links)
        throw error
      }

      // Update with real ID from server
      setLinks(prevLinks => prevLinks.map(link => link.id === tempId ? data : link))
      setLinkTitle("")
      setLinkUrl("")
      setShowAddLink(false)
    } catch (error: any) {
      console.error("Error adding link:", error.message)
      alert('Failed to add link: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLink = async (updatedLink: LinkType) => {
    setLoading(true)
    try {
      // Optimistically update the UI
      setLinks(links.map(link => link.id === updatedLink.id ? updatedLink : link))

      const { data, error } = await supabase
        .from("links")
        .update({
          title: updatedLink.title,
          url: updatedLink.url,
          icon: updatedLink.icon || 'Link',
          color: updatedLink.color || 'default',
          position: updatedLink.position
        })
        .eq("id", updatedLink.id)
        .select()
        .single()

      if (error) {
        // Revert on error
        setLinks(links)
        throw error
      }

      // Update with server data
      setLinks(prevLinks => prevLinks.map(link => link.id === data.id ? data : link))
    } catch (error: any) {
      console.error("Error updating link:", error.message)
      alert('Failed to update link: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditLink = async () => {
    if (!editingLink || !linkTitle.trim() || !linkUrl.trim()) return

    setLoading(true)
    try {
      const updatedLink = {
        ...editingLink,
        title: linkTitle,
        url: linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`,
        icon: linkIcon,
        color: linkColor,
      }
      await handleUpdateLink(updatedLink)
      cancelEdit()
    } catch (error: any) {
      console.error("Error updating link:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", id)

      if (error) throw error

      setLinks(links.filter(link => link.id !== id))
    } catch (error: any) {
      console.error("Error deleting link:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex(link => link.id === active.id)
      const newIndex = links.findIndex(link => link.id === over?.id)
      
      const newLinks = arrayMove(links, oldIndex, newIndex)
      setLinks(newLinks)

      // Update positions in database
      try {
        const updates = newLinks.map((link, index) => ({
          id: link.id,
          position: index,
        }))

        for (const update of updates) {
          await supabase
            .from("links")
            .update({ position: update.position })
            .eq("id", update.id)
        }
      } catch (error: any) {
        console.error("Error updating link positions:", error.message)
      }
    }
  }

  const startEditLink = (link: LinkType) => {
    setEditingLink(link)
    setLinkTitle(link.title)
    setLinkUrl(link.url)
    setLinkIcon(link.icon || "Link")
    setLinkColor(link.color || "default")
    setShowAddLink(true)
  }

  const cancelEdit = () => {
    setEditingLink(null)
    setLinkTitle("")
    setLinkUrl("")
    setLinkIcon("Link")
    setLinkColor("default")
    setShowAddLink(false)
  }

  // Portfolio management functions
  const handleAddPortfolio = async () => {
    if (!portfolioTitle.trim()) return

    setLoading(true)
    try {
      const newPortfolioItem = {
        user_id: user.id,
        title: portfolioTitle,
        description: portfolioDescription || null,
        image_url: portfolioImageUrl || null,
        project_url: portfolioProjectUrl || null,
        position: portfolioItems.length,
      }

      const tempId = Date.now().toString()
      const tempItem = { ...newPortfolioItem, id: tempId } as PortfolioItem
      setPortfolioItems([...portfolioItems, tempItem])

      const { data, error } = await supabase
        .from("portfolio_items")
        .insert(newPortfolioItem)
        .select()
        .single()

      if (error) {
        setPortfolioItems(portfolioItems)
        throw error
      }

      setPortfolioItems(prevItems => prevItems.map(item => item.id === tempId ? data : item))
      setPortfolioTitle("")
      setPortfolioDescription("")
      setPortfolioImageUrl("")
      setPortfolioProjectUrl("")
      setShowAddPortfolio(false)
    } catch (error: any) {
      console.error("Error adding portfolio item:", error.message)
      alert('Failed to add portfolio item: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePortfolio = async (updatedItem: PortfolioItem) => {
    setLoading(true)
    try {
      setPortfolioItems(portfolioItems.map(item => item.id === updatedItem.id ? updatedItem : item))

      const { data, error } = await supabase
        .from("portfolio_items")
        .update({
          title: updatedItem.title,
          description: updatedItem.description,
          image_url: updatedItem.image_url,
          project_url: updatedItem.project_url,
          position: updatedItem.position
        })
        .eq("id", updatedItem.id)
        .select()
        .single()

      if (error) {
        setPortfolioItems(portfolioItems)
        throw error
      }

      setPortfolioItems(prevItems => prevItems.map(item => item.id === data.id ? data : item))
    } catch (error: any) {
      console.error("Error updating portfolio item:", error.message)
      alert('Failed to update portfolio item: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPortfolio = async () => {
    if (!editingPortfolio || !portfolioTitle.trim()) return

    setLoading(true)
    try {
      const updatedItem = {
        ...editingPortfolio,
        title: portfolioTitle,
        description: portfolioDescription || null,
        image_url: portfolioImageUrl || null,
        project_url: portfolioProjectUrl || null,
      }
      await handleUpdatePortfolio(updatedItem)
      cancelPortfolioEdit()
    } catch (error: any) {
      console.error("Error updating portfolio item:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePortfolio = async (id: string) => {
    setLoading(true)
    try {
      // Find the item to get the image URL before deleting
      const itemToDelete = portfolioItems.find(item => item.id === id)
      
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id)

      if (error) throw error

      // Delete the associated image if it exists
      if (itemToDelete?.image_url) {
        await deletePortfolioImage(itemToDelete.image_url)
      }

      setPortfolioItems(portfolioItems.filter(item => item.id !== id))
    } catch (error: any) {
      console.error("Error deleting portfolio item:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const startEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolio(item)
    setPortfolioTitle(item.title)
    setPortfolioDescription(item.description || "")
    setPortfolioImageUrl(item.image_url || "")
    setPortfolioProjectUrl(item.project_url || "")
    setShowAddPortfolio(true)
  }

  const cancelPortfolioEdit = () => {
    setEditingPortfolio(null)
    setPortfolioTitle("")
    setPortfolioDescription("")
    setPortfolioImageUrl("")
    setPortfolioProjectUrl("")
    setShowAddPortfolio(false)
  }

  // Don't render until after mount to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-end">
          <div className="flex items-center gap-4">
            <BuyMeCoffeeButton />
            {username && (
              <Link href={`/${username}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Customize your profile information and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-[200px_1fr] gap-6">
                <div>
                  <ProfilePhotoUpload
                    userId={user.id}
                    currentPhotoUrl={profile?.avatar_url}
                    onUpdate={(url) => {
                      if (profile) {
                        profile.avatar_url = url
                      }
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="your-username"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your profile will be available at /{username}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about yourself..."
                  className="min-h-[100px]"
                />
              </div>
              
              {/* Section Toggles */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs text-muted-foreground font-medium px-3">SECTIONS</span>
                  <div className="h-px bg-border flex-1" />
                </div>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        <Label htmlFor="show-links" className="font-medium">Links Section</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Show the links section on your public profile
                      </p>
                    </div>
                    <Switch
                      id="show-links"
                      checked={showLinks}
                      onCheckedChange={(value) => {
                        setShowLinks(value)
                        handleSectionToggleUpdate('show_links', value)
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <Label htmlFor="show-portfolio" className="font-medium">Portfolio Section</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Show the portfolio section on your public profile
                      </p>
                    </div>
                    <Switch
                      id="show-portfolio"
                      checked={showPortfolio}
                      onCheckedChange={(value) => {
                        setShowPortfolio(value)
                        handleSectionToggleUpdate('show_portfolio', value)
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Links Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Your Links
                  </CardTitle>
                  <CardDescription>
                    Add and organize your important links
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowAddLink(true)}
                  disabled={showAddLink}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add/Edit Link Form */}
              {showAddLink && (
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {editingLink ? (
                            <>
                              <Settings className="h-5 w-5" />
                              Edit Link
                            </>
                          ) : (
                            <>
                              <Plus className="h-5 w-5" />
                              Add New Link
                            </>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {editingLink 
                            ? "Update your link details and customization"
                            : "Create a new link with custom icon and color"
                          }
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={cancelEdit}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Link Details */}
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="link-title" className="text-sm font-medium">
                            Link Title
                          </Label>
                          <Input
                            id="link-title"
                            value={linkTitle}
                            onChange={(e) => setLinkTitle(e.target.value)}
                            placeholder="e.g., My Portfolio, GitHub, LinkedIn..."
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="link-url" className="text-sm font-medium">
                            URL
                          </Label>
                          <Input
                            id="link-url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Customization */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-border flex-1" />
                        <span className="text-xs text-muted-foreground font-medium px-3">CUSTOMIZATION</span>
                        <div className="h-px bg-border flex-1" />
                      </div>
                      
                      <div className="flex items-start gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Icon</Label>
                          <div className="flex items-center gap-3">
                            <IconPicker
                              selectedIcon={linkIcon}
                              onChange={setLinkIcon}
                            />
                            <span className="text-xs text-muted-foreground">
                              Choose an icon that represents your link
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Color Theme</Label>
                          <div className="flex items-center gap-3">
                            <ColorPicker
                              selectedColor={linkColor as any}
                              onChange={setLinkColor}
                            />
                            <span className="text-xs text-muted-foreground">
                              Pick a color that matches your brand
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    {(linkTitle.trim() || linkUrl.trim()) && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs text-muted-foreground font-medium px-3">PREVIEW</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <div className="p-4 bg-background/50 rounded-lg border">
                          <LinkCard
                            link={{
                              id: "preview",
                              user_id: "",
                              title: linkTitle || "Link Title",
                              url: linkUrl || "https://example.com",
                              icon: linkIcon,
                              color: linkColor,
                              position: 0,
                              created_at: new Date().toISOString(),
                            }}
                            className="pointer-events-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">
                        {!linkTitle.trim() || !linkUrl.trim() ? (
                          "Please fill in both title and URL to continue"
                        ) : (
                          "Ready to save your link!"
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={cancelEdit}
                          className="min-w-[80px]"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={editingLink ? handleEditLink : handleAddLink}
                          disabled={loading || !linkTitle.trim() || !linkUrl.trim()}
                          className="min-w-[120px]"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Saving...
                            </>
                          ) : editingLink ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Update Link
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Links List */}
              {links.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links.map(link => link.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {links.map((link) => (
                        <SortableLink
                          key={link.id}
                          link={link}
                          onEdit={startEditLink}
                          onDelete={handleDeleteLink}
                          isBeingEdited={editingLink?.id === link.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No links added yet. Click &quot;Add Link&quot; to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Management */}
          {showPortfolio && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Your Portfolio
                    </CardTitle>
                    <CardDescription>
                      Showcase your projects and work
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAddPortfolio(true)}
                    disabled={showAddPortfolio}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add/Edit Portfolio Form */}
                {showAddPortfolio && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {editingPortfolio ? (
                              <>
                                <Settings className="h-5 w-5" />
                                Edit Project
                              </>
                            ) : (
                              <>
                                <Plus className="h-5 w-5" />
                                Add New Project
                              </>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {editingPortfolio 
                              ? "Update your project details"
                              : "Add a new project to your portfolio"
                            }
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={cancelPortfolioEdit}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="portfolio-title" className="text-sm font-medium">
                            Project Title
                          </Label>
                          <Input
                            id="portfolio-title"
                            value={portfolioTitle}
                            onChange={(e) => setPortfolioTitle(e.target.value)}
                            placeholder="e.g., My Amazing App, Website Redesign..."
                            className="h-10"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="portfolio-description" className="text-sm font-medium">
                            Description
                          </Label>
                          <Textarea
                            id="portfolio-description"
                            value={portfolioDescription}
                            onChange={(e) => setPortfolioDescription(e.target.value)}
                            placeholder="Describe your project, technologies used, challenges solved..."
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <PortfolioImageUpload
                              userId={user.id}
                              currentImageUrl={portfolioImageUrl}
                              onImageUpdate={(url) => setPortfolioImageUrl(url || "")}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="portfolio-url" className="text-sm font-medium">
                              Project URL (Optional)
                            </Label>
                            <Input
                              id="portfolio-url"
                              value={portfolioProjectUrl}
                              onChange={(e) => setPortfolioProjectUrl(e.target.value)}
                              placeholder="https://your-project.com"
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      {portfolioTitle.trim() && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-px bg-border flex-1" />
                            <span className="text-xs text-muted-foreground font-medium px-3">PREVIEW</span>
                            <div className="h-px bg-border flex-1" />
                          </div>
                          <div className="flex justify-center">
                            <div className="w-full max-w-md">
                              <PortfolioCard
                                item={{
                                  id: "preview",
                                  user_id: "",
                                  title: portfolioTitle || "Project Title",
                                  description: portfolioDescription || null,
                                  image_url: portfolioImageUrl || null,
                                  project_url: portfolioProjectUrl || null,
                                  position: 0,
                                  created_at: new Date().toISOString(),
                                }}
                                className="pointer-events-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                          {!portfolioTitle.trim() ? (
                            "Please add a project title to continue"
                          ) : (
                            "Ready to save your project!"
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={cancelPortfolioEdit}
                            className="min-w-[80px]"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={editingPortfolio ? handleEditPortfolio : handleAddPortfolio}
                            disabled={loading || !portfolioTitle.trim()}
                            className="min-w-[120px]"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Saving...
                              </>
                            ) : editingPortfolio ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Update Project
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Project
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Portfolio Grid */}
                {portfolioItems.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="relative group max-w-md mx-auto w-full">
                        <PortfolioCard
                          item={item}
                          onEdit={startEditPortfolio}
                          showControls={true}
                          isBeingEdited={editingPortfolio?.id === item.id}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-16 w-16 mx-auto mb-6 opacity-50" />
                    <p className="text-lg font-medium mb-2">No projects added yet</p>
                    <p className="text-sm">Click &quot;Add Project&quot; to showcase your work!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
