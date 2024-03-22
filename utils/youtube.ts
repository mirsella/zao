export function parseYoutubeId(url: string) {
  const regex = /watch\?v\=([\d\w]+)/;
  return url.match(regex)?.[1];
}
