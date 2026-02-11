"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import FadeInSection from "./fade-in-section";

interface BusinessDay {
  date: string;
  status: string;
  note: string;
}

function normalizeDate(dateValue: string | number | Date | null | undefined): string {
  if (!dateValue && dateValue !== 0) return "";

  if (typeof dateValue === "string" && dateValue.startsWith("Date(")) {
    const match = dateValue.match(/Date\((\d+),(\d+),(\d+)\)/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);
      const date = new Date(year, month, day);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
  }

  if (typeof dateValue === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + (dateValue - 1) * 86400 * 1000);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  if (typeof dateValue === "string") {
    const normalized = dateValue.replace(/\//g, "-");
    const parts = normalized.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-${String(parseInt(parts[1], 10)).padStart(2, "0")}-${String(parseInt(parts[2], 10)).padStart(2, "0")}`;
    }
    return normalized;
  }

  if (dateValue instanceof Date) {
    return `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, "0")}-${String(dateValue.getDate()).padStart(2, "0")}`;
  }

  return "";
}

async function loadBusinessDays(): Promise<BusinessDay[]> {
  try {
    const SPREADSHEET_ID = "1BRHncUHIE9c4YZrq6Sa6oyaFULAd5uPE5GDNMIIc7Kg";
    const SHEET_NAME = "business_days";
    const encodedSheetName = encodeURIComponent(SHEET_NAME);
    let url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodedSheetName}`;

    let response = await fetch(url);
    if (!response.ok) {
      url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
      response = await fetch(url);
    }
    if (!response.ok) return [];

    const text = await response.text();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd === 0) return [];

    const json = JSON.parse(text.substring(jsonStart, jsonEnd));

    return json.table.rows
      .map((row: { c: Array<{ v: string | number | Date | null | undefined }> }) => {
        const dateValue = row.c[0]?.v;
        const statusValue = (row.c[1]?.v as string) || "";
        const noteValue = (row.c[2]?.v as string) || "";
        const dateString = normalizeDate(dateValue);
        return {
          date: dateString,
          status: (statusValue as string).toLowerCase().trim(),
          note: noteValue,
        };
      })
      .filter((item: BusinessDay) => item.date && item.status);
  } catch {
    return [];
  }
}

const MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarSection() {
  const [businessDays, setBusinessDays] = useState<BusinessDay[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadBusinessDays().then(setBusinessDays);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const isOpenDay = useCallback(
    (date: Date): boolean => {
      const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const dayData = businessDays.find((item) => item.date === ds);
      return dayData ? dayData.status === "open" : false;
    },
    [businessDays]
  );

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  // Canvas rendering for download
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 1080, h = 1080;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const padding = 120;
    const titleY = padding + 50;
    ctx.fillStyle = "#111827";
    ctx.font = "300 52px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`${year}年${MONTH_NAMES[month]}`, w / 2, titleY);

    const gridTop = titleY + 160;
    const gridBottom = h - padding - 140;
    const gridHeight = gridBottom - gridTop;
    const cellWidth = (w - padding * 2) / 7;
    const cellHeight = gridHeight / 6;
    const gap = 8;
    const gridStartX = padding;
    const cellSize = cellWidth - gap;

    const headerY = gridTop - 10;
    ctx.font = "300 30px sans-serif";
    ctx.fillStyle = "#6b7280";
    WEEK_DAYS.forEach((day, index) => {
      const x = gridStartX + index * (cellWidth + gap) + cellSize / 2;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(day, x, headerY);
    });

    function roundRect(
      cx: CanvasRenderingContext2D,
      rx: number,
      ry: number,
      rw: number,
      rh: number,
      r: number
    ) {
      cx.beginPath();
      cx.moveTo(rx + r, ry);
      cx.lineTo(rx + rw - r, ry);
      cx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
      cx.lineTo(rx + rw, ry + rh - r);
      cx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
      cx.lineTo(rx + r, ry + rh);
      cx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
      cx.lineTo(rx, ry + r);
      cx.quadraticCurveTo(rx, ry, rx + r, ry);
      cx.closePath();
    }

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const isCurrentMonth = date.getMonth() === month;
      const isOpen = isCurrentMonth && isOpenDay(date);
      const col = i % 7;
      const row = Math.floor(i / 7);
      const x = gridStartX + col * (cellWidth + gap);
      const y = gridTop + row * (cellHeight + gap);
      const ch = cellHeight - gap;
      const cr = 8;

      if (isCurrentMonth) {
        if (isOpen) {
          ctx.fillStyle = "#1f2937";
          roundRect(ctx, x, y, cellSize, ch, cr);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "500 36px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(date.getDate().toString(), x + cellSize / 2, y + ch / 2 - 14);
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.font = "20px sans-serif";
          ctx.fillText("\u25CF", x + cellSize / 2, y + ch / 2 + 20);
        } else {
          ctx.fillStyle = "#f3f4f6";
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 1;
          roundRect(ctx, x, y, cellSize, ch, cr);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#4b5563";
          ctx.font = "500 36px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(date.getDate().toString(), x + cellSize / 2, y + ch / 2 - 14);
          ctx.fillStyle = "rgba(107,114,128,0.6)";
          ctx.font = "20px sans-serif";
          ctx.fillText("-", x + cellSize / 2, y + ch / 2 + 20);
        }
      } else {
        ctx.fillStyle = "#d1d5db";
        ctx.font = "400 32px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(date.getDate().toString(), x + cellSize / 2, y + ch / 2);
      }
    }

    // Legend
    const legendY = gridBottom + 80;
    const legendSpacing = 200;
    const legend1X = w / 2 - legendSpacing;
    const legendBoxSize = 28;
    const legendBoxX = legend1X - 50;
    const legendBoxY = legendY - legendBoxSize / 2;

    ctx.fillStyle = "#1f2937";
    roundRect(ctx, legendBoxX, legendBoxY, legendBoxSize, legendBoxSize, 3);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\u25CF", legendBoxX + legendBoxSize / 2, legendBoxY + legendBoxSize / 2);
    ctx.fillStyle = "#374151";
    ctx.font = "300 36px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("営業日", legend1X, legendY);

    const legend2X = w / 2 + legendSpacing;
    const legendBox2X = legend2X - 50;
    const legendBox2Y = legendY - legendBoxSize / 2;
    ctx.fillStyle = "#f3f4f6";
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    roundRect(ctx, legendBox2X, legendBox2Y, legendBoxSize, legendBoxSize, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("-", legendBox2X + legendBoxSize / 2, legendBox2Y + legendBoxSize / 2);
    ctx.fillStyle = "#374151";
    ctx.font = "300 36px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("休業日", legend2X, legendY);

    const bhY = legendY + 60;
    ctx.fillStyle = "#6b7280";
    ctx.font = "300 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("営業時間", w / 2, bhY);
    ctx.fillStyle = "#111827";
    ctx.font = "300 32px sans-serif";
    ctx.fillText("06:00〜10:00", w / 2, bhY + 40);
  }, [year, month, businessDays, isOpenDay]);

  // Kuma download handler
  const kumaRef = useRef<HTMLImageElement>(null);
  const pressStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const downloadedRef = useRef(false);

  const downloadCalendar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const filename = `business_days_${year}_${String(month + 1).padStart(2, "0")}.png`;
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [year, month]);

  const animate = useCallback(
    (now: number) => {
      if (!pressStartRef.current) pressStartRef.current = now;
      const elapsed = now - pressStartRef.current;
      const progress = Math.min(elapsed / 3000, 1);
      const angle = 360 * progress;
      if (kumaRef.current) {
        kumaRef.current.style.transform = `rotate(${angle}deg)`;
      }
      if (progress >= 1) {
        rafRef.current = null;
        if (!downloadedRef.current) {
          downloadedRef.current = true;
          downloadCalendar();
          setTimeout(() => {
            downloadedRef.current = false;
            if (kumaRef.current) kumaRef.current.style.transform = "rotate(0deg)";
          }, 500);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    },
    [downloadCalendar]
  );

  const startPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if ("cancelable" in e.nativeEvent && e.nativeEvent.cancelable) e.preventDefault();
      if (downloadedRef.current) return;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      pressStartRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    },
    [animate]
  );

  const cancelPress = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (!downloadedRef.current && kumaRef.current) {
      kumaRef.current.style.transform = "rotate(0deg)";
    }
  }, []);

  useEffect(() => {
    const handler = () => cancelPress();
    document.addEventListener("mouseup", handler);
    document.addEventListener("touchend", handler);
    document.addEventListener("touchcancel", handler);
    return () => {
      document.removeEventListener("mouseup", handler);
      document.removeEventListener("touchend", handler);
      document.removeEventListener("touchcancel", handler);
    };
  }, [cancelPress]);

  return (
    <section className="bg-card py-16 sm:py-20 md:py-28 lg:py-36" id="calendar">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-12">
        <FadeInSection className="mb-10 sm:mb-14">
          <p className="font-sans text-lg font-light text-foreground sm:text-xl lg:text-2xl">
            Business Days
          </p>
          <p className="mt-4 font-sans text-sm font-light text-muted-foreground sm:text-base">
            {"営業日は下記のカレンダーにてご確認ください。"}
          </p>
        </FadeInSection>

        <FadeInSection delay={100}>
          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6 md:p-8 lg:p-12">
            {/* Month nav */}
            <div className="mb-6 flex items-center justify-center gap-4 sm:mb-8 sm:gap-6">
              <button
                onClick={prevMonth}
                className="rounded-full p-3 text-muted-foreground transition-colors hover:bg-muted sm:p-2"
                aria-label="前の月"
              >
                <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="min-w-[100px] text-center font-sans text-base font-light text-foreground sm:min-w-[120px] sm:text-lg lg:text-xl">
                {`${year}年${MONTH_NAMES[month]}`}
              </h3>
              <button
                onClick={nextMonth}
                className="rounded-full p-3 text-muted-foreground transition-colors hover:bg-muted sm:p-2"
                aria-label="次の月"
              >
                <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Week headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="py-2 text-center font-sans text-xs font-light text-muted-foreground lg:text-sm">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, i) => {
                const isCurrentMonth = date.getMonth() === month;
                const isOpen = isCurrentMonth && isOpenDay(date);

                if (!isCurrentMonth) {
                  return (
                    <div key={i} className="calendar-day py-2 font-sans text-base font-medium text-muted-foreground/30 sm:text-lg">
                      {date.getDate()}
                    </div>
                  );
                }

                if (isOpen) {
                  return (
                    <div
                      key={i}
                      className="calendar-day rounded-lg bg-foreground py-2 font-sans text-base font-medium text-background shadow-sm transition-all hover:scale-105 sm:text-lg"
                      title="営業日"
                    >
                      {date.getDate()}
                      <span className="mt-0.5 block text-xs leading-none opacity-80">
                        {"\u25CF"}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className="calendar-day rounded-lg border border-border bg-muted py-2 font-sans text-base font-medium text-muted-foreground transition-all hover:scale-105 hover:bg-accent sm:text-lg"
                    title="休業日"
                  >
                    {date.getDate()}
                    <span className="mt-0.5 block text-xs leading-none opacity-60">-</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex justify-center gap-8 font-sans text-xs font-light sm:text-sm">
              <div className="flex items-center">
                <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-foreground text-xs text-background">
                  {"\u25CF"}
                </div>
                <span className="text-muted-foreground">営業日</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-xs text-muted-foreground">
                  -
                </div>
                <span className="text-muted-foreground">休業日</span>
              </div>
            </div>

            {/* Business hours */}
            <div className="mt-6 flex flex-col gap-1 font-sans text-sm font-light sm:text-base lg:text-lg">
              <p className="text-muted-foreground">営業時間</p>
              <p className="text-foreground">06:00〜10:00</p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {"※詳細はNewsをご確認ください"}
              </p>
            </div>

            {/* Kuma download button */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <canvas ref={canvasRef} width={1080} height={1080} className="hidden" />
              <div
                className="kuma-btn relative cursor-pointer select-none"
                onMouseDown={startPress}
                onTouchStart={startPress}
                role="button"
                tabIndex={0}
                aria-label="カレンダーをダウンロード（長押し3秒）"
              >
                <img
                  ref={kumaRef}
                  src="/assets/images/kuma.png"
                  alt="カレンダーダウンロード"
                  className="h-16 w-16 opacity-80 transition-opacity duration-300 hover:opacity-100 sm:h-20 sm:w-20"
                  style={{ transformOrigin: "50% 50%", transform: "rotate(0deg)" }}
                />
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
