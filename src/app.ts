class Note {
  constructor(public id: number, public content: string, public date: string, public title: string, public checks: string[]) {}
}

abstract class Component<hostEle extends HTMLElement, Ele extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: hostEle;
  element: Ele;

  constructor(templateElementId: string, hostElementId: string) {
    this.templateElement = document.getElementById(templateElementId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as hostEle;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as Ele;
    this.attach();
  }

  protected attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

class Header extends Component<HTMLDivElement, HTMLDivElement> {
  showModalBtn: HTMLButtonElement;
  modal: HTMLDivElement;
  modalAddNewNoteButton: HTMLButtonElement;
  modalCancelButton: HTMLButtonElement;
  modalForm: HTMLFormElement;

  noteTitleInput: HTMLInputElement;
  noteContentInput: HTMLTextAreaElement;

  checklistBtn: HTMLButtonElement;
  checklistList: HTMLDivElement;
  checkList: string[] = [];

  checklistModal: HTMLDivElement;
  checklistModalAddBtn: HTMLButtonElement;
  checklistModalCancelBtn: HTMLButtonElement;
  checklistModalInput: HTMLInputElement;

  constructor() {
    super("tmp-note-container-header", "app");
    this.configure();
  }

  configure() {
    this.showModalBtn = document.querySelector("#add-btn")! as HTMLButtonElement;
    this.showModalBtn.addEventListener("click", () => this.showModal());

    this.modal = document.querySelector("#modal")! as HTMLDivElement;

    this.modalForm = document.querySelector("#addNoteForm")! as HTMLFormElement;
    this.modalForm.addEventListener("submit", this.gatherInputs.bind(this));

    this.noteTitleInput = document.getElementById("inputField") as HTMLInputElement;
    this.noteContentInput = document.getElementById("inputFieldTxt")! as HTMLTextAreaElement;

    this.modalCancelButton = document.querySelector("#modalCancelButton")! as HTMLButtonElement;
    this.modalCancelButton.addEventListener("click", () => this.hideModal());

    this.checklistModalInput = document.querySelector("#checkAdderModalInput")! as HTMLInputElement;

    this.checklistModal = document.querySelector("#checkListAdderModal")! as HTMLDivElement;
    this.checklistModalCancelBtn = document.querySelector("#checklistModalCancelButton")! as HTMLButtonElement;
    this.checklistModalCancelBtn.addEventListener("click", () => {
      this.checklistModalInput.value = "";
      this.hideCheckModal();
    });
    this.checklistModalAddBtn = document.querySelector("#checklistModalAddButton")! as HTMLButtonElement;
    this.checklistModalAddBtn.addEventListener("click", () => {
      this.gatherCheckModalInputs();
    });

    this.checklistBtn = document.querySelector("#modalAddChecklistButton")! as HTMLButtonElement;
    this.checklistBtn.addEventListener("click", () => {
      this.showCheckModal();
    });

    this.checklistList = document.querySelector("#checkListField")! as HTMLDivElement;
  }
  showModal() {
    this.modal.style.display = "flex";
  }
  hideModal() {
    this.checklistList.innerHTML = "";
    this.checkList = [];
    this.modal.style.display = "none";
  }
  gatherInputs(e: Event) {
    e.preventDefault();
    const content = this.noteContentInput.value;
    const title = this.noteTitleInput.value;
    const checks = this.checkList;
    this.addNewNote(content, title, checks);
  }
  addNewNote(content: string, title: string, checks: string[]) {
    const newDate = new Date().toISOString().slice(0, 10).split("-").reverse().join("/");
    noteOperations.noteAdder(Math.random(), content, newDate, title, checks);
    this.checkList = [];
    this.checklistList.innerHTML = "";
    this.hideModal();
  }
  addNewCheckItem(text: string) {
    const newCheckElement = `<input type="checkbox" id="${text}" class="${text}" /><label for="${text}">${text}</label><br>`;
    this.checklistList.innerHTML += newCheckElement;
  }
  showCheckModal() {
    this.checklistModal.style.display = "flex";
  }
  hideCheckModal() {
    this.checklistModal.style.display = "none";
    this.showModal();
  }
  gatherCheckModalInputs() {
    this.checkList.push(this.checklistModalInput.value);
    this.addNewCheckItem(this.checklistModalInput.value);
    this.hideCheckModal();
    console.log(this.checkList);
  }
}

class NoteOperations {
  notes: Note[] = [];
  constructor() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
    this.renderNotes();
  }

  saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  noteAdder(id: number, content: string, date: string, title: string, checks: string[]) {
    const newNote = new Note(id, content, date, title, checks);
    this.notes.push(newNote);
    this.saveToLocalStorage();
    this.renderNotes();
  }

  deleteNote(id: number) {
    const filtered = this.notes.filter((note) => note.id !== id);
    this.notes = filtered;
    this.saveToLocalStorage();
    this.renderNotes();
  }

  renderNotes() {
    const hostElement = document.getElementById("note-container") as HTMLDivElement;
    hostElement.innerHTML = "";

    for (let oneNote of this.notes) {
      let newNoteItem = new NoteItem("single-note", "note-container");
      newNoteItem.setElementData(oneNote.title, oneNote.content, oneNote.date, oneNote.id, oneNote.checks);
    }
  }
}

class NoteItem {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLDivElement;

  constructor(templateElementId: string, hostElementId: string) {
    this.templateElement = document.getElementById(templateElementId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLDivElement;
  }

  setElementData(title: string, content: string, date: string, id: number, checks: string[]) {
    this.element.querySelector("#content")!.textContent = content;
    this.element.querySelector("#header")!.textContent = title;
    this.element.querySelector("#date")!.textContent = date;
    this.element.querySelector("#deleteBtn")!.addEventListener("click", () => noteOperations.deleteNote(id));
    if (checks.length !== 0) {
      this.element.querySelector("#content")!.innerHTML += `<hr style="margin-top:15px">`;
      console.log(checks);
    }
    for (let chck in checks) {
      this.element.querySelector("#checklistInNote")!.innerHTML += `
      <input type="checkbox" id="${checks[chck]}" class="${checks[chck]}" />
      <p style="display:inline;" for="${checks[chck]}">${checks[chck]}</p><br>`;
    }

    this.attach();
  }

  attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const header = new Header();
const noteOperations = new NoteOperations();
