// 클래스네임을 합치는 유틸리티 (옵션)
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}