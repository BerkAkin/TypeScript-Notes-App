import { noteOperations } from "../Components/NoteOperations.js";
import Component from "../Components/Component.js";
export default class Header extends Component {
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
    }
    showCheckModal() {
        this.checklistModal.style.display = "flex";
    }
    hideCheckModal() {
        this.checklistModal.style.display = "none";
        this.showModal();
    }
    gatherCheckModalInputs() {
        this.checkList.push(this.checklistModalInput.value);
        this.addNewCheckItem(this.checklistModalInput.value);
        this.hideCheckModal();
        console.log(this.checkList);
    }
}
export const header = new Header();
