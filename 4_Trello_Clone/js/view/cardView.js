import View from "./commonView.js";

export default class CardView extends View {
  constructor(parentEl) {
    super();
    this._parentEl = parentEl;
  }

  _addMarkup(id, listId, title) {
    return `
    <li data-id="${id}" data-list-id="${listId}">
      <div class="card card-content" draggable="true">
        <p>${title}</p>
        <textarea class="card card-input hidden" rows="3">${title}</textarea>
      </div>
    </li>
    `;
  }

  _renderCard(card) {
    const markup = this._addMarkup(card.id, card.listId, card.title);
    // const newCard = document.createRange().createContextualFragment(markup);

    const listCardEl = this._parentEl.querySelector(".list-cards");
    listCardEl.insertAdjacentHTML("beforeend", markup);
  }

  _addHandlerAddCard(handler) {
    const inputTextarea = this._parentEl
      .querySelector(".input-add")
      .querySelector("textarea");
    const title = inputTextarea.value.trim();
    const listId = this._parentEl.dataset.id;

    if (!title) return;

    inputTextarea.value = "";

    handler(title, listId);
  }
}
