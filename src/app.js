"use strict";
class Note {
    constructor(id, content, date, title, checks) {
        this.id = id;
        this.content = content;
        this.date = date;
        this.title = title;
        this.checks = checks;
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
        this.checkList = [];
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
        this.checklistModalInput = document.querySelector("#checkAdderModalInput");
        this.checklistModal = document.querySelector("#checkListAdderModal");
        this.checklistModalCancelBtn = document.querySelector("#checklistModalCancelButton");
        this.checklistModalCancelBtn.addEventListener("click", () => {
            this.checklistModalInput.value = "";
            this.hideCheckModal();
        });
        this.checklistModalAddBtn = document.querySelector("#checklistModalAddButton");
        this.checklistModalAddBtn.addEventListener("click", () => {
            this.gatherCheckModalInputs();
        });
        this.checklistBtn = document.querySelector("#modalAddChecklistButton");
        this.checklistBtn.addEventListener("click", () => {
            this.showCheckModal();
        });
        this.checklistList = document.querySelector("#checkListField");
    }
    showModal() {
        this.modal.style.display = "flex";
    }
    hideModal() {
        this.checklistList.innerHTML = "";
        this.checkList = [];
        this.modal.style.display = "none";
    }
    gatherInputs(e) {
        e.preventDefault();
        const content = this.noteContentInput.value;
        const title = this.noteTitleInput.value;
        const checks = this.checkList;
        this.addNewNote(content, title, checks);
    }
    addNewNote(content, title, checks) {
        const newDate = new Date().toISOString().slice(0, 10).split("-").reverse().join("/");
        noteOperations.noteAdder(Math.random(), content, newDate, title, checks);
        this.checkList = [];
        this.checklistList.innerHTML = "";
        this.hideModal();
    }
    addNewCheckItem(text) {
        const newCheckElement = `<input type="checkbox" id="${text}" class="${text}" /><label for="${text}">${text}</label><br>`;
        this.checklistList.innerHTML += newCheckElement;
        this.checkList.push(text);
    }
    showCheckModal() {
        this.hideModal();
        this.checklistModal.style.display = "flex";
    }
    hideCheckModal() {
        this.checklistModal.style.display = "none";
        this.showModal();
    }
    gatherCheckModalInputs() {
        this.checkList.push(this.checklistModalInput.value);
        this.hideCheckModal();
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
    noteAdder(id, content, date, title, checks) {
        const newNote = new Note(id, content, date, title, checks);
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
            newNoteItem.setElementData(oneNote.title, oneNote.content, oneNote.date, oneNote.id, oneNote.checks);
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
    setElementData(title, content, date, id, checks) {
        this.element.querySelector("#content").textContent = content;
        this.element.querySelector("#header").textContent = title;
        this.element.querySelector("#date").textContent = date;
        this.element.querySelector("#deleteBtn").addEventListener("click", () => noteOperations.deleteNote(id));
        for (let chck in checks) {
            this.element.querySelector("#checklistInNote").innerHTML += `<input type="checkbox" id="${checks[chck]}" class="${checks[chck]}" /><label for="${checks[chck]}">${checks[chck]}</label><br>`;
        }
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const header = new Header();
const noteOperations = new NoteOperations();
//TODO: CHECKLIST ADDITION TO NOTES and adjust modal windows
