"use client"

import { useState } from "react"

export interface Tag {
  id: string
  label: string
}

interface UseTagsProps {
  onChange?: (tags: Tag[]) => void
  defaultTags?: Tag[]
  maxTags?: number
}

export function useTags({ onChange, defaultTags = [], maxTags = 20 }: UseTagsProps = {}) {
  const [tags, setTags] = useState<Tag[]>(defaultTags)

  function addTag(tag: Tag) {
    if (tags.length >= maxTags) return
    if (tags.some((t) => t.id === tag.id)) return

    const newTags = [...tags, tag]
    setTags(newTags)
    onChange?.(newTags)
    return newTags
  }

  function removeTag(tagId: string) {
    const newTags = tags.filter((t) => t.id !== tagId)
    setTags(newTags)
    onChange?.(newTags)
    return newTags
  }

  function removeLastTag() {
    if (tags.length === 0) return
    return removeTag(tags[tags.length - 1].id)
  }

  return {
    tags,
    setTags,
    addTag,
    removeTag,
    removeLastTag,
    hasReachedMax: tags.length >= maxTags,
  }
}
