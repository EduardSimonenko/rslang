import { QueryOptions } from '../../types/loadServerData/interfaces';

export class Loader {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://rslang2022q1-learnwords.herokuapp.com';
  }

  private errorHandler(res: Response): Response {
    if (!res.ok) {
      console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
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
    console.log(url);

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

      return this.errorHandler(response);
    } catch (err: unknown) {
      console.error(err);
    }
  }
}
