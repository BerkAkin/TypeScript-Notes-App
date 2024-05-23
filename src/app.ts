class Note {
  constructor(public id: number, public content: string, public date: string, public title: string) {}
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
  }
  showModal() {
    this.modal.style.display = "flex";
  }
  hideModal() {
    this.modal.style.display = "none";
  }
  gatherInputs(e: Event) {
    e.preventDefault();
    console.log();
    const content = this.noteContentInput.value;
    const title = this.noteTitleInput.value;
    this.addNewNote(content, title);
  }
  addNewNote(content: string, title: string, id: number) {
    const newDate = new Date().toISOString().slice(0, 10).split("-").reverse().join("/");
    noteOperations.noteAdder(Math.random(), content, newDate, title);
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

  noteAdder(id: number, content: string, date: string, title: string) {
    const newNote = new Note(id, content, date, title);
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
      newNoteItem.setElementData(oneNote.title, oneNote.content, oneNote.date, oneNote.id);
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

  setElementData(title: string, content: string, date: string, id: number) {
    this.element.querySelector("#content")!.textContent = content;
    this.element.querySelector("#header")!.textContent = title;
    this.element.querySelector("#date")!.textContent = date;
    this.element.querySelector("#deleteBtn")!.addEventListener("click", () => noteOperations.deleteNote(id));
    this.attach();
  }

  attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const header = new Header();
const noteOperations = new NoteOperations();


//TODO: CHECKLIST ADDITION TO NOTES