/**
 * Helps to upload local files upto 5 or 6MB (I think) to Telegraph's file
 * uploading service and returns the URL of the uploaded file.
 *
 * Useful to add local images as a source for `<img>`.
 *
 * Supported file formats: `.jpg`, `.jpeg`, `.png`, `.gif` and `.mp4`.
 *
 * ```ts
 * const imgUrl = await Telegraph.upload("./assets/images/banner.png");
 * ```
 *
 * **This is not actually a part of the official Telegraph API**, at least, it
 * does not have any official documentation.
 *
 * @param src The local or remote file path or URL.
 * @returns Remote URL to the uploaded file.
 */
export async function upload(
  src: string | URL | Blob | Uint8Array | BufferSource,
  baseURL = "https://telegra.ph",
  fetch = globalThis.fetch
): Promise<string> {
  let blob: Blob | BufferSource;

  if (typeof src === "string" || src instanceof URL) {
    const url = src.toString();
    // Use the same URL.
    const r = new RegExp("http(s?)://telegra.ph/file/(.+).(.+)", "i");
    if (r.test(url)) return url.toLowerCase();

    // Download file from external source.
    if (url.startsWith("https://") || url.startsWith("http://")) {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      blob = new Uint8Array(buffer);
    } else {
      throw new Error(`Upload local file is not supported`);
    }
  } else {
    // Blob | Uint8Array | BufferSource?
    blob = src;
  }

  const file = new File([blob], "blob");
  const form = new FormData();
  form.append("photo", file);

  const res = await fetch(`${baseURL}/upload`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);

  return `${baseURL}/${json[0].src}`;
}
