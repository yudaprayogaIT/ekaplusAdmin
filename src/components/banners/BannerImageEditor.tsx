"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaCheck,
  FaMinus,
  FaPlus,
  FaRedo,
  FaTimes,
  FaUndo,
} from "react-icons/fa";

const OUTPUT_WIDTH = 1368;
const OUTPUT_HEIGHT = 600;
const MAX_OUTPUT_SIZE = 5 * 1024 * 1024;

type Point = { x: number; y: number };
type Size = { width: number; height: number };

type Props = {
  file: File;
  onCancel: () => void;
  onConfirm: (file: File) => void;
};

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Hasil gambar tidak dapat dibuat"));
      },
      mimeType,
      0.92,
    );
  });
}

export default function BannerImageEditor({
  file,
  onCancel,
  onConfirm,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    start: Point;
    origin: Point;
  } | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateSize = () => {
      const bounds = viewport.getBoundingClientRect();
      setViewportSize({ width: bounds.width, height: bounds.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !processing) {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, processing]);

  const baseScale = useMemo(() => {
    if (
      !imageSize.width ||
      !imageSize.height ||
      !viewportSize.width ||
      !viewportSize.height
    ) {
      return 1;
    }

    const quarterTurn = rotation % 180 !== 0;
    const rotatedWidth = quarterTurn ? imageSize.height : imageSize.width;
    const rotatedHeight = quarterTurn ? imageSize.width : imageSize.height;

    return Math.max(
      viewportSize.width / rotatedWidth,
      viewportSize.height / rotatedHeight,
    );
  }, [imageSize, rotation, viewportSize]);

  const clampOffset = useCallback(
    (nextOffset: Point, nextZoom = zoom, nextRotation = rotation): Point => {
      if (!imageSize.width || !viewportSize.width) return nextOffset;

      const quarterTurn = nextRotation % 180 !== 0;
      const rotatedWidth = quarterTurn ? imageSize.height : imageSize.width;
      const rotatedHeight = quarterTurn ? imageSize.width : imageSize.height;
      const nextBaseScale = Math.max(
        viewportSize.width / rotatedWidth,
        viewportSize.height / rotatedHeight,
      );
      const scale = nextBaseScale * nextZoom;
      const maxX = Math.max(0, (rotatedWidth * scale - viewportSize.width) / 2);
      const maxY = Math.max(
        0,
        (rotatedHeight * scale - viewportSize.height) / 2,
      );

      return {
        x: Math.max(-maxX, Math.min(maxX, nextOffset.x)),
        y: Math.max(-maxY, Math.min(maxY, nextOffset.y)),
      };
    },
    [imageSize, rotation, viewportSize, zoom],
  );

  function handleZoom(nextZoom: number) {
    const value = Math.max(1, Math.min(3, nextZoom));
    setZoom(value);
    setOffset((current) => clampOffset(current, value));
  }

  function handleRotate() {
    const nextRotation = (rotation + 90) % 360;
    setRotation(nextRotation);
    setOffset({ x: 0, y: 0 });
  }

  function handleReset() {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setError(null);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (processing) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: offset,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setOffset(
      clampOffset({
        x: drag.origin.x + event.clientX - drag.start.x,
        y: drag.origin.y + event.clientY - drag.start.y,
      }),
    );
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  async function handleConfirm() {
    const sourceImage = imageRef.current;
    if (!sourceImage || !viewportSize.width) return;

    setProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_WIDTH;
      canvas.height = OUTPUT_HEIGHT;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Editor gambar tidak tersedia");

      const outputScale = OUTPUT_WIDTH / viewportSize.width;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.translate(
        OUTPUT_WIDTH / 2 + offset.x * outputScale,
        OUTPUT_HEIGHT / 2 + offset.y * outputScale,
      );
      context.rotate((rotation * Math.PI) / 180);
      context.scale(
        baseScale * zoom * outputScale,
        baseScale * zoom * outputScale,
      );
      context.drawImage(
        sourceImage,
        -imageSize.width / 2,
        -imageSize.height / 2,
        imageSize.width,
        imageSize.height,
      );

      const outputMimeType =
        file.type === "image/png" || file.type === "image/webp"
          ? file.type
          : "image/jpeg";
      const blob = await canvasToBlob(canvas, outputMimeType);
      if (blob.size > MAX_OUTPUT_SIZE) {
        throw new Error("Hasil gambar melebihi batas 5MB");
      }

      const originalName = file.name.replace(/\.[^.]+$/, "");
      const outputFile = new File(
        [blob],
        `${originalName}-banner.${extensionForMimeType(outputMimeType)}`,
        { type: outputMimeType, lastModified: Date.now() },
      );
      onConfirm(outputFile);
    } catch (editorError) {
      setError(
        editorError instanceof Error
          ? editorError.message
          : "Gagal memproses gambar",
      );
    } finally {
      setProcessing(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="banner-image-editor-title"
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h3
              id="banner-image-editor-title"
              className="font-semibold text-white"
            >
              Sesuaikan Gambar Banner
            </h3>
            <p className="text-xs text-white/60">
              Geser gambar untuk menentukan area yang tampil di aplikasi
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Tutup editor gambar"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            className="relative mx-auto w-full cursor-grab touch-none select-none overflow-hidden rounded-xl bg-neutral-900 active:cursor-grabbing"
            style={{ aspectRatio: `${OUTPUT_WIDTH} / ${OUTPUT_HEIGHT}` }}
          >
            {imageUrl && (
              <div
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
              >
                {/* Native img is required because this element is also the canvas source. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Gambar yang sedang disesuaikan"
                  draggable={false}
                  onLoad={(event) => {
                    const image = event.currentTarget;
                    setImageSize({
                      width: image.naturalWidth,
                      height: image.naturalHeight,
                    });
                  }}
                  onError={() => setError("File gambar tidak dapat dibaca")}
                  className="pointer-events-none absolute left-0 top-0 max-w-none select-none"
                  style={{
                    width: imageSize.width || "auto",
                    height: imageSize.height || "auto",
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${baseScale * zoom})`,
                  }}
                />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 border border-white/25">
              <div className="absolute left-1/3 top-0 h-full border-l border-white/20" />
              <div className="absolute left-2/3 top-0 h-full border-l border-white/20" />
              <div className="absolute left-0 top-1/3 w-full border-t border-white/20" />
              <div className="absolute left-0 top-2/3 w-full border-t border-white/20" />
            </div>
            <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[11px] text-white/80">
              Preview aplikasi · 1368 × 600 px
            </span>
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3 rounded-xl bg-white/5 p-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => handleZoom(zoom - 0.1)}
                disabled={zoom <= 1 || processing}
                className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Perkecil gambar"
              >
                <FaMinus className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(event) => handleZoom(Number(event.target.value))}
                disabled={processing}
                className="h-2 min-w-0 flex-1 cursor-pointer accent-red-500"
                aria-label="Zoom gambar"
              />
              <button
                type="button"
                onClick={() => handleZoom(zoom + 0.1)}
                disabled={zoom >= 3 || processing}
                className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Perbesar gambar"
              >
                <FaPlus className="h-4 w-4" />
              </button>
              <span className="w-12 text-right text-xs text-white/60">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                disabled={processing}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/15 disabled:opacity-50 sm:flex-none"
              >
                <FaRedo className="h-4 w-4" />
                Putar 90°
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={processing}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/15 disabled:opacity-50 sm:flex-none"
              >
                <FaUndo className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing || !imageSize.width}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FaCheck className="h-4 w-4" />
            )}
            {processing ? "Memproses..." : "Gunakan Gambar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
