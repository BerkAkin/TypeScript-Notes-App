//NOTE İÇİN BASE CLASS
class Note {
  constructor(public id: number, public content: string, public date: string, public title?: string) {}
}

//NOT EKLEYİCİ SINIF
class NoteAdder {
  private note: Note;
  constructor() {}
  noteAdder(id: number, content: string, date: string, header: string) {
    this.note = new Note(id, content, date, header);
  }
  getNote() {
    return this.note;
  }
}

//NOT EKLEME İÇİN EKLEYİCİDEN YENİ BİR INSTANCE
const notAdder = new NoteAdder();

//notları görüntülmek üzere render edilecek notlar sınıfı
class Notes {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLDivElement;
  constructor() {
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
    notAdder.noteAdder(Math.random(), this.inp.value, today, this.inp.value);
  }
}
//NOT BAŞLIĞI VE MODAL RENDERI İÇİN INSTANCE
const note = new NoteHeader();
