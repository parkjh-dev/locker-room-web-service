import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

interface SsoButtonsProps {
  returnUrl?: string;
}

export function SsoButtons({ returnUrl }: SsoButtonsProps) {
  const { login } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" className="w-full" onClick={() => login('google', returnUrl)}>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt=""
          className="mr-2 h-5 w-5"
        />
        Google로 계속하기
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90"
        onClick={() => login('kakao', returnUrl)}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.61 1.74 4.91 4.36 6.22-.14.53-.9 3.4-.93 3.6 0 0-.02.17.09.23.11.07.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.63.09 1.28.14 1.96.14 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
        </svg>
        Kakao로 계속하기
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-[#03C75A] text-white hover:bg-[#03C75A]/90"
        onClick={() => login('naver', returnUrl)}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.27 3H7.73A4.73 4.73 0 003 7.73v8.54A4.73 4.73 0 007.73 21h8.54A4.73 4.73 0 0021 16.27V7.73A4.73 4.73 0 0016.27 3zm.46 12.6l-3.27-4.74v4.74h-2.92V8.4h2.92l3.27 4.74V8.4h2.92v7.2h-2.92z" />
        </svg>
        Naver로 계속하기
      </Button>
    </div>
  );
}
