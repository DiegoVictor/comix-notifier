import axios from 'axios';

interface Page {
  url: string;
  data: string;
}

const comix = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0',
  },
});

export const getPage = async (url: string) =>
  comix.get(url).then(({ data }): Page => ({ url, data }));
