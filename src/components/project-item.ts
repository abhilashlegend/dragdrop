/// <references path="base-component.ts" />

namespace App {
     // ProjectItem Class
    export class ProjectItem extends Component<HTMLUListElement, HTMLElement> implements Draggable {
        private project: Project;
    
        getPerson() {
          if(this.project.people === 1){
            return "1 person";
          } else {
            return `${this.project.people} persons`;
          }
        }
    
        constructor(hostId: string, project: Project){
          super('single-project', hostId, false, project.id);
          this.project = project;
    
          this.configure();
          this.renderContent();
    
        }
    
        dragStartHandler(event: DragEvent): void {
          event.dataTransfer!.setData('text/plain', this.project.id);
          event.dataTransfer!.effectAllowed = 'move';
        }
    
        dragEndHandler(_: DragEvent): void {
          //console.log('DragEnd');
        }
    
        configure(): void {
          this.element.addEventListener('dragstart', this.dragStartHandler.bind(this));
          this.element.addEventListener('dragend', this.dragEndHandler.bind(this));
        }
    
        renderContent(): void {
          this.element.querySelector('h2')!.textContent = this.project.title;
          this.element.querySelector('h3')!.textContent = this.getPerson() + ' assigned';
          this.element.querySelector('p')!.textContent = this.project.description;
        }
    
      }    
}