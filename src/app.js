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
class NoteState {
    constructor() {
        this.notes = [];
        this.loadNotes();
    }
    loadNotes() {
        const savedNotes = localStorage.getItem("notes");
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
        }
    }
    saveNotes() {
        localStorage.setItem("notes", JSON.stringify(this.notes));
    }
}
const noteStar = new NoteState();
class NoteItem {
    constructor() {
        this.contentItem = "";
        this.headerItem = "";
        this.dateItem = "";
        this.singleNote = document.getElementById("single-note");
        this.hostElement = document.getElementById("note-container");
        const importedNode = document.importNode(this.singleNote.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
    }
    attach() {
        this.element.querySelector("#content").textContent = this.contentItem;
        this.element.querySelector("#date").textContent = this.dateItem;
        this.element.querySelector("#header").textContent = this.headerItem;
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
//notları görüntülmek üzere render edilecek notlar sınıfı
class Notes extends NoteState {
    constructor() {
        super();
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
//NOT EKLEYİCİ SINIF
class NoteAdder extends NoteState {
    constructor() {
        super();
        this.noteShower();
    }
    noteAdder(id, content, date, header) {
        this.note = new Note(id, content, date, header);
        this.notes.push(this.note);
        this.saveNotes(); // Notları kaydet
        this.noteShower();
    }
    noteShower() {
        const notes = document.getElementById("note-container");
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
        if (this.txtArea.value) {
            notAdder.noteAdder(Math.random(), this.txtArea.value, today, this.inp.value);
        }
        else {
            alert("Not girişi yapmadınız");
        }
        this.txtArea.value = "";
        this.inp.value = "";
        this.openNoteAdder();
    }
}
//NOT BAŞLIĞI VE MODAL RENDERI İÇİN INSTANCE
const note = new NoteHeader();
