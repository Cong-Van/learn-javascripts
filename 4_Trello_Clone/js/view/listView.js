import commonView from "./commonView.js";
import CardView from "./cardView.js";

class ListView extends CommonView {
  _body = document.querySelector("body");
  _parentEl = document.querySelector(".list-container");
  _addListEl = document.querySelector(".add-list");
  _btnOpenAddList = document.querySelector(".btn--open-add-list");
  _inputAddList = document.querySelector(".input--add-list");
  _inputTextarea = this._inputAddList.querySelector("textarea");
  _btnAddList = document.querySelector(".btn-add-list");
  _btnCloseAddList = document.querySelector(".btn--close-add-list");

  constructor() {
    super();
    this._addHandlerShowOrHideAddList();
    this._addHandlerShowOrHideAddCard();
    this._addHandlerShowOrHideModal();
  }

  _addHandlerShowOrHideAddList() {
    this._btnOpenAddList.addEventListener("click", super._openAdd.bind(this));
    this._btnCloseAddList.addEventListener("click", super._closeAdd.bind(this));
  }

  _addMarkup(id, title) {
    return `
      <li class="works-list" data-id="${id}">
        <div class="list-header">
          <div class="list-header-title">${title}</div>
          <button class="btn-action btn--open-modal">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        <ol class="list-cards">
        </ol>
        <div class="list-action modal hidden">
          <div class="list-action-header">
            <h4>List action</h4>
            <button class="btn--close-modal">&times;</button>
          </div>
          <ul class="list-action-content">
            <li>Add card...</li>
            <li>Move all cards in this list</li>
            <li>Remove all cards in this list</li>
            <li>Remove this list</li>
          </ul>
        </div>
        <div class="list-footer">
          <button class="btn-open-add btn--open-add-card">
            <div class="card">
              <i class="fa-solid fa-plus"></i>&ensp; Add a card...
            </div>
          </button>
          <div class="input-add input--add-card hidden">
            <textarea
              class="card"
              rows="3"
              placeholder="Enter list title..."
            ></textarea>
            <div class="add-btns">
              <button class="btn-add btn-add-card">Add card</button>
              <button class="btn--close-add btn--close-add-card">
                &times;
              </button>
            </div>
          </div>
        </div>
      </li>
    `;
  }

  _clearInputTextArea() {
    this._inputTextarea.value = "";
  }

  _renderList(list) {
    const markup = this._addMarkup(list.id, list.title);
    const newList = document.createRange().createContextualFragment(markup);
    this._parentEl.insertBefore(newList, this._addListEl);
  }

  _addHandlerAddList(handler) {
    this._btnAddList.addEventListener("click", () => {
      const title = this._inputTextarea.value.trim();
      this._clearInputTextArea();

      if (!title) return;

      handler(title);
    });
  }

  _addHandlerShowOrHideAddCard() {
    this._parentEl.addEventListener("click", (e) => {
      const btnOpenAddCard = e.target.closest(".btn--open-add-card");
      const btnCloseAddCard = e.target.closest(".btn--close-add-card");
      const btn = btnOpenAddCard || btnCloseAddCard;

      if (!btn) return;

      const parentNode = btn.closest(".works-list");
      const cardView = new CardView(parentNode);
      console.log(cardView);
      btnOpenAddCard ? cardView._openAdd() : cardView._closeAdd();
    });
  }

  _renderCard(card) {
    console.log(card);
    const parentNode = document.querySelector(
      `.works-list[data-id=${card.listId}`
    );

    console.log(parentNode);
  }

  _addHandlerAddCard(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const btnAddCard = e.target.closest(".btn-add-card");
      console.log(btnAddCard);

      if (!btnAddCard) return;

      const parentNode = btnAddCard.closest(".works-list");
      const cardView = new CardView(parentNode);
      cardView._addHandlerAddCard(handler);
    });
  }

  _hideAllModal() {
    document
      .querySelectorAll(".modal")
      .forEach((el) => el.classList.add("hidden"));
  }

  _toggleModal(e) {
    const parentNode = e.target.closest(".works-list");
    const modal = parentNode.querySelector(".modal");
    return modal.classList.toggle("hidden");
  }

  _addHandlerShowOrHideModal() {
    this._body.addEventListener("click", (e) => {
      const btnOpenModal = e.target.closest(".btn--open-modal");
      const btnCloseModal = e.target.closest(".btn--close-modal");

      if (btnOpenModal) {
        this._hideAllModal();
        return this._toggleModal(e);
      }
      console.log(this._body, e.target.closest(".modal"));
      if (btnCloseModal || !e.target.closest(".modal")) {
        return this._hideAllModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      console.log(e.key);
      if (e.key === "Escape") {
        this._hideAllModal();
      }
    });
  }

  _addHandlerHideModal() {
    this._btnCloseModal.addEventListener("click", this._hideModal.bind(this));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this._hideModal();
      }
    });

    this._parentEl.addEventListener("click", (e) => {
      console.log(e.target);
      if (
        !e.target.closest(".modal") &&
        !e.target.closest(".btn--open-modal")
      ) {
        this._hideModal();
      }
    });
  }
}

export default new ListView();

// _toggleAddList() {
//   console.log(this._btnAddList);
//   this._btnAddList.classList.toggle("hidden");
//   this._inputAddList.classList.toggle("hidden");
// }

// _addHandlerShowAddList() {
//   this._btnOpenAddList.addEventListener("click", super._toggleAdd.bind(this));
// }

// _addHandlerHideAddList() {
//   this._btnCloseAddList.addEventListener("click", () => {
//     super._toggleAdd();
//   });
// }

// _addHandlerShowAddCard() {
//   this._parentEl.addEventListener("click", function (e) {
//     const btn = e.target.closest(".btn--open-add-card");
//     if (!btn) return;

//     const cardView = new CardView(btn.parentElement.parentElement);
//     cardView._toggleAdd();
//   });
// }

// _addHandlerHideAddCard() {
//   this._parentEl.addEventListener("click", function (e) {
//     const btn = e.target.closest(".btn--close-add-card");
//     if (!btn) return;

//     const parentNode = btn.closest(".works-list");

//     const cardView = new CardView(parentNode);
//     cardView._toggleAdd();
//   });
// }

// _addHandlerShowOrHideAddCard() {
//   this._parentEl.addEventListener("click", function (e) {
//     const btn =
//       e.target.closest(".btn--open-add-card") ||
//       e.target.closest(".btn--close-add-card");
//     if (!btn) return;

//     const parentNode = btn.closest(".works-list");

//     const cardView = new CardView(parentNode);
//     cardView._toggleAdd();
//   });
// }
