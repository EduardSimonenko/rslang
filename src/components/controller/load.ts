import { QueryOptions } from '../../types/loadServerData/interfaces';

class Loader {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://rslang2022q1-learnwords.herokuapp.com';
  }

  private errorHandler(res: Response): Response {
    if (!res.ok) {
      throw Error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
    }

    return res;
  }

  private makeUrl(endpoints: string[], queryParams: string[] = []): string {
    let url = `${this.baseUrl}`;
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
  ): Promise<void | Response> {
    try {
      const response: Response = await fetch(
        this.makeUrl(endpoint, queryParams),
        options,
      );

      return response;
    } catch (err) {
    // console.error(err);
    }
  }
}

export default Loader;
