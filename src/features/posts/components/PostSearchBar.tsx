import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
}

const SEARCH_TYPES: { value: SearchType; label: string }[] = [
  { value: 'TITLE_CONTENT', label: '제목+내용' },
  { value: 'TITLE', label: '제목' },
  { value: 'CONTENT', label: '내용' },
  { value: 'NICKNAME', label: '작성자' },
];

export function PostSearchBar({ onSearch }: PostSearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('TITLE_CONTENT');
  const debouncedKeyword = useDebounce(keyword);

  useEffect(() => {
    onSearch(debouncedKeyword, searchType);
  }, [debouncedKeyword, searchType, onSearch]);

  return (
    <div className="flex gap-2">
      <Select value={searchType} onValueChange={(v: SearchType) => setSearchType(v)}>
        <SelectTrigger className="w-[130px]">
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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="pl-9"
        />
      </div>
    </div>
  );
}
