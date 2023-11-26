export const avaiableTags = [
  "a",
  "aside",
  "b",
  "blockquote",
  "br",
  "code",
  "em",
  "figcaption",
  "figure",
  "h3",
  "h4",
  "hr",
  "i",
  "iframe",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "strong",
  "u",
  "ul",
  "video",
] as const;

export function normalizeSrc(srcAttr: string, tagName: string) {
  const TELEGRAM_REGEX =
    /^(https?):\/\/(t\.me|telegram\.me|telegram\.dog)\/([a-zA-Z0-9_]+)\/(\d+)/;
  const VIMEO_REGEX =
    /(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
  const TWITTER_REGEX =
    /(https?:\/\/)?(www.)?twitter.com\/([a-z,A-Z]*\/)*status\/([0-9])[?]?.*/;
  const YOUTUBE_REGEX =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/;

  let src = srcAttr;
  if (tagName === "iframe") {
    if (TWITTER_REGEX.test(src)) {
      const match = TWITTER_REGEX.exec(src);
      if (match) {
        src = `/embed/twitter?url=${src}`;
      }
    } else if (YOUTUBE_REGEX.test(src)) {
      const match = YOUTUBE_REGEX.exec(src);
      if (match) {
        src = `/embed/youtube?url=${encodeURIComponent(
          `https://www.youtube.com/watch?v=${match[1]}`
        )}`;
      }
    } else if (VIMEO_REGEX.test(src)) {
      const match = VIMEO_REGEX.exec(src);
      if (match) {
        src = `/embed/vimeo?url=${encodeURIComponent(
          `https://vimeo.com/${match.pop()}`
        )}`;
      }
    } else if (TELEGRAM_REGEX.test(src)) {
      const match = TELEGRAM_REGEX.exec(src);
      if (match) {
        src = `/embed/telegram?url=${src}`;
      }
    }
  }
  return src;
}
