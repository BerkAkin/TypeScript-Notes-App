//NOTE İÇİN BASE CLASS
class Note {
  constructor(public id: number, public content: string, public date: string, public title?: string) {}
}

class NoteState {
  protected notes: Note[] = [];
  constructor() {
    this.loadNotes();
    console.log(this.notes);
  }

  protected loadNotes() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }
  protected saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }
  protected deleteNote(id: number) {
    const filtered = this.notes.filter((note) => note.id !== id);
    this.notes = filtered;
    this.saveNotes();
  }
}

const noteStar = new NoteState();

class NoteItem {
  contentItem: string = "";
  headerItem: string = "";
  dateItem: string = "";
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
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

//notları görüntülmek üzere render edilecek notlar sınıfı
class Notes extends NoteState {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLDivElement;
  constructor() {
    super();
    this.templateElement = document.getElementById("single-note") as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.attach();
  }
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}
//NOT EKLEYİCİ SINIF
class NoteAdder extends NoteState {
  private note: Note;
  constructor() {
    super();
    this.noteShower();
  }

  noteAdder(id: number, content: string, date: string, header: string) {
    this.note = new Note(id, content, date, header);
    this.notes.push(this.note);
    this.saveNotes(); // Notları kaydet
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
      not.attach();
    }
  }
}

//NOT EKLEME İÇİN EKLEYİCİDEN YENİ BİR INSTANCE
const notAdder = new NoteAdder();

//notların başlığı ve modal gibi nesneleri tutan sınıf
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
      notAdder.noteAdder(Math.random(), this.txtArea.value, today, this.inp.value);
    } else {
      alert("Not girişi yapmadınız");
    }
    this.txtArea.value = "";
    this.inp.value = "";
    this.openNoteAdder();
  }
}
//NOT BAŞLIĞI VE MODAL RENDERI İÇİN INSTANCE
const note = new NoteHeader();
