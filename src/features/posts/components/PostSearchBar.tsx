import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import type { SearchParams } from '@/types/api';

type SearchType = NonNullable<SearchParams['searchType']>;

interface PostSearchBarProps {
  onSearch: (keyword: string, searchType: SearchType) => void;
  initialKeyword?: string;
}

const SEARCH_TYPES: { value: SearchType; label: string }[] = [
  { value: 'TITLE_CONTENT', label: '제목+내용' },
  { value: 'TITLE', label: '제목' },
  { value: 'CONTENT', label: '내용' },
  { value: 'NICKNAME', label: '작성자' },
];

export function PostSearchBar({ onSearch, initialKeyword }: PostSearchBarProps) {
  const [keyword, setKeyword] = useState(initialKeyword || '');
  const [searchType, setSearchType] = useState<SearchType>('TITLE_CONTENT');
  const debouncedKeyword = useDebounce(keyword);

  useEffect(() => {
    onSearch(debouncedKeyword, searchType);
  }, [debouncedKeyword, searchType, onSearch]);

  return (
    <div className="flex gap-2">
      <Select value={searchType} onValueChange={(v: SearchType) => setSearchType(v)}>
        <SelectTrigger className="w-[130px] rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SEARCH_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="라커룸 검색어를 입력하세요"
          className="rounded-lg pl-9 pr-9"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword('')}
            aria-label="검색어 지우기"
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
