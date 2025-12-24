import LogoSvg from '@/assets/logo.svg';

export function Logo({ width = 32, height = 34}: { width?: number, height?: number }) {
  return <img src={LogoSvg} width={width} height={height} alt="Logo" />;
}