import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

interface SsoButtonsProps {
  returnUrl?: string;
}

export function SsoButtons({ returnUrl }: SsoButtonsProps) {
  const { login } = useAuth();

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Google: 밝은 테마 — 흰색 배경, #747775 테두리, #1F1F1F 텍스트, 공식 컬러 G 로고 */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-[#747775] bg-white text-[#1F1F1F] hover:bg-gray-50"
        onClick={() => login('google', returnUrl)}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google로 로그인
      </Button>

      {/* Kakao: #FEE500 배경, 검정 심볼, rgba(0,0,0,0.85) 텍스트, 12px radius */}
      <Button
        type="button"
        className="w-full border-0 bg-[#FEE500] text-[rgba(0,0,0,0.85)] hover:bg-[#FEE500]/90"
        onClick={() => login('kakao', returnUrl)}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="#000000">
          <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.61 1.74 4.91 4.36 6.22-.14.53-.9 3.4-.93 3.6 0 0-.02.17.09.23.11.07.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.63.09 1.28.14 1.96.14 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
        </svg>
        카카오 로그인
      </Button>

      {/* Naver: #03C75A 배경, 흰색 텍스트, 공식 N 심볼 */}
      <Button
        type="button"
        className="w-full border-0 bg-[#03C75A] text-white hover:bg-[#03C75A]/90"
        onClick={() => login('naver', returnUrl)}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.5 10.8L6.3 1H1v18h5.5V9.2L13.7 19H19V1h-5.5v9.8z" />
        </svg>
        네이버로 로그인
      </Button>
    </div>
  );
}
