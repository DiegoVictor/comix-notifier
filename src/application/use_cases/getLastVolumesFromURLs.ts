export const getSlugFromURL = (url: string) =>
  url.replace(/http:\/\/www\.comix\.com\.br\/mangas\/\w\/(.+)\.html/, "$1");
