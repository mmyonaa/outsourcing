import type { Directive } from 'vue';

/**
 * v-reveal — 스크롤 진입 시 fade-up 리빌 애니메이션.
 *
 * 사용:
 *   <section v-reveal>            → 뷰포트 진입 시 한 번 fade-up
 *   <div v-reveal="index * 60">   → ms 단위 지연(카드 스태거)
 *
 * - IntersectionObserver 인스턴스 하나를 전역 공유하고, 리빌 후 unobserve.
 * - prefers-reduced-motion 이거나 IO 미지원 환경에서는 아무 것도 하지 않음(즉시 표시).
 */

let observer: IntersectionObserver | null = null;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getObserver = () => {
  if (!observer) {
    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            observer?.unobserve(entry.target);
          }
        }
      },
      // 살짝 들어왔을 때(하단 40px 여유) 발동
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
  }
  return observer;
};

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;

    el.classList.add('reveal-init');
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`;
    getObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
  // SSG/SSR 렌더 시에는 아무 속성도 추가하지 않음
  getSSRProps() {
    return {};
  },
};
