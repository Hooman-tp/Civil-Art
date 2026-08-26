"use client";

import { useEffect, useRef } from "react";

/**
 * موتور «اسکرول به پیشرفت» — همون تکنیکی که برای اسکرابِ ویدیوی
 * هیرو (CinematicConstruction.tsx) ساخته و تست شد، اینجا به یک هوک
 * قابل‌استفاده‌ی مجدد تبدیل شده:
 *
 * - هر فریم، موقعیت واقعیِ رندرشده‌ی wrapper رو با getBoundingClientRect
 *   می‌خونه (نه رویداد scroll) — یعنی مستقل از اینکه Lenis چطور
 *   اسکرول رو شبیه‌سازی می‌کنه، همیشه موقعیت واقعی رو منعکس می‌کنه.
 * - یک exponential smoothing مستقل از فریم‌ریت (بر پایه‌ی dt واقعی)
 *   روی مقدار خام اعمال می‌شه تا حرکت نرم باشه، نه پرشی.
 * - خروجی از طریق useState نیست (که باعث re-render در هر فریم می‌شه)،
 *   بلکه با فراخوانیِ callback مستقیم به مصرف‌کننده داده می‌شه؛
 *   مصرف‌کننده (مثلاً یک صحنه‌ی Three.js یا استایلِ DOM) خودش تصمیم
 *   می‌گیره چطور این عدد رو اعمال کنه، بدون فشار به React reconciler.
 *
 * @param wrapperRef المانی که ارتفاعش «مسیر اسکرول» رو تعریف می‌کنه (مثلاً height: 400vh)
 * @param onProgress هر فریم با پیشرفتِ نرم‌شده (۰ تا ۱) صدا زده می‌شه
 * @param smoothingTau ثابت زمانیِ نرم‌سازی؛ عدد کوچیک‌تر = واکنشی‌تر
 */
export function useScrollProgress(
  wrapperRef: React.RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  smoothingTau = 0.18
) {
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let rafId: number | null = null;
    let lastTs: number | null = null;
    let displayed = 0;
    let hasSynced = false;

    const getRawProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      const scrolled = -rect.top;
      return Math.max(0, Math.min(1, scrolled / total));
    };

    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick);

      if (lastTs === null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const target = getRawProgress();

      if (!hasSynced) {
        displayed = target;
        hasSynced = true;
      } else {
        const alpha = 1 - Math.exp(-dt / smoothingTau);
        displayed += (target - displayed) * alpha;
      }

      onProgressRef.current(displayed);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef, smoothingTau]);
}
