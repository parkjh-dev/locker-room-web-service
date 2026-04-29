import { Link, useSearchParams } from 'react-router-dom';
import { HelpCircle, MessageCircleQuestion, GitPullRequestArrow, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InquiryList } from '@/features/inquiries/components/InquiryList';
import { RequestList } from '@/features/requests/components/RequestList';

type SupportTab = 'inquiries' | 'requests';

const VALID_TABS: SupportTab[] = ['inquiries', 'requests'];

function isValidTab(value: string | null): value is SupportTab {
  return value !== null && (VALID_TABS as string[]).includes(value);
}

export default function SupportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab: SupportTab = isValidTab(tabParam) ? tabParam : 'inquiries';

  const handleTabChange = (next: string) => {
    setSearchParams({ tab: next }, { replace: true });
  };

  const createConfig =
    tab === 'inquiries'
      ? { to: '/inquiries/new', label: '문의하기' }
      : { to: '/requests/new', label: '요청하기' };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold">고객센터</h1>
        </div>
        <Button size="sm" asChild>
          <Link to={createConfig.to}>
            <Plus className="mr-1 h-4 w-4" />
            {createConfig.label}
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid">
          <TabsTrigger value="inquiries" className="gap-1.5">
            <MessageCircleQuestion className="h-4 w-4" />
            1:1 문의
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-1.5">
            <GitPullRequestArrow className="h-4 w-4" />
            종목·구단 요청
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inquiries" className="mt-4">
          <InquiryList />
        </TabsContent>
        <TabsContent value="requests" className="mt-4">
          <RequestList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
