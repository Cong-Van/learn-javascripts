export const state = {
  listId: 1,
  cardId: 1,
  lists: [],
};

/**
 *
 * @param {string} title
 * Tạo mới list, đưa vào danh sách các list và lưu vào storage
 */
export const addNewList = function (title) {
  const newList = { id: state.listId++, title, cards: [] };
  state.lists.push(newList);
  saveData();
  return newList;
};

/**
 *
 * @param {string} id mang STT của list
 * @param {string} newTitle
 * tìm list bằng id và cập nhật title
 */
export const updateListTitle = function (id, newTitle) {
  const updateList = state.lists.find((el) => el.id == id);
  updateList.title = newTitle;
  saveData();
  return updateList;
};

/**
 *
 * @param {string} id
 * @param {string} newIndex vị trí mới trong mảng các list
 * tìm vị trí cũ bằng id và đưa vào vị trí mới
 */
export const moveListToPosition = function (id, newIndex) {
  const lists = state.lists;
  let top, mid, bot, newList;
  const oldIndex = lists.findIndex((el) => el.id == id);

  if (oldIndex == newIndex) return;
  if (oldIndex < newIndex) {
    top = lists.slice(0, oldIndex);
    mid = lists.slice(oldIndex + 1, newIndex + 1);
    bot = lists.slice(newIndex + 1);

    // Nếu có các phần tử ở trước vị trí oldIndex thì thêm các phần tử đó
    // Thêm các phần tử sau vị trí oldIndex, rồi thêm phần tử thay đổi vào
    top
      ? (newList = [...top, ...mid, lists[oldIndex]])
      : [...mid, lists[oldIndex]];
  }

  if (newIndex < oldIndex) {
    top = lists.slice(0, newIndex);
    mid = lists.slice(newIndex, oldIndex);
    bot = lists.slice(oldIndex + 1);

    // Nếu có các phần tử trước vị trí newIndex thì thêm các phần tử đó
    // Thêm phần tử thay đổi vào, rồi thêm tiếp các phần tử sau đó tính cả phần tử ở vị trí newIndex bị đẩy ra
    top
      ? (newList = [...top, lists[oldIndex], ...mid])
      : [lists[oldIndex], ...mid];
  }

  // Sau vị trí thay đổi nếu còn các phần tử thì thêm vào
  bot ? (newList = [...newList, ...bot]) : newList;
  state.lists = newList;

  saveData();
  return newList;
};

/**
 *
 * @param {string} id
 * tìm index bằng id và xóa list theo index trong array
 */
export const deleteList = function (id) {
  const index = state.lists.findIndex((el) => el.id == id);
  if (index !== -1) state.lists.splice(index, 1);
  saveData();
};

/**
 *
 * @param {string} title
 * @param {string} listId
 * tìm list sẽ thêm mới card bằng listId và thêm mới
 * Các hàm cho card sẽ cần thêm bước tìm list tương ứng trước và xử lý
 */
export const addNewCard = function (title, listId) {
  const newCard = { id: this.state.cardId++, listId, title };
  const list = state.lists.find((li) => li.id == listId);

  list.cards.push(newCard);
  saveData();
  return newCard;
};

export const updateCardTitle = function (id, listId, newTitle) {
  const updateCard = state.lists
    .find((li) => li.id == listId)
    ?.cards.find((ca) => ca.id == id);

  console.log(id, listId, newTitle, updateCard);

  updateCard.title = newTitle;
  saveData();
  return updateCard;
};

export const deleteCard = function (id, listId) {
  const list = state.lists.find((li) => li.id == listId);
  const index = list?.cards.findIndex((ca) => ca.id == id);
  if (index !== -1) list.cards.splice(index, 1);
  saveData();
};

/**
 *
 * @param {string} id của card
 * @param {string} oldListId id của list cũ chứa card
 * @param {string} newListId id của list mới chứa card
 * @param {string} newIndex vị trí trong list mới
 * Xóa card trong list cũ và thêm và vị trí tương ứng của list mới
 */
export const moveCardToPosition = function (
  id,
  oldListId,
  newListId,
  newIndex
) {
  const card = state.lists
    .find((li) => li.id == oldListId)
    ?.cards.find((ca) => ca.id == id);

  deleteCard(id, oldListId);

  const newList = state.lists.find((li) => li.id == newListId);
  card.listId = newListId;
  // Thêm mới vào vị trí newIndex, 0 xóa phần tử nào, phần tử thêm mới là card
  newList.cards.splice(newIndex, 0, card);
  saveData();
};

export const getAllLists = function () {
  return state.lists;
};

const saveData = function () {
  localStorage.setItem("lists", JSON.stringify(state.lists));
  localStorage.setItem("listId", state.listId);
  localStorage.setItem("cardId", state.cardId);
};

const init = function () {
  state.lists = JSON.parse(localStorage.getItem("lists")) ?? [];
  state.listId = state.lists.length === 0 ? 1 : localStorage.getItem("listId");
  state.cardId = state.lists.length === 0 ? 1 : localStorage.getItem("cardId");
};

const clearData = function () {
  localStorage.removeItem("lists");
  localStorage.removeItem("listId");
  localStorage.removeItem("cardId");
};

// clearData();

init();
