class View {
  _body = document.querySelector("body");
  _listContainerEl = document.querySelector(".list-container");
  _addListEl = document.querySelector(".add-list");
  _btnOpenAddList = document.querySelector(".btn--open-add-list");
  _inputAddList = document.querySelector(".input--add-list");
  _inputAddListTextarea = this._inputAddList.querySelector("textarea");
  _btnAddList = document.querySelector(".btn-add-list");
  _btnCloseAddList = document.querySelector(".btn--close-add-list");
  _modalListAction = document.querySelector(".list-action");
  _btnRemoveList = document.querySelector(".remove-list");
  _overlayEl = document.querySelector(".overlay");

  _curList = "";
  _curCard = "";
  _draggingEl = "";

  constructor() {
    this._addHandlerShowOrHideAddList();
    this._addHandlerShowOrHideAddCard();
    this._addHandlerShowOrHideModal();
    this._addGlobalHide();
    this._autoResizeTextarea();
    this._ShowEditListTitle();
    this._showEditCard();
    this._addDisplayDragging();
    this._addHandlerDragList();
    this._addHandlerDragCard();
  }

  //Common function
  // Ẩn hiện các phần tử thao tác
  _hideAll() {
    document
      .querySelectorAll(".btn-open-add")
      .forEach((el) => el.classList.remove("hidden"));
    document
      .querySelectorAll(".input-add")
      .forEach((el) => el.classList.add("hidden"));
    this._modalListAction.classList.add("hidden");
    document.querySelectorAll(".list-header-title").forEach((el) => {
      el.querySelector("h4").classList.remove("hidden");
      el.querySelector("textarea").classList.add("hidden");
    });
  }

  _toggleAddList() {
    this._btnOpenAddList.classList.toggle("hidden");
    this._inputAddList.classList.toggle("hidden");
  }

  _toggleAddCard(workList) {
    workList.querySelector(".btn--open-add-card").classList.toggle("hidden");
    workList.querySelector(".input--add-card").classList.toggle("hidden");
  }

  _toggleListTitleEl(titleHeader) {
    titleHeader.querySelector("h4").classList.toggle("hidden");
    const textarea = titleHeader.querySelector("textarea");
    textarea.classList.toggle("hidden");

    /* 
    Hiển thị textarea để sửa list title
    Set kích thước vừa với nội dung
    */
    if (textarea.classList.contains("hidden")) return;
    this._autoFitTextarea(textarea);
    textarea.select();
  }

  _toggleCardEl(parentNode) {
    parentNode.closest("li").classList.toggle("display");
    this._overlayEl.classList.toggle("hidden");

    parentNode.querySelector(".card-content").classList.toggle("hidden");
    const formEdit = parentNode.querySelector(".edit-card");
    formEdit.classList.toggle("hidden");

    if (!formEdit.classList.contains("hidden"))
      formEdit.querySelector("textarea").focus();
  }

  _toggleModal() {
    this._modalListAction.classList.toggle("hidden");
  }

  _setModalPosition(e) {
    console.log(e.clientX, e.clientY);
    this._modalListAction.style.left = `${e.clientX - 20}px`;
    this._modalListAction.style.top = `${e.clientY - 80}px`;
  }

  // Xóa đi các dữ liệu sau khi submit
  _clearInputAddListTextArea() {
    this._inputAddListTextarea.value = "";
    this._inputAddListTextarea.focus();
  }

  _clearInputAddCardTextArea(workList) {
    const textarea = workList
      .querySelector(".input--add-card")
      .querySelector("textarea");
    textarea.value = "";
    textarea.focus();
  }

  // Thêm style cho phần tử khi đang drag
  _addDisplayDragging() {
    ["dragstart", "dragend"].forEach((eve) =>
      this._listContainerEl.addEventListener(eve, (e) => {
        let element = e.target.closest(".card-contain");
        if (!element) element = e.target.closest(".works-list");
        if (!element) return;

        element.classList.toggle("is-dragging");
        this._draggingEl = element;
      })
    );
  }

  // Global event
  _addGlobalHide() {
    this._body.addEventListener(
      "click",
      (e) => {
        const btnOpenAdd = e.target.closest(".btn-open-add");
        const inputAdd = e.target.closest(".input-add");
        const btnOpenModal = e.target.closest(".btn--open-modal");
        const modal = e.target.closest(".modal");
        const listTitle = e.target.closest(".list-header-title");

        // Trừ những phần trên, còn đâu đóng hết
        if (!btnOpenAdd && !btnOpenModal && !inputAdd && !modal && !listTitle) {
          this._hideAll();
        }
      },
      true
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this._hideAll();
      }
    });
  }

  _autoFitTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  _autoResizeTextarea() {
    this._listContainerEl.addEventListener("input", (e) => {
      const textarea = e.target.closest("textarea");
      this._autoFitTextarea(textarea);
    });
  }

  /**
   *
   * @param {HTMLElement} newElements
   * @param {HTMLElement} curElements
   * Tìm các phần tử chi có 1 childNodes
   * childNodes đó sẽ tương ứng là textContent
   * Nếu textContent khác thì thay đổi
   */
  _updateContext(newElements, curElements) {
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (newEl.childNodes.length === 1 && curEl.childNodes.length === 1) {
        if (newEl.textContent !== curEl.textContent) {
          curEl.textContent = newEl.textContent;
        }
      }
    });
  }

  // Handler CRUD list
  _addHandlerShowOrHideAddList() {
    this._btnOpenAddList.addEventListener("click", () => {
      this._hideAll();
      this._toggleAddList();
      this._inputAddListTextarea.focus();
    });
    this._btnCloseAddList.addEventListener("click", () => {
      this._toggleAddList();
    });
  }

  _addListMarkup(list) {
    return `
      <li class="works-list" data-id="${list.id}" draggable="true">
        <div class="list-header">
          <div class="list-header-title">
            <h4 class="list-title">${list.title}</h4>
            <textarea class="hidden" rows="1">${list.title}</textarea>
          </div>
          <button class="btn-action btn--open-modal">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        <ol class="list-cards">
          ${list.cards.map((el) => this._addCardMarkup(el)).join("")}
        </ol>
        <div class="list-footer">
          <button class="btn-open-add btn--open-add-card">
            <div class="card">
              <i class="fa-solid fa-plus"></i>&ensp; Add a card...
            </div>
          </button>
          <form class="input-add input--add-card hidden">
            <textarea
              class="card"
              rows="3"
              placeholder="Enter list title..."
            ></textarea>
            <div class="add-btns">
              <button type="submit" class="btn-add btn-add-card">Add card</button>
              <button type="button" class="btn--close-add btn--close-add-card">
                &times;
              </button>
            </div>
          </form>
        </div>
      </li>
    `;
  }

  /**
   *
   * @param {Object} list
   * Tạo phần tử HTML với list và add vào ngay trước phần tử addList
   */
  renderList(list) {
    const markup = this._addListMarkup(list);
    const newList = document.createRange().createContextualFragment(markup);
    this._listContainerEl.insertBefore(newList, this._addListEl);
  }

  /**
   *
   * @param {event} e
   * @param {controlHandler} handler
   * Lấy giá trị của textare của phần tử add-list để controller xử lý
   */
  _AddNewList(e, handler) {
    e.preventDefault();
    const title = this._inputAddListTextarea.value.trim();

    if (!title || this._inputAddList.classList.contains("hidden")) return;

    this._clearInputAddListTextArea();
    handler(title);
  }

  addHandlerAddList(handler) {
    this._inputAddList.addEventListener("submit", (e) => {
      this._AddNewList(e, handler);
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this._AddNewList(e, handler);
      }
    });
  }

  _ShowEditListTitle() {
    this._listContainerEl.addEventListener("click", (e) => {
      const title = e.target.closest(".list-title");

      if (!title) return;

      const titleHeader = title.closest(".list-header-title");
      this._hideAll();
      this._toggleListTitleEl(titleHeader);
    });
  }

  /**
   *
   * @param {controlHandler} handler
   * @param {HTMLElement} textarea
   * Lấy giá trị của textarea và lấy id của list cho hàm của controller
   */
  _updateListTitle(handler, textarea) {
    const parentNode = textarea.closest(".works-list");

    if (!parentNode) return;

    const id = parentNode.dataset.id;
    const newTitle = textarea.value;

    const titleHeader = textarea.closest(".list-header-title");

    // Textarea không phải ở list header thì không xử lý
    if (!titleHeader) return;

    this._toggleListTitleEl(titleHeader);
    handler(id, newTitle);
  }

  addHandlerEditListTitle(handler) {
    this._body.addEventListener("click", (e) => {
      const parentNode = e.target.closest(".works-list");

      if (parentNode) return;

      // Tìm textarea không bị ẩn
      const textarea = document.querySelector("textarea:not(.hidden)");

      this._updateListTitle(handler, textarea);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const textarea = e.target.closest("textarea");
        this._updateListTitle(handler, textarea);
      }
    });
  }

  /**
   *
   * @param {Object} data (list)
   * Tạo một phần tử mới với dữ liệu của data
   * lấy phần tử HTML hiện tại bằng id của data
   * Gọi phương thức cập nhật dữ liệu (_updateContext)
   */
  updateList(data) {
    const newMarkup = this._addListMarkup(data);
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curList = document.querySelector(`.works-list[data-id="${data.id}"]`);
    const curElements = [curList, ...Array.from(curList.querySelectorAll("*"))];

    console.log(newElements, curElements);

    this._updateContext(newElements, curElements);
  }

  addHandlerRemoveList(handler) {
    this._btnRemoveList.addEventListener("click", (e) => {
      const id = this._curList.dataset.id;
      const title = this._curList.querySelector("h4").textContent;

      if (!confirm(`Are you sure delete List '${title}'`)) return;

      this._toggleModal();
      handler(id);
    });
  }

  removeList(id) {
    const listToDelete = document.querySelector(`.works-list[data-id="${id}"]`);
    listToDelete.outerHTML = "";
  }

  // Handler CRUD card
  _addHandlerShowOrHideAddCard() {
    this._listContainerEl.addEventListener("click", (e) => {
      const btnOpenAddCard = e.target.closest(".btn--open-add-card");
      const btnCloseAddCard = e.target.closest(".btn--close-add-card");
      const btn = btnOpenAddCard || btnCloseAddCard;

      if (!btn) return;

      // Mở textarea để thêm card và focus vào
      const workList = btn.closest(".works-list");
      if (btnOpenAddCard) this._hideAll();
      this._toggleAddCard(workList);
      workList
        .querySelector(".input--add-card")
        .querySelector("textarea")
        .focus();
    });
  }

  _addCardMarkup(card) {
    return `
    <li data-id="${card.id}" data-list-id="${card.listId}" class="card card-contain" draggable="true">
      <div class="card-content">
        <p>${card.title}</p>
        <i class="fa-solid fa-pen-to-square"></i
        ><i class="fa-solid fa-trash"></i>
      </div>
      <form action="" class="edit-card hidden">
        <textarea rows="2">${card.title}</textarea>
        <button class="btn-save">Save</button>
      </form>
    </li>
    `;
  }

  /**
   *
   * @param {Object} card
   * Tìm phần tử cha (list) chứa card bằng listId rồi thêm phần tử vào cuối list
   */
  renderCard(card) {
    const parentNode = document.querySelector(
      `.works-list[data-id="${card.listId}"]`
    );
    const listCard = parentNode.querySelector(".list-cards");

    const markup = this._addCardMarkup(card);
    listCard.insertAdjacentHTML("beforeend", markup);
  }

  /**
   *
   * @param {event} e
   * @param {controllerHandler} handler
   * Lấy giá trị từ textare, nếu khác '' thì lấy value để xử lý và set value về ''
   */
  _addNewCard(e, handler) {
    e.preventDefault();
    const inputAddCard = e.target.closest(".input--add-card");
    if (!inputAddCard) return;

    const title = inputAddCard.querySelector("textarea").value.trim();
    if (!title) return;

    const workList = inputAddCard.closest(".works-list");
    const listId = workList.dataset.id;
    this._clearInputAddCardTextArea(workList);
    handler(title, listId);
  }

  addHandlerAddCard(handler) {
    this._listContainerEl.addEventListener("submit", (e) => {
      this._addNewCard(e, handler);
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this._addNewCard(e, handler);
      }
    });
  }

  _showEditCard() {
    this._listContainerEl.addEventListener("click", (e) => {
      const btnEditCard = e.target.closest(".fa-pen-to-square");

      if (!btnEditCard) return;

      const card = btnEditCard.closest(".card");
      this._toggleCardEl(card);
    });
  }

  /**
   *
   * @param {event} e
   * @param {controlHandler} handler
   * Lấy ra phần tử HTML 'card'
   * Lấy thông tin: id, listId và newTitile để controller xử lý
   */
  _updateCard(e, handler) {
    e.preventDefault();
    const formEdit = e.target.closest(".edit-card");

    if (!formEdit) return;

    const cardEl = formEdit.closest(".card-contain");
    const card = formEdit.closest(".card");

    const newCardTitle = formEdit.querySelector("textarea").value;
    const listId = cardEl.dataset.listId;
    const id = cardEl.dataset.id;
    this._toggleCardEl(card);

    handler(id, listId, newCardTitle);
  }

  addHandlerEditCardTitle(handler) {
    this._listContainerEl.addEventListener("submit", (e) => {
      this._updateCard(e, handler);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this._updateCard(e, handler);
      }
    });
    this._overlayEl.addEventListener("click", (e) => {
      const cardEl = e.target.parentNode.querySelector(".display");

      const textarea = cardEl.querySelector("textarea");
      const text = cardEl.querySelector("p");
      textarea.value = text.textContent;

      const card = cardEl.querySelector(".card");
      this._toggleCardEl(card);
    });
  }

  /**
   *
   * @param {Object} data card
   * Tạo 1 Node mới từ data, so sánh với phần tử hiện tại
   * Gọi hàm để update những thông tin thay đổi
   */
  updateCard(data) {
    const newMarkup = this._addCardMarkup(data);
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curCard = document.querySelector(
      `li[data-id="${data.id}"][data-list-id="${data.listId}"]`
    );
    const curElements = [curCard, ...Array.from(curCard.querySelectorAll("*"))];

    console.log(newElements, curElements);

    this._updateContext(newElements, curElements);
  }

  addHandlerRemoveCard(handler) {
    this._listContainerEl.addEventListener("click", (e) => {
      const btnRemoveCard = e.target.closest(".fa-trash");

      if (!btnRemoveCard) return;

      const title = btnRemoveCard
        .closest(".card-content")
        .querySelector("p").textContent;
      if (!confirm(`Do you want to delete Card '${title}'`)) return;

      const cardEl = btnRemoveCard.closest(".card-contain");
      const id = cardEl.dataset.id;
      const listId = cardEl.getAttribute("data-list-id");

      handler(id, listId);
    });
  }

  removeCard(id, listId) {
    const cardToDelete = document.querySelector(
      `li[data-id="${id}"][data-list-id="${listId}"]`
    );
    cardToDelete.remove();
  }

  _addHandlerShowOrHideModal() {
    this._listContainerEl.addEventListener("click", (e) => {
      const btnOpenModal = e.target.closest(".btn--open-modal");
      const btnCloseModal = e.target.closest(".btn--close-modal");
      const btn = btnOpenModal || btnCloseModal;

      if (!btn) return;

      if (btnOpenModal) {
        this._hideAll();
      }
      this._curList = btn.closest(".works-list");
      console.log(this._curList);
      this._toggleModal();
      this._setModalPosition(e);
    });
  }

  _autoScrollOnContainer(mouseX) {
    const parentElRect = this._listContainerEl.getBoundingClientRect();
    const parentElWidth = parentElRect.width;
    const parentElScrollWidth = this._listContainerEl.scrollWidth;
    const scrollMax = parentElScrollWidth - parentElWidth;

    if (mouseX < parentElRect.left) {
      this._listContainerEl.scrollLeft -= 10;
      if (this._listContainerEl.scrollLeft < 0)
        this._listContainerEl.scrollLeft = 0;
    }
    if (parentElRect.right < mouseX) {
      this._listContainerEl.scrollLeft += 10;
      if (this._listContainerEl.scrollLeft > scrollMax)
        this._listContainerEl.scrollLeft = scrollMax;
    }
  }

  /**
   *
   * @param {HTMLElement} parentEl this._listContainerEl
   * @param {number} mouseX vị trí X của chuột
   * So sánh vị trí các các phần tử list trong Container, nếu gần thì sẽ lấy vị trí để đổi
   */
  _insertLeftList(parentEl, mouseX) {
    this._autoScrollOnContainer(mouseX);

    const lists = parentEl.querySelectorAll(".works-list:not(.is-dragging)");

    let closestList = null;
    let closetOffset = Number.NEGATIVE_INFINITY;

    lists.forEach((li) => {
      const { left } = li.getBoundingClientRect();
      const offset = mouseX - left - 30;

      if (closetOffset < offset && offset < 0) {
        closetOffset = offset;
        closestList = li;
      }
    });

    return closestList;
  }

  _addHandlerDragList() {
    this._listContainerEl.addEventListener("dragover", (e) => {
      e.preventDefault();

      if (!this._draggingEl.classList.contains("works-list")) return;

      const rightList = this._insertLeftList(this._listContainerEl, e.clientX);

      if (!rightList)
        this._listContainerEl.insertBefore(this._draggingEl, this._addListEl);
      else this._listContainerEl.insertBefore(this._draggingEl, rightList);
    });
  }

  addHandlerDropList(handler) {
    this._listContainerEl.addEventListener("drop", (e) => {
      e.preventDefault();

      if (!this._draggingEl.classList.contains("works-list")) return;

      const id = this._draggingEl.dataset.id;
      const newIndex = Array.from(
        this._listContainerEl.querySelectorAll(".works-list")
      ).indexOf(this._draggingEl);

      handler(id, newIndex);
    });
  }

  /**
   *
   * @param {HTMLElement} parentEl listEl
   * @param {number} mouseX vị trí Y của chuột
   * So sánh vị trí các các phần tử card trong list , nếu gần thì sẽ lấy vị trí để đổi
   */
  _insertAboveCard(parentEl, mouseY, mouseX) {
    this._autoScrollOnContainer(mouseX);
    const listCard = parentEl.querySelector(".list-cards");
    const listCardRect = listCard.getBoundingClientRect();
    if (mouseY < listCardRect.top) listCard.scrollTop -= 10;
    if (listCardRect.bottom < mouseY) listCard.scrollTop += 10;

    const cards = parentEl.querySelectorAll(".card-contain:not(.is-dragging)");

    let closestCard = null;
    let closetOffset = Number.NEGATIVE_INFINITY;

    cards.forEach((card) => {
      const { top } = card.getBoundingClientRect();
      const offset = mouseY - top;

      if (closetOffset < offset && offset < 0) {
        closetOffset = offset;
        closestCard = card;
      }
    });

    return closestCard;
  }

  _addHandlerDragCard() {
    this._listContainerEl.addEventListener("dragover", (e) => {
      e.preventDefault();

      const listEl = e.target.closest(".works-list");
      if (!this._draggingEl.classList.contains("card-contain") || !listEl)
        return;

      const listCard = listEl.querySelector(".list-cards");

      const botCard = this._insertAboveCard(listEl, e.clientY, e.clientX);

      if (!botCard) listCard.appendChild(this._draggingEl);
      else listCard.insertBefore(this._draggingEl, botCard);
    });
  }

  addHandlerDropCard(handler) {
    this._listContainerEl.addEventListener("drop", (e) => {
      e.preventDefault();

      if (!this._draggingEl.classList.contains("card-contain")) return;

      const newList = this._draggingEl.closest(".works-list");

      const id = this._draggingEl.dataset.id;
      const oldListId = this._draggingEl.dataset.listId;
      const newListId = newList.dataset.id;
      const newIndex = Array.from(
        newList.querySelectorAll(".card-contain")
      ).indexOf(this._draggingEl);

      this._draggingEl.dataset.listId = newList.dataset.id;
      handler(id, oldListId, newListId, newIndex);
    });
  }
}

export default new View();
