import { noteOperations } from "../Components/NoteOperations";
import Component from "../Components/Component";

export default class Header extends Component<HTMLDivElement, HTMLDivElement> {
  showModalBtn: HTMLButtonElement;
  modal: HTMLDivElement;
  modalAddNewNoteButton: HTMLButtonElement;
  modalCancelButton: HTMLButtonElement;
  modalForm: HTMLFormElement;

  noteTitleInput: HTMLInputElement;
  noteContentInput: HTMLTextAreaElement;

  checklistBtn: HTMLButtonElement;
  checklistList: HTMLDivElement;
  checkList: string[] = [];

  checklistModal: HTMLDivElement;
  checklistModalAddBtn: HTMLButtonElement;
  checklistModalCancelBtn: HTMLButtonElement;
  checklistModalInput: HTMLInputElement;

  constructor() {
    super("tmp-note-container-header", "app");
    this.configure();
  }

  configure() {
    this.showModalBtn = document.querySelector("#add-btn")! as HTMLButtonElement;
    this.showModalBtn.addEventListener("click", () => this.showModal());

    this.modal = document.querySelector("#modal")! as HTMLDivElement;

    this.modalForm = document.querySelector("#addNoteForm")! as HTMLFormElement;
    this.modalForm.addEventListener("submit", this.gatherInputs.bind(this));

    this.noteTitleInput = document.getElementById("inputField") as HTMLInputElement;
    this.noteContentInput = document.getElementById("inputFieldTxt")! as HTMLTextAreaElement;

    this.modalCancelButton = document.querySelector("#modalCancelButton")! as HTMLButtonElement;
    this.modalCancelButton.addEventListener("click", () => this.hideModal());

    this.checklistModalInput = document.querySelector("#checkAdderModalInput")! as HTMLInputElement;

    this.checklistModal = document.querySelector("#checkListAdderModal")! as HTMLDivElement;
    this.checklistModalCancelBtn = document.querySelector("#checklistModalCancelButton")! as HTMLButtonElement;
    this.checklistModalCancelBtn.addEventListener("click", () => {
      this.checklistModalInput.value = "";
      this.hideCheckModal();
    });
    this.checklistModalAddBtn = document.querySelector("#checklistModalAddButton")! as HTMLButtonElement;
    this.checklistModalAddBtn.addEventListener("click", () => {
      this.gatherCheckModalInputs();
    });

    this.checklistBtn = document.querySelector("#modalAddChecklistButton")! as HTMLButtonElement;
    this.checklistBtn.addEventListener("click", () => {
      this.showCheckModal();
    });

    this.checklistList = document.querySelector("#checkListField")! as HTMLDivElement;
  }
  showModal() {
    this.modal.style.display = "flex";
  }
  hideModal() {
    this.checklistList.innerHTML = "";
    this.checkList = [];
    this.modal.style.display = "none";
  }
  gatherInputs(e: Event) {
    e.preventDefault();
    const content = this.noteContentInput.value;
    const title = this.noteTitleInput.value;
    const checks = this.checkList;
    this.addNewNote(content, title, checks);
  }
  addNewNote(content: string, title: string, checks: string[]) {
    const newDate = new Date().toISOString().slice(0, 10).split("-").reverse().join("/");
    noteOperations.noteAdder(Math.random(), content, newDate, title, checks);
    this.checkList = [];
    this.checklistList.innerHTML = "";
    this.hideModal();
  }
  addNewCheckItem(text: string) {
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
