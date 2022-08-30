import { QueryOptions } from '../../types/loadServerData/interfaces';
import baseUrl from '../model/baseUrl';

class Loader {
  static errorHandler(res: Response): Response {
    if (!res.ok) {
      throw Error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
    }

    return res;
  }

  static makeUrl(endpoints: string[], queryParams: string[] = []): string {
    let url: string = baseUrl;
    url = endpoints.reduce((acc, cur) => `${acc}/${cur}`, url);

    url = queryParams.reduce(
      (acc, cur, index) => (!index
        ? `${acc}?${cur}`
        : `${acc}&${cur}`),
      url,
    );

    return url;
  }

  static async load(
    options: QueryOptions,
    endpoint: string[],
    queryParams: string[] = [],
  ): Promise<Response> {
    try {
      const response: Response = await fetch(
        this.makeUrl(endpoint, queryParams),
        options,
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Loader;
