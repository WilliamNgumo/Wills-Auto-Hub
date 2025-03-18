import home from "./views/home.js";
import about from "./views/about.js";
import contact from "./views/contact.js";

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        {path: "/", view: home},
        {path: "/about", view: about},
        {path: "/contact", view: contact}
    ];

    //testing for match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        };
    });
    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
    match = {
        route: routes[0],
        isMatch: true
    }
    
    };

    const view = new match.route.view();

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    })
    router();
});

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector("button[onclick='searchcar()']");
    if (searchButton) {
        searchButton.addEventListener("click", searchcar); 
    }
});


function searchcar() {
    let query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert("Enter car make and model");
        return;
    }

    fetch(`https://cors-anywhere.herokuapp.com/https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=${query}&model=${query}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch car details: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        data = JSON.parse(data.replace("/**/", "").slice(1, -1));
        let output = document.getElementById('output');
        if (data.Trims.length === 0) {
            output.innerHTML = "<p>Details not found.</p>";
            return;
        }
        let car = data.Trims[0];
        let imageUrl = `https://source.unsplash.com/400x300/?${car.make_display} ${car.model_name},car`;

        output.innerHTML = `
            <p><strong>Make:</strong> ${car.make_display}</p>
            <p><strong>Model:</strong> ${car.model_name}</p>
            <p><strong>Year:</strong> ${car.model_year}</p>
            <p><strong>Body Type:</strong> ${car.model_body}</p>
            <p><strong>Engine Type:</strong> ${car.model_engine_type}</p>
            <p><strong>Horsepower:</strong> ${car.model_engine_power_ps} PS</p>
            <button onclick="saveCar('${car.make_display}', '${car.model_name}')">Save Car</button>
            <img src="${imageUrl}" alt="${car.make_display} ${car.model_name}" />
        `;
    })
    .catch(error => console.error('Error fetching car details:', error));
}




function displaySavedCars() {
    fetch('http://localhost:4000/api/getSavedCars')
        .then(response => response.json())
        .then(cars => {
            let savedCarsList = document.getElementById('savedCars');
            savedCarsList.innerHTML = "";
            if (cars.length === 0) {
                savedCarsList.innerHTML = "<p>No cars saved yet</p>";
            }
            cars.forEach(car => {
                let listItem = document.createElement('li');
                listItem.innerHTML = `${car.make} ${car.model} 
                <button onclick="deleteCar('${car._id}')">Delete</button>`;
                savedCarsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error fetching saved cars:", error);
            let savedCarsList = document.getElementById('savedCars');
            savedCarsList.innerHTML = "<p>Failed to load saved cars. Please try again later.</p>";
        });
}


function saveCar(make, model) {
    fetch('http://localhost:4000/api/saveCar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ make, model })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Error saving car:', error));
}

function deleteCar(id) {
    fetch(`http://localhost:4000/api/deleteCar/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        displaySavedCars();
    })
    .catch(error => console.error('Error deleting car:', error));
}
displaySavedCars();