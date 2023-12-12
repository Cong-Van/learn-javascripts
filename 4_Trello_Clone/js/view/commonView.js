export default class CommonView {
  _parentEl = "";
  _btnOpenAdd = document.querySelectorAll(".btn-open-add");
  _inputAdd = document.querySelectorAll(".input-add");

  _hideAllAdd() {
    this._inputAdd.forEach((el) => el.classList.add("hidden"));
    this._btnOpenAdd.forEach((el) => el.classList.remove("hidden"));
  }

  _toggleAdd() {
    console.log(this._parentEl.lastElementChild);

    this._parentEl.lastElementChild
      .querySelector(".btn-open-add")
      .classList.toggle("hidden");

    const inputAdd =
      this._parentEl.lastElementChild.querySelector(".input-add");
    inputAdd.classList.toggle("hidden");

    inputAdd.querySelector("textarea").focus();
  }

  _openAdd() {
    this._hideAllAdd();
    this._toggleAdd();
  }

  _closeAdd() {
    this._toggleAdd();
  }
}
