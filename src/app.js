"use strict";
class NoteItem {
    constructor() { }
}
class Note {
    constructor(id = Math.random(), content, date, title) { }
}
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
class NoteHeader {
    constructor() {
        this.templateElement = document.getElementById("tmp-note-container-header");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
        this.btn = document.getElementById("add-btn");
        this.btn.addEventListener("click", this.addNote.bind(this));
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
    addNote() { }
}
const el = new NoteHeader();
