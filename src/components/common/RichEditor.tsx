import { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import { SpoilerMark } from './spoilerMark';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<ApiResponse<{ url: string }>>('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.url;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        'h-8 w-8 p-0',
        active && 'bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-700',
      )}
    >
      {children}
    </Button>
  );
}

function Toolbar({
  editor,
  uploading,
  onUploadClick,
  onLinkClick,
}: {
  editor: Editor;
  uploading: boolean;
  onUploadClick: () => void;
  onLinkClick: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-100/70 bg-brand-50/30 px-2 py-1.5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        ariaLabel="굵게"
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        ariaLabel="기울임"
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        ariaLabel="취소선"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-brand-200" aria-hidden="true" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        ariaLabel="글머리 기호"
      >
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        ariaLabel="번호 매기기"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        ariaLabel="인용"
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-brand-200" aria-hidden="true" />

      <ToolbarButton onClick={onLinkClick} active={editor.isActive('link')} ariaLabel="링크">
        <LinkIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSpoiler().run()}
        active={editor.isActive('spoiler')}
        ariaLabel="스포일러"
      >
        <EyeOff className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={onUploadClick} disabled={uploading} ariaLabel="이미지 추가">
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImageIcon className="h-3.5 w-3.5" />
        )}
      </ToolbarButton>
    </div>
  );
}

export function RichEditor({ value, onChange, placeholder, className }: RichEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full h-auto my-3' },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-brand-700 underline underline-offset-2 hover:text-brand-800',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({ placeholder: placeholder ?? '내용을 입력하세요' }),
      SpoilerMark,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none min-h-[260px] px-4 py-3',
          'prose-p:my-2 prose-headings:font-bold',
          '[&_p.is-editor-empty:first-child]:before:text-muted-foreground',
          '[&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]',
          '[&_p.is-editor-empty:first-child]:before:float-left',
          '[&_p.is-editor-empty:first-child]:before:pointer-events-none',
          '[&_p.is-editor-empty:first-child]:before:h-0',
        ),
      },
      handleDrop: (_view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (file && IMAGE_TYPES.includes(file.type)) {
          event.preventDefault();
          void handleFileUpload(file);
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const file = event.clipboardData?.files?.[0];
        if (file && IMAGE_TYPES.includes(file.type)) {
          event.preventDefault();
          void handleFileUpload(file);
          return true;
        }
        return false;
      },
    },
  });

  // 외부 value 변경 시(예: 폼 reset) 에디터 콘텐츠 동기화
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (!IMAGE_TYPES.includes(file.type)) {
        toast.error('이미지 파일만 추가할 수 있어요. (jpg, png, gif, webp)');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error('이미지 크기는 10MB 이하여야 합니다.');
        return;
      }
      if (uploadingRef.current) return;
      uploadingRef.current = true;
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch {
        toast.error('이미지 업로드에 실패했습니다.');
      } finally {
        uploadingRef.current = false;
      }
    },
    [editor],
  );

  const handleLinkClick = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL', previousUrl ?? 'https://');
    if (url === null) return; // 취소
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-input bg-background focus-within:border-brand-300 focus-within:ring-1 focus-within:ring-brand-300',
        className,
      )}
    >
      <Toolbar
        editor={editor}
        uploading={uploadingRef.current}
        onUploadClick={() => inputRef.current?.click()}
        onLinkClick={handleLinkClick}
      />
      <EditorContent editor={editor} />
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) void handleFileUpload(file);
        }}
      />
    </div>
  );
}
