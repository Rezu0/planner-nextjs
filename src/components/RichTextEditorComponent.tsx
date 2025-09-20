"use client"

import {  EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Strikethrough, Heading1 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Underline from "@tiptap/extension-underline"
import Heading from "@tiptap/extension-heading"
import { useEffect } from "react"

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }), 
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline
    ],
    content: value || "<p className='opacity-50'>Type your description or something else here...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p className='opacity-50'>Type your description or something else here...</p>");
    }
  }, [value, editor]);

  if (!editor) return null

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-center md:justify-start gap-2 border rounded-lg bg-white p-2 shadow-sm">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("strike") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("underline") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="border rounded-lg bg-white px-3 shadow-sm hover:cursor-text w-full">
        <div className="w-full h-[250px] overflow-y-auto">
          <EditorContent 
            editor={editor} 
            className="prose max-w-none
                [&_ul]:list-disc 
                [&_ol]:list-decimal 
                [&_li]:ml-4 
                outline-none 
                border-none 
                focus:outline-none 
                focus:ring-0 
                focus:border-none 
                [&.ProseMirror-focused]:outline-none 
                [&.ProseMirror-focused]:ring-0 
                [&.ProseMirror-focused]:border-none"
          />
        </div>
      </div>
    </div>
  )
}
