import Note from "../Objects/Note";
import NoteItem from "../Objects/NoteItem";

export default class NoteOperations {
  notes: Note[] = [];
  constructor() {
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

  noteAdder(id: number, content: string, date: string, title: string, checks: string[]) {
    const newNote = new Note(id, content, date, title, checks);
    this.notes.push(newNote);
    this.saveToLocalStorage();
    this.renderNotes();
  }

  deleteNote(id: number) {
    const filtered = this.notes.filter((note) => note.id !== id);
    this.notes = filtered;
    this.saveToLocalStorage();
    this.renderNotes();
  }

  renderNotes() {
    const hostElement = document.getElementById("note-container") as HTMLDivElement;
    hostElement.innerHTML = "";

    for (let oneNote of this.notes) {
      let newNoteItem = new NoteItem("single-note", "note-container");
      newNoteItem.setElementData(oneNote.title, oneNote.content, oneNote.date, oneNote.id, oneNote.checks);
    }
  }
}

export const noteOperations = new NoteOperations();
