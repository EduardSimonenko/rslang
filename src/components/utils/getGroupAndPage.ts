function getGroupAndPage(url: string): string[] {
  const [pageUrl, parameters] = url.split('?');
  const [page] = parameters.match(/\d+$/);
  const [group] = parameters.match(/\d/);
  return [group, page, pageUrl];
}

export default getGroupAndPage;
