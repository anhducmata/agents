"use client"
import { MoreHorizontal, Edit, Copy, Trash2, MessageSquare, Mic, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Bot } from "lucide-react"

// Update the BentoItem interface to include model
interface BentoItem {
  title: string
  description: string
  avatarSrc?: string
  status?: string
  tags?: string[]
  meta?: string
  conversationCount?: number
  language?: string
  tone?: string
  voice?: string
  model?: string
  updatedAt?: Date
  version?: string
  originalData?: any
}

interface BentoGridProps {
  items: BentoItem[]
  onItemClick?: (index: number) => void
  onItemAction?: (index: number, action: string) => void
}

export default function BentoGrid({ items, onItemClick, onItemAction }: BentoGridProps) {
  const getLanguageFlag = (language: string) => {
    if (language?.includes("vi")) return "🇻🇳"
    if (language?.includes("en-US")) return "🇺🇸"
    if (language?.includes("en-GB")) return "🇬🇧"
    if (language?.includes("es")) return "🇪🇸"
    if (language?.includes("fr")) return "🇫🇷"
    if (language?.includes("de")) return "🇩🇪"
    if (language?.includes("ja")) return "🇯🇵"
    if (language?.includes("zh")) return "🇨🇳"
    if (language?.includes("pt")) return "🇵🇹"
    return "🌐"
  }

  const getStatusColor = (status: string) => {
    if (status === "Prod") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    if (status === "Dev") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    if (status === "Beta") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}d ago`

    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}mo ago`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="group relative p-6 rounded-xl overflow-hidden transition-all duration-300 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 hover:shadow-md"
        >
          {/* Add the background pattern div */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />

          {/* Add a border glow effect on hover */}
          <div className="absolute inset-0 -z-10 rounded-xl p-px bg-linear-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {item.avatarSrc ? (
                    <Image
                      src={item.avatarSrc || "/placeholder.svg"}
                      alt={item.title}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center">🤖</div>
                  )}
                </div>
                {item.conversationCount !== undefined && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{item.conversationCount}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onItemAction && onItemAction(index, "edit")}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onItemAction && onItemAction(index, "duplicate")}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onItemAction && onItemAction(index, "delete")}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2 cursor-pointer" onClick={() => onItemClick && onItemClick(index)}>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{item.title}</h3>

              {item.language && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-1">{getLanguageFlag(item.language)}</span>
                  <span>
                    {item.language === "vi"
                      ? "Vietnamese"
                      : item.language === "en-US"
                        ? "English (US)"
                        : item.language === "en-GB"
                          ? "English (UK)"
                          : item.language === "es"
                            ? "Spanish"
                            : item.language === "fr"
                              ? "French"
                              : item.language === "de"
                                ? "German"
                                : item.language === "ja"
                                  ? "Japanese"
                                  : item.language === "zh"
                                    ? "Chinese"
                                    : item.language === "pt"
                                      ? "Portuguese"
                                      : item.language}
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
            </div>

            {/* Info Block for Tone and Voice */}
            <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 grid grid-cols-2 gap-2">
              {item.tone && (
                <div className="flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Tone: <span className="font-medium">{item.tone}</span>
                  </span>
                </div>
              )}
              {item.voice && (
                <div className="flex items-center">
                  <Mic className="h-3 w-3 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Voice: <span className="font-medium">{item.voice}</span>
                  </span>
                </div>
              )}
              {item.model && (
                <div className="flex items-center col-span-2 mt-1">
                  <Bot className="h-3 w-3 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Model: <span className="font-medium">{item.model}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Tags (limit to 3) */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] font-normal px-1.5 py-0.5">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Version and Updated Time */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
              {item.version && <span>v{item.version}</span>}
              {item.updatedAt && <span>{formatTimeAgo(item.updatedAt)}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
