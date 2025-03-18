import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("contact");
    };
    async getHtml() {
        return `
            <h1 class="brother"> This Is contact Us </h1>
        `;
    };
} 