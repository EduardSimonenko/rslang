function cleanPage(): void {
  const body = document.querySelector('.body');
  while (body.firstElementChild) {
    body.firstElementChild.remove();
  }
}

export default cleanPage;
