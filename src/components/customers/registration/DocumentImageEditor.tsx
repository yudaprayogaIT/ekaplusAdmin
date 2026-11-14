"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaRedo, FaTimes, FaUndo } from "react-icons/fa";

type Point = { x: number; y: number };
type CornerKey = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";
type Corners = Record<CornerKey, Point>;
type Size = { width: number; height: number };

type Props = {
  file: File;
  title: string;
  fileSuffix: string;
  onCancel: () => void;
  onConfirm: (file: File) => void;
  outputWidth?: number;
  outputHeight?: number;
};

const DEFAULT_CORNERS: Corners = {
  topLeft: { x: 0.03, y: 0.03 },
  topRight: { x: 0.97, y: 0.03 },
  bottomRight: { x: 0.97, y: 0.97 },
  bottomLeft: { x: 0.03, y: 0.97 },
};
const CORNER_ORDER: CornerKey[] = [
  "topLeft",
  "topRight",
  "bottomRight",
  "bottomLeft",
];
const MAX_OUTPUT_SIZE = 5 * 1024 * 1024;

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
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Hasil gambar tidak dapat dibuat")),
      mimeType,
      0.92,
    );
  });
}

function solveLinearSystem(matrix: number[][], values: number[]) {
  const size = values.length;
  const augmented = matrix.map((row, index) => [...row, values[index]]);

  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) {
        pivot = row;
      }
    }
    [augmented[column], augmented[pivot]] = [
      augmented[pivot],
      augmented[column],
    ];

    const divisor = augmented[column][column];
    if (Math.abs(divisor) < 1e-10) {
      throw new Error("Posisi sudut tidak valid");
    }
    for (let cell = column; cell <= size; cell += 1) {
      augmented[column][cell] /= divisor;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let cell = column; cell <= size; cell += 1) {
        augmented[row][cell] -= factor * augmented[column][cell];
      }
    }
  }

  return augmented.map((row) => row[size]);
}

function getHomography(
  outputWidth: number,
  outputHeight: number,
  sourceCorners: Point[],
) {
  const destinationCorners: Point[] = [
    { x: 0, y: 0 },
    { x: outputWidth - 1, y: 0 },
    { x: outputWidth - 1, y: outputHeight - 1 },
    { x: 0, y: outputHeight - 1 },
  ];
  const matrix: number[][] = [];
  const values: number[] = [];

  destinationCorners.forEach((destination, index) => {
    const source = sourceCorners[index];
    const { x: u, y: v } = destination;
    matrix.push([u, v, 1, 0, 0, 0, -source.x * u, -source.x * v]);
    values.push(source.x);
    matrix.push([0, 0, 0, u, v, 1, -source.y * u, -source.y * v]);
    values.push(source.y);
  });

  return solveLinearSystem(matrix, values);
}

function isValidQuadrilateral(points: Point[]) {
  let direction = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const afterNext = points[(index + 2) % points.length];
    const cross =
      (next.x - current.x) * (afterNext.y - next.y) -
      (next.y - current.y) * (afterNext.x - next.x);
    if (Math.abs(cross) < 0.0001) return false;
    const nextDirection = Math.sign(cross);
    if (direction && nextDirection !== direction) return false;
    direction = nextDirection;
  }
  return true;
}

function rotatedToSource(
  point: Point,
  rotation: number,
  sourceSize: Size,
): Point {
  const { width, height } = sourceSize;
  switch (rotation) {
    case 90:
      return { x: point.y, y: height - 1 - point.x };
    case 180:
      return { x: width - 1 - point.x, y: height - 1 - point.y };
    case 270:
      return { x: width - 1 - point.y, y: point.x };
    default:
      return point;
  }
}

function warpPerspective(
  sourceImage: HTMLImageElement,
  sourceCorners: Point[],
  outputWidth: number,
  outputHeight: number,
) {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = sourceImage.naturalWidth;
  sourceCanvas.height = sourceImage.naturalHeight;
  const sourceContext = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!sourceContext) throw new Error("Editor gambar tidak tersedia");
  sourceContext.drawImage(sourceImage, 0, 0);
  const sourceData = sourceContext.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
  );

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;
  const outputContext = outputCanvas.getContext("2d");
  if (!outputContext) throw new Error("Editor gambar tidak tersedia");
  const outputData = outputContext.createImageData(outputWidth, outputHeight);
  const transform = getHomography(outputWidth, outputHeight, sourceCorners);
  const sourcePixels = sourceData.data;
  const outputPixels = outputData.data;
  const sourceWidth = sourceCanvas.width;
  const sourceHeight = sourceCanvas.height;

  for (let y = 0; y < outputHeight; y += 1) {
    for (let x = 0; x < outputWidth; x += 1) {
      const denominator = transform[6] * x + transform[7] * y + 1;
      const sourceX =
        (transform[0] * x + transform[1] * y + transform[2]) / denominator;
      const sourceY =
        (transform[3] * x + transform[4] * y + transform[5]) / denominator;
      const left = Math.max(0, Math.min(sourceWidth - 1, Math.floor(sourceX)));
      const top = Math.max(0, Math.min(sourceHeight - 1, Math.floor(sourceY)));
      const right = Math.min(sourceWidth - 1, left + 1);
      const bottom = Math.min(sourceHeight - 1, top + 1);
      const horizontalWeight = Math.max(0, Math.min(1, sourceX - left));
      const verticalWeight = Math.max(0, Math.min(1, sourceY - top));
      const outputIndex = (y * outputWidth + x) * 4;

      for (let channel = 0; channel < 4; channel += 1) {
        const topLeft = sourcePixels[(top * sourceWidth + left) * 4 + channel];
        const topRight =
          sourcePixels[(top * sourceWidth + right) * 4 + channel];
        const bottomLeft =
          sourcePixels[(bottom * sourceWidth + left) * 4 + channel];
        const bottomRight =
          sourcePixels[(bottom * sourceWidth + right) * 4 + channel];
        const topValue = topLeft + (topRight - topLeft) * horizontalWeight;
        const bottomValue =
          bottomLeft + (bottomRight - bottomLeft) * horizontalWeight;
        outputPixels[outputIndex + channel] =
          topValue + (bottomValue - topValue) * verticalWeight;
      }
    }
  }

  outputContext.putImageData(outputData, 0, 0);
  return outputCanvas;
}

export default function DocumentImageEditor({
  file,
  title,
  fileSuffix,
  onCancel,
  onConfirm,
  outputWidth = 1200,
  outputHeight = 756,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const draggingCornerRef = useRef<CornerKey | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [corners, setCorners] = useState<Corners>(DEFAULT_CORNERS);
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

  const rotatedSize = useMemo(
    () =>
      rotation % 180 === 0
        ? imageSize
        : { width: imageSize.height, height: imageSize.width },
    [imageSize, rotation],
  );

  const imageRect = useMemo(() => {
    if (!rotatedSize.width || !viewportSize.width) {
      return { left: 0, top: 0, width: 0, height: 0, scale: 1 };
    }
    const scale = Math.min(
      viewportSize.width / rotatedSize.width,
      viewportSize.height / rotatedSize.height,
    );
    const width = rotatedSize.width * scale;
    const height = rotatedSize.height * scale;
    return {
      left: (viewportSize.width - width) / 2,
      top: (viewportSize.height - height) / 2,
      width,
      height,
      scale,
    };
  }, [rotatedSize, viewportSize]);

  const displayPoints = CORNER_ORDER.map((key) => ({
    x: imageRect.left + corners[key].x * imageRect.width,
    y: imageRect.top + corners[key].y * imageRect.height,
  }));

  function updateCorner(event: React.PointerEvent<HTMLDivElement>) {
    const corner = draggingCornerRef.current;
    const viewport = viewportRef.current;
    if (!corner || !viewport || !imageRect.width) return;
    const bounds = viewport.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left - imageRect.left) / imageRect.width),
    );
    const y = Math.max(
      0,
      Math.min(1, (event.clientY - bounds.top - imageRect.top) / imageRect.height),
    );
    setCorners((current) => ({ ...current, [corner]: { x, y } }));
  }

  function handleRotate() {
    setRotation((current) => (current + 90) % 360);
    setCorners(DEFAULT_CORNERS);
    setError(null);
  }

  function handleReset() {
    setRotation(0);
    setCorners(DEFAULT_CORNERS);
    setError(null);
  }

  async function handleConfirm() {
    const sourceImage = imageRef.current;
    if (!sourceImage || !imageSize.width) return;
    const normalizedPoints = CORNER_ORDER.map((key) => corners[key]);
    if (!isValidQuadrilateral(normalizedPoints)) {
      setError("Posisi sudut saling menyilang. Atur kembali ke empat sudut dokumen.");
      return;
    }

    setProcessing(true);
    setError(null);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    try {
      const rotatedSourceWidth = rotatedSize.width - 1;
      const rotatedSourceHeight = rotatedSize.height - 1;
      const sourceCorners = normalizedPoints.map((point) =>
        rotatedToSource(
          {
            x: point.x * rotatedSourceWidth,
            y: point.y * rotatedSourceHeight,
          },
          rotation,
          imageSize,
        ),
      );
      const outputCanvas = warpPerspective(
        sourceImage,
        sourceCorners,
        outputWidth,
        outputHeight,
      );
      const outputMimeType =
        file.type === "image/png" || file.type === "image/webp"
          ? file.type
          : "image/jpeg";
      const blob = await canvasToBlob(outputCanvas, outputMimeType);
      if (blob.size > MAX_OUTPUT_SIZE) {
        throw new Error("Hasil gambar melebihi batas 5MB");
      }
      const originalName = file.name.replace(/\.[^.]+$/, "");
      onConfirm(
        new File(
          [blob],
          `${originalName}-${fileSuffix}.${extensionForMimeType(outputMimeType)}`,
          { type: outputMimeType, lastModified: Date.now() },
        ),
      );
    } catch (processError) {
      setError(
        processError instanceof Error
          ? processError.message
          : "Gagal meluruskan gambar dokumen",
      );
    } finally {
      setProcessing(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-editor-title"
        className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-950 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div>
            <h3 id="document-editor-title" className="font-semibold">
              {title}
            </h3>
            <p className="text-xs text-white/60">
              Tarik empat titik hijau tepat ke sudut dokumen
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Tutup editor dokumen"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          <div
            ref={viewportRef}
            onPointerMove={updateCorner}
            onPointerUp={(event) => {
              draggingCornerRef.current = null;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
            onPointerCancel={() => {
              draggingCornerRef.current = null;
            }}
            className="relative mx-auto w-full touch-none select-none overflow-hidden rounded-xl bg-black"
            style={{ aspectRatio: "16 / 10" }}
          >
            {imageUrl && (
              // Native img is also used as the source for canvas processing.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Dokumen yang sedang disesuaikan"
                draggable={false}
                onLoad={(event) => {
                  setImageSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  });
                }}
                onError={() => setError("File gambar tidak dapat dibaca")}
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                style={{
                  width: imageSize.width * imageRect.scale || "auto",
                  height: imageSize.height * imageRect.scale || "auto",
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
              />
            )}

            {imageRect.width > 0 && (
              <>
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <polygon
                    points={displayPoints.map((point) => `${point.x},${point.y}`).join(" ")}
                    fill="rgba(16, 185, 129, 0.12)"
                    stroke="rgb(52, 211, 153)"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {CORNER_ORDER.map((key, index) => {
                  const point = displayPoints[index];
                  return (
                    <button
                      key={key}
                      type="button"
                      onPointerDown={(event) => {
                        draggingCornerRef.current = key;
                        viewportRef.current?.setPointerCapture(event.pointerId);
                      }}
                      className="absolute z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-4 border-white bg-emerald-500 shadow-lg ring-2 ring-emerald-500/50 active:cursor-grabbing"
                      style={{ left: point.x, top: point.y }}
                      aria-label={`Geser sudut ${index + 1}`}
                    />
                  );
                })}
              </>
            )}

            <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[11px] text-white/80">
              Perspective correction · {outputWidth} × {outputHeight} px
            </span>
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
            <p className="text-xs text-white/60">
              Area di dalam garis hijau akan diluruskan menjadi gambar dokumen.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRotate}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/15 disabled:opacity-50"
              >
                <FaRedo className="h-4 w-4" />
                Putar 90°
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/15 disabled:opacity-50"
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
            {processing ? "Meluruskan..." : "Gunakan Gambar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
