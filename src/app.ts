//NOTE İÇİN BASE CLASS
class Note {
  constructor(public id: number, public content: string, public date: string, public title?: string) {}
}

interface INoteItem {
  contentItem: string;
  headerItem: string;
  dateItem: string;
  id: number;

  attach(): void;
}

class NoteState {
  protected notes: Note[] = [];
  constructor() {
    this.loadFromLocalStorage();
    console.log(this.notes);
  }

  protected loadFromLocalStorage() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  protected saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }
}

//NOT Operasyonları
class NoteOperations extends NoteState {
  private note: Note;
  constructor() {
    super();
    this.noteShower();
  }

  noteAdder(id: number, content: string, date: string, header: string) {
    this.note = new Note(id, content, date, header);
    this.notes.push(this.note);
    this.saveToLocalStorage();
    this.noteShower();
  }

  deleteNote(id: number) {
    const filtered = this.notes.filter((note) => note.id !== id);
    this.notes = filtered;
    this.saveToLocalStorage();
    this.noteShower();
  }

  noteShower() {
    const notes = document.getElementById("note-container")! as HTMLDivElement;
    notes.innerHTML = "";

    for (let no of this.notes) {
      const not = new NoteItem();
      not.contentItem = no.content;
      not.headerItem = no.title;
      not.dateItem = no.date;
      not.id = no.id;
      not.attach();
    }
  }
}

class NoteItem implements INoteItem {
  contentItem: string = "";
  headerItem: string = "";
  dateItem: string = "";
  id: number = 0;
  private singleNote: HTMLTemplateElement;
  private hostElement: HTMLDivElement;
  private element: HTMLDivElement;
  constructor() {
    this.singleNote = document.getElementById("single-note") as HTMLTemplateElement;
    this.hostElement = document.getElementById("note-container")! as HTMLDivElement;
    const importedNode = document.importNode(this.singleNote.content, true);
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.attach();
  }

  attach() {
    this.element.querySelector("#content")!.textContent = this.contentItem;
    this.element.querySelector("#date")!.textContent = this.dateItem;
    this.element.querySelector("#header")!.textContent = this.headerItem;
    this.element.querySelector("#deleteBtn")?.addEventListener("click", () => {
      this.deleteNote();
    });
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }

  deleteNote() {
    notOperations.deleteNote(this.id);
    this.element.remove();
  }
}

class NoteHeader {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLDivElement;

  btn: HTMLButtonElement;
  modal: HTMLDivElement;
  inp: HTMLInputElement;
  txtArea: HTMLTextAreaElement;
  addNote: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById("tmp-note-container-header") as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.attach();

    this.btn = document.getElementById("add-btn")! as HTMLButtonElement;
    this.btn.addEventListener("click", this.openNoteAdder.bind(this));

    this.modal = document.getElementById("modal")! as HTMLDivElement;

    this.inp = document.getElementById("inputField")! as HTMLInputElement;
    this.txtArea = document.getElementById("inputFieldTxt")! as HTMLTextAreaElement;
    this.addNote = document.getElementById("addNote")! as HTMLFormElement;
    this.addNote.addEventListener("submit", this.addNewNote.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }

  private openNoteAdder() {
    const disp = this.modal.style.display;
    if (disp === "none") {
      this.modal.style.display = "flex";
      this.btn.textContent = "İptal Et";
    } else {
      this.modal.style.display = "none";
      this.btn.textContent = "Not Ekle";
    }
  }

  private addNewNote(event: SubmitEvent) {
    event.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    if (this.txtArea.value) {
      notOperations.noteAdder(Math.random(), this.txtArea.value, today, this.inp.value);
    } else {
      alert("Not girişi yapmadınız");
    }
    this.txtArea.value = "";
    this.inp.value = "";
    this.openNoteAdder();
  }
}

const noteHeader = new NoteHeader();
const noteState = new NoteState();
const notOperations = new NoteOperations();
