"use strict";
//NOTE İÇİN BASE CLASS
class Note {
    constructor(id, content, date, title) {
        this.id = id;
        this.content = content;
        this.date = date;
        this.title = title;
    }
}
//NOT EKLEYİCİ SINIF
class NoteAdder {
    constructor() { }
    noteAdder(id, content, date, header) {
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
    constructor() {
        this.templateElement = document.getElementById("single-note");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
//notların başlığı ve modal gibi nesneleri tutan sınıf
class NoteHeader {
    constructor() {
        this.templateElement = document.getElementById("tmp-note-container-header");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
        this.btn = document.getElementById("add-btn");
        this.btn.addEventListener("click", this.openNoteAdder.bind(this));
        this.modal = document.getElementById("modal");
        this.inp = document.getElementById("inputField");
        this.txtArea = document.getElementById("inputFieldTxt");
        this.addNote = document.getElementById("addNote");
        this.addNote.addEventListener("submit", this.addNewNote.bind(this));
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
    openNoteAdder() {
        const disp = this.modal.style.display;
        if (disp === "none") {
            this.modal.style.display = "flex";
            this.btn.textContent = "İptal Et";
        }
        else {
            this.modal.style.display = "none";
            this.btn.textContent = "Not Ekle";
        }
    }
    addNewNote(event) {
        event.preventDefault();
        const today = new Date().toISOString().slice(0, 10);
        notAdder.noteAdder(Math.random(), this.inp.value, today, this.inp.value);
    }
}
//NOT BAŞLIĞI VE MODAL RENDERI İÇİN INSTANCE
const note = new NoteHeader();
