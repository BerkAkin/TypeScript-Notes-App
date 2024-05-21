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
        this.loadFromLocalStorage();
        console.log(this.notes);
    }
    loadFromLocalStorage() {
        const savedNotes = localStorage.getItem("notes");
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
        }
    }
    saveToLocalStorage() {
        localStorage.setItem("notes", JSON.stringify(this.notes));
    }
}
//NOT Operasyonları
class NoteOperations extends NoteState {
    constructor() {
        super();
        this.noteShower();
    }
    noteAdder(id, content, date, header) {
        this.note = new Note(id, content, date, header);
        this.notes.push(this.note);
        this.saveToLocalStorage();
        this.noteShower();
    }
    deleteNote(id) {
        const filtered = this.notes.filter((note) => note.id !== id);
        this.notes = filtered;
        this.saveToLocalStorage();
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
            not.id = no.id;
            not.attach();
        }
    }
}
class NoteItem {
    constructor() {
        this.contentItem = "";
        this.headerItem = "";
        this.dateItem = "";
        this.id = 0;
        this.singleNote = document.getElementById("single-note");
        this.hostElement = document.getElementById("note-container");
        const importedNode = document.importNode(this.singleNote.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
    }
    attach() {
        var _a;
        this.element.querySelector("#content").textContent = this.contentItem;
        this.element.querySelector("#date").textContent = this.dateItem;
        this.element.querySelector("#header").textContent = this.headerItem;
        (_a = this.element.querySelector("#deleteBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
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
            notOperations.noteAdder(Math.random(), this.txtArea.value, today, this.inp.value);
        }
        else {
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
