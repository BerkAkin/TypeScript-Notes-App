import { noteOperations } from "../Components/NoteOperations.js";
export default class NoteItem {
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
        if (checks.length !== 0) {
            this.element.querySelector("#content").innerHTML += `<hr style="margin-top:15px">`;
            console.log(checks);
        }
        for (let chck in checks) {
            this.element.querySelector("#checklistInNote").innerHTML += `
        <input type="checkbox" id="${checks[chck]}" class="${checks[chck]}" />
        <p style="display:inline;" for="${checks[chck]}">${checks[chck]}</p><br>`;
        }
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
