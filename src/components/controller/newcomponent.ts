class NewElement {
  public createNewElement(tag: string, classNames: Array<string>, innerText = ''): HTMLElement {
    const tagElement = document.createElement(tag);
    tagElement.classList.add(...classNames);
    tagElement.innerHTML = innerText;
    return tagElement;
  }

  public insertChilds(element: HTMLElement, childs: HTMLElement[]): void {
    childs.forEach((item) => element.appendChild(item));
  }

  public setAttributes(element: HTMLElement, attributes: Record<string, string>): void {
    Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));
  }
}

export default NewElement;
