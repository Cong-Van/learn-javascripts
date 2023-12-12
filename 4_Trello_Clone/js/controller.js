import * as model from "./model.js";
import view from "./view.js";

const controlAddList = function (title) {
  const newList = model.addNewList(title);
  view.renderList(newList);
};

const controlUpdateList = function (id, newTitle) {
  const updatedList = model.updateListTitle(id, newTitle);
  view.updateList(updatedList);
};

const controlRemoveList = function (id) {
  model.deleteList(id);
  view.removeList(id);
};

const controlAddCard = function (title, listId) {
  const newCard = model.addNewCard(title, listId);
  view.renderCard(newCard);
};

const controlEditCard = function (id, listId, newTitle) {
  const updatedCard = model.updateCardTitle(id, listId, newTitle);
  view.updateCard(updatedCard);
};

const controlRemoveCard = function (id, listId) {
  model.deleteCard(id, listId);
  view.removeCard(id, listId);
};

const controlDropList = function (id, newIndex) {
  model.moveListToPosition(id, newIndex);
};

const controlDropCard = function (id, oldListId, newListId, newIndex) {
  model.moveCardToPosition(id, oldListId, newListId, newIndex);
};

const renderInit = () => {
  const lists = model.getAllLists();
  if (!lists || !lists.length) return;
  lists.forEach((list) => {
    view.renderList(list);
  });
};

const init = function () {
  view.addHandlerAddList(controlAddList);
  view.addHandlerAddCard(controlAddCard);
  view.addHandlerEditListTitle(controlUpdateList);
  view.addHandlerEditCardTitle(controlEditCard);
  view.addHandlerRemoveList(controlRemoveList);
  view.addHandlerRemoveCard(controlRemoveCard);
  view.addHandlerDropList(controlDropList);
  view.addHandlerDropCard(controlDropCard);
  renderInit();
};

init();
