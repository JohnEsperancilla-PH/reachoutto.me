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
import LinkCard from "@/components/link-card"
import { IconPicker } from "@/components/icon-picker"
import { ColorPicker } from "@/components/color-picker"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
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
  Check
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as AuthUser } from "@supabase/supabase-js"
import type { User, Link as LinkType } from "@/lib/types/database"
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
}

export default function DashboardClient({ user, profile, initialLinks }: DashboardClientProps) {
  const [mounted, setMounted] = React.useState(false)
  const [links, setLinks] = React.useState<LinkType[]>([])
  const [username, setUsername] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [editingLink, setEditingLink] = React.useState<LinkType | null>(null)
  const [linkTitle, setLinkTitle] = React.useState("")
  const [linkUrl, setLinkUrl] = React.useState("")
  const [linkIcon, setLinkIcon] = React.useState("Link")
  const [linkColor, setLinkColor] = React.useState("default")
  const [showAddLink, setShowAddLink] = React.useState(false)

  // Initialize state after mount to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
    setLinks(initialLinks)
    setUsername(profile?.username || "")
    setBio(profile?.bio || "")
  }, [initialLinks, profile])
  
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
        </div>
      </main>
    </div>
  )
}
