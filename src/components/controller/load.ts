import { QueryOptions } from '../../types/loadServerData/interfaces';
import baseUrl from '../model/baseUrl';

class Loader {
  private errorHandler(res: Response): Response {
    if (!res.ok) {
      throw Error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
    }

    return res;
  }

  private makeUrl(endpoints: string[], queryParams: string[] = []): string {
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

  protected async load(
    options: QueryOptions,
    endpoint: string[],
    queryParams: string[] = [],
  ): Promise<Response> {
    const response: Response = await fetch(
      this.makeUrl(endpoint, queryParams),
      options,
    );

    return this.errorHandler(response);
  }
}

export default Loader;
