'use client';

import { useEffect } from 'react';

/**
 * Keeps scatter-chart labels off each other.
 *
 * Every quadrant in the output packs positions a dot at `left: x%, top: y%`
 * and centres its label directly underneath. When points cluster — four
 * leadership roles in one corner of the stakeholder map, two small peers
 * stacked at the bottom of the benchmark quadrant — those labels overlap and
 * the chart stops being readable.
 *
 * The separation is done here rather than in the view model because it depends
 * on rendered geometry: the panels are a fixed height but their width follows
 * the grid column and the viewport, and the label height depends on where the
 * text wraps. Guessing those produces a layout that is right at one width and
 * wrong at every other, so the labels are measured after paint instead.
 *
 * Each label is nudged vertically — below its dot first, then above, then a
 * label-height further out each way — until it clears the ones already placed.
 * Offsets stay small, so a label never drifts far enough from its dot to break
 * the association.
 */
export function usePlotLabels(): void {
  useEffect(() => {
    const run = () => layoutAll();

    /* after paint, so the first measurement sees final geometry */
    const raf = requestAnimationFrame(run);

    const observer = new ResizeObserver(run);
    plotContainers().forEach((el) => observer.observe(el));
    window.addEventListener('resize', run);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', run);
    };
  });
}

/** Gap left between two labels that had to be separated. */
const GAP = 3;
/** How many label-heights a label may be pushed before it gives up. */
const MAX_STEPS = 5;

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function plotContainers(): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-plot-point]').forEach((point) => {
    const parent = point.parentElement;
    if (parent) seen.add(parent);
  });
  return [...seen];
}

function layoutAll(): void {
  plotContainers().forEach(layoutContainer);
}

function layoutContainer(container: HTMLElement): void {
  const points = [...container.querySelectorAll<HTMLElement>(':scope > [data-plot-point]')];
  if (points.length < 2) return;

  const labels = points
    .map((point) => point.lastElementChild as HTMLElement | null)
    .filter((el): el is HTMLElement => !!el && el !== el.parentElement?.firstElementChild);
  if (labels.length < 2) return;

  /* start from the untouched layout so a re-run is not cumulative */
  labels.forEach((label) => {
    label.style.transform = '';
  });

  const bounds = container.getBoundingClientRect();
  const relative = (el: Element): Box => {
    const r = el.getBoundingClientRect();
    return { left: r.left - bounds.left, top: r.top - bounds.top, right: r.right - bounds.left, bottom: r.bottom - bounds.top };
  };

  /*
   * A label must clear the dots as well as the other labels, and the quadrant
   * captions sitting in the corners. The centre rules are skipped: they carry
   * no text, and forbidding a label from crossing one would over-constrain a
   * chart whose points sit near the middle.
   */
  const obstacles: Box[] = [
    ...points.map((point) => point.firstElementChild).filter((el): el is Element => !!el).map(relative),
    ...[...container.children]
      .filter((el) => !(el as HTMLElement).hasAttribute('data-plot-point') && (el.textContent ?? '').trim() !== '')
      .map(relative),
  ];
  const measured = labels
    .map((label) => ({ label, natural: relative(label), height: label.getBoundingClientRect().height }))
    .sort((a, b) => a.natural.top - b.natural.top);

  const placed: Box[] = [];

  for (const item of measured) {
    const step = item.height + GAP;
    /* below (as authored), then above the dot, then further out each way */
    const offsets: number[] = [0];
    for (let i = 1; i <= MAX_STEPS; i++) {
      offsets.push(-(item.height + step * (i - 1) + GAP * 4));
      offsets.push(step * i);
      offsets.push(step * i - step / 2);
    }

    /*
     * Score every candidate rather than taking the first clear one and giving
     * up otherwise: on a crowded chart there may be no free slot, and falling
     * back to the authored position is the one placement guaranteed to clash.
     * The least-overlapping spot, nearest the dot, is always better.
     */
    let chosen = 0;
    let best = Infinity;
    for (const dy of offsets) {
      const box = shift(item.natural, dy);
      if (box.top < 0 || box.bottom > bounds.height) continue;
      const collision =
        placed.reduce((n, other) => n + overlapArea(box, other), 0) +
        obstacles.reduce((n, other) => n + overlapArea(box, other), 0);
      const score = collision * 100 + Math.abs(dy);
      if (score < best) {
        best = score;
        chosen = dy;
        if (collision === 0) break;
      }
    }

    placed.push(shift(item.natural, chosen));
    item.label.style.transform = chosen ? `translateY(${Math.round(chosen)}px)` : '';
  }
}

const shift = (box: Box, dy: number): Box => ({ ...box, top: box.top + dy, bottom: box.bottom + dy });

/** How much of two boxes overlap, in square pixels. */
function overlapArea(a: Box, b: Box): number {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? w * h : 0;
}
