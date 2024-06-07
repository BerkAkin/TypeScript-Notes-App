export default abstract class Component<hostEle extends HTMLElement, Ele extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: hostEle;
    element: Ele;
  
    constructor(templateElementId: string, hostElementId: string) {
      this.templateElement = document.getElementById(templateElementId) as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as hostEle;
      const importedNode = document.importNode(this.templateElement.content, true);
      this.element = importedNode.firstElementChild as Ele;
      this.attach();
    }
  
    protected attach() {
      this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
  }
  