"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { apiFetch } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { getImagePreviewUrl, type FileItem } from "@/services/fileService";

interface FilePreviewImageProps {
  file: FileItem;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  style?: CSSProperties;
}

export default function FilePreviewImage({
  file,
  alt,
  className,
  fill = false,
  width,
  height,
  style,
}: FilePreviewImageProps) {
  const { token } = useAuth();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadPreview() {
      if (!token) {
        setBlobUrl(null);
        return;
      }

      try {
        const response = await apiFetch(
          getImagePreviewUrl(file),
          { method: "GET", cache: "no-store" },
          token
        );

        if (!response.ok) {
          throw new Error(`Failed to load image preview (${response.status})`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setBlobUrl(objectUrl);
        }
      } catch {
        if (!cancelled) {
          setBlobUrl(null);
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file, token]);

  if (!blobUrl) {
    return null;
  }

  if (fill) {
    return (
      <Image
        src={blobUrl}
        alt={alt}
        fill
        unoptimized
        className={className}
        style={style}
      />
    );
  }

  return (
    <Image
      src={blobUrl}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 900}
      unoptimized
      className={className}
      style={style}
    />
  );
}
