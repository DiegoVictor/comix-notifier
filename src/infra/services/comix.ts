import axios from 'axios';

interface Page {
  url: string;
  data: string;
}

const comix = axios.create();

export const getPage = async (url: string) =>
  comix.get(url).then(({ data }): Page => ({ url, data }));
