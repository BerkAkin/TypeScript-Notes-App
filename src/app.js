"use strict";
class Note {
    constructor(id, content, date, title) {
        this.id = id;
        this.content = content;
        this.date = date;
        this.title = title;
    }
}
class Component {
    constructor(templateElementId, hostElementId) {
        this.templateElement = document.getElementById(templateElementId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
class Header extends Component {
    constructor() {
        super("tmp-note-container-header", "app");
        this.configure();
    }
    configure() {
        this.showModalBtn = document.querySelector("#add-btn");
        this.showModalBtn.addEventListener("click", () => this.showModal());
        this.modal = document.querySelector("#modal");
        this.modalForm = document.querySelector("#addNoteForm");
        this.modalForm.addEventListener("submit", this.gatherInputs.bind(this));
        this.noteTitleInput = document.getElementById("inputField");
        this.noteContentInput = document.getElementById("inputFieldTxt");
        this.modalCancelButton = document.querySelector("#modalCancelButton");
        this.modalCancelButton.addEventListener("click", () => this.hideModal());
    }
    showModal() {
        this.modal.style.display = "flex";
    }
    hideModal() {
        this.modal.style.display = "none";
    }
    gatherInputs(e) {
        e.preventDefault();
        console.log();
        const content = this.noteContentInput.value;
        const title = this.noteTitleInput.value;
        this.addNewNote(content, title);
    }
    addNewNote(content, title, id) {
        const newDate = new Date().toISOString().slice(0, 10).split("-").reverse().join("/");
        noteOperations.noteAdder(Math.random(), content, newDate, title);
    }
}
class NoteOperations {
    constructor() {
        this.notes = [];
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
    noteAdder(id, content, date, title) {
        const newNote = new Note(id, content, date, title);
        this.notes.push(newNote);
        this.saveToLocalStorage();
        this.renderNotes();
    }
    deleteNote(id) {
        const filtered = this.notes.filter((note) => note.id !== id);
        this.notes = filtered;
        this.saveToLocalStorage();
        this.renderNotes();
    }
    renderNotes() {
        const hostElement = document.getElementById("note-container");
        hostElement.innerHTML = "";
        for (let oneNote of this.notes) {
            let newNoteItem = new NoteItem("single-note", "note-container");
            newNoteItem.setElementData(oneNote.title, oneNote.content, oneNote.date, oneNote.id);
        }
    }
}
class NoteItem {
    constructor(templateElementId, hostElementId) {
        this.templateElement = document.getElementById(templateElementId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
    }
    setElementData(title, content, date, id) {
        this.element.querySelector("#content").textContent = content;
        this.element.querySelector("#header").textContent = title;
        this.element.querySelector("#date").textContent = date;
        this.element.querySelector("#deleteBtn").addEventListener("click", () => noteOperations.deleteNote(id));
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const header = new Header();
const noteOperations = new NoteOperations();
