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
            console.log(title, desc, people);
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