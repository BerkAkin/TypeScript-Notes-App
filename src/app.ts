//NOTE İÇİN BASE CLASS
class Note {
  //bu sınıf not objesi oluşturmaya yarar
  constructor(public id: number, public content: string, public date: string, public title?: string) {}
}

class NoteState {
  //notların deposudur ve durumunu kontrol eder
  protected notes: Note[] = [];
  constructor() {
    this.loadFromLocalStorage();
    console.log(this.notes);
  }
  //localstorage'dan notları alır
  protected loadFromLocalStorage() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }
  //localstorage'a not kaydeder
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
  //not ekler
  noteAdder(id: number, content: string, date: string, header: string) {
    this.note = new Note(id, content, date, header);
    this.notes.push(this.note);
    this.saveToLocalStorage();
    this.noteShower();
  }
  //not siler
  deleteNote(id: number) {
    const filtered = this.notes.filter((note) => note.id !== id);
    this.notes = filtered;
    this.saveToLocalStorage();
    this.noteShower();
  }
  //notları gösterir
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

class NoteItem {
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
    notAdder.deleteNote(this.id); // NoteOperations sınıfındaki deleteNote işlevini çağır
    this.element.remove(); // DOM'dan notu kaldır
  }
}
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

const note = new NoteHeader();
const noteStar = new NoteState();
const notAdder = new NoteOperations();
