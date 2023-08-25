enum ProjectStatus { Active, Finished }

// Project Type
class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, 
        public status: ProjectStatus){

        }
}

type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {

    }

    static  getInstance() {
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener){
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, people: number){
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        );

        this.projects.push(newProject);
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

// Validation

interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?:number;
}

function validate(validatableInput: Validatable):boolean {
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if(validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// Project List Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[]

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.assignedProjects = [];

        projectState.addListener((projects:Project[]) => {
            const relevantProjects = projects.filter(prj => { 
                if(this.type === 'active'){
                    return prj.status === ProjectStatus.Active;
                } else {
                   return prj.status === ProjectStatus.Finished;
                }
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
        this.attach();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for(const projectitem of this.assignedProjects){
            const listItem = document.createElement('li');
            listItem.textContent = projectitem.title;
            listEl.appendChild(listItem);
        }
    }

    private attach() {
     this.hostElement.insertAdjacentElement('beforeend', this.element);   
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;

        const headingTwo = this.element.querySelector('h2')!;
        headingTwo.textContent = this.type.toUpperCase() + ' PROJECTS'
    }
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionElement: HTMLInputElement;
    peopleElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';
        this.attach();
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleElement = this.element.querySelector("#people") as HTMLInputElement;
        this.configure();
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionElement.value = '';
        this.peopleElement.value = '';
    }

    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
       
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesc = this.descriptionElement.value;
        const enteredPeople = this.peopleElement.value;

        const validateTitle:Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 3,
            maxLength: 30,
        }

        const validateDescription:Validatable = {
            value: enteredDesc,
            required: true,
            minLength: 5,
        }
        const validatePeople:Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }


        if(!validate(validateTitle) ||
           !validate(validateDescription) ||
           !validate(validatePeople)){
            alert("Invalid input, please try again!");
            return;
           } else {
            return [enteredTitle, enteredDesc, +enteredPeople]
           }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
}

const projectInput = new ProjectInput();
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
