import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("about");
    };
    async getHtml() {
        return `
            <h1 class="brother"> This Is About Us </h1>
        `;
    };
}