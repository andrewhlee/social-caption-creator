type SupportedMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const SUPPORTED_TYPES: SupportedMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function isSupportedImageType(mimeType: string): mimeType is SupportedMediaType {
  return SUPPORTED_TYPES.includes(mimeType as SupportedMediaType);
}

export async function fileToBase64(
  file: File
): Promise<{ base64: string; mediaType: SupportedMediaType }> {
  if (!isSupportedImageType(file.type)) {
    throw new Error(
      `Unsupported image type: ${file.type}. Please upload a JPEG, PNG, GIF, or WebP image.`
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");

  return { base64, mediaType: file.type as SupportedMediaType };
}
