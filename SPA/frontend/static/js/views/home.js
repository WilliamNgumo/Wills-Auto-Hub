import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("home");
    };
    async getHtml() {
        return `
            <h1 class="brother"> Welcome to our dealership </h1>

            <h2> Car Search</h2>

            <input type="text" id="searchInput" placeholder="Enter car make or model" />
            <button onclick="searchcar()">Search</button>

            <h3>Car Details:</h3>
            <div id="output">Search for a car to see details.</div>

            <h3>Saved Cars:</h3>
            <ul id="savedCars"></ul>

        `;
    };
    afterRender() {
        const searchButton = document.getElementById("seachButton");
        searchButton.addEventListener("click", searchcar);
    }
}