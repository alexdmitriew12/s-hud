// Pobierz referencje do elementów
const healthBar = document.getElementById("healthBar");
const foodBar = document.getElementById("foodBar");
const waterBar = document.getElementById("waterBar");
const oxygenBar = document.getElementById("oxygenBar");
const armorBar = document.getElementById("armorBar");
const carHud = document.getElementById("carhud")
const engineBar = document.getElementById("engineBar")
const petrolBar = document.getElementById("petrolBar")
const seatbeltBar = document.getElementById("seatbeltBar")
const speedElement = document.getElementById("speed");
const rpmBarElement = document.getElementById("rpmBar");
const unit = document.getElementById("unit");




function updateBar(element, value) {
    if (element && value !== undefined) {
        element.dataset.value = value; 
        element.style.setProperty("--value", value); 
    }
}

window.addEventListener("message", function (event) {
    const data = event.data;

    if (data.action === "updateHUD") {
        if (data.hp !== undefined) {
            updateBar(healthBar, data.hp);
        }

        if (data.food !== undefined) {
            updateBar(foodBar, data.food);
        }

        if (data.water !== undefined) {
            updateBar(waterBar, data.water);
        }

        if (data.armour !== undefined) {
            if (data.armour > 0) {
                armorBar.style.display = "block";
            } else {
                armorBar.style.display = "none";
            }
            updateBar(armorBar, data.armour);
        }

        if (data.oxygen !== undefined) {
            if (data.oxygen < 100) {
                oxygenBar.style.display = "block";
            } else {
                oxygenBar.style.display = "none";
            }
            updateBar(oxygenBar, data.oxygen);
        }

        const locationElement = document.getElementById("street");
        if (data.location !== undefined) {
            locationElement.innerText = data.location;
        }
    }
});


// car hud
window.addEventListener("message", function (event) {
    const data = event.data;

    if (data.action === "updateHUD") {
        carHud.style.display = "block";

        if (data.speed !== undefined) {
            document.getElementById("speed").textContent = data.speed;
        }

        if (data.isMph !== undefined) {
            const unit = document.querySelector(".unit"); 
            unit.textContent = data.isMph ? "mp/h" : "km/h";
        }

        if (data.rpm !== undefined && data.maxRpm !== undefined) {
            const rpmBar = document.getElementById("rpmBar");
            rpmBar.style.width = `${(data.rpm / data.maxRpm) * 100}%`;
        }

        if (data.petrol !== undefined) {
            updateBar(petrolBar, data.petrol);
        }

        if (data.engine !== undefined) {
            if (data.engine < 850) {
                engineBar.style.backgroundColor = "red";
                engineBar.style.boxShadow = "0 0 15px rgba(219, 14, 14, 0.7)";
            } else if (data.engine < 700) {
                engineBar.style.backgroundColor = "orange";
                engineBar.style.boxShadow = "0 0 15px rgba(255, 165, 0, 0.7)";
            } else {
                engineBar.style.background = "linear-gradient(145deg, rgba(10, 10, 10, 0.7), rgba(40, 40, 40, 0.9))";
            }
        }

        if (data.seatBelt !== undefined) {
            if (data.seatBelt === true) {
                seatbeltBar.style.background = "linear-gradient(to top, rgba(129, 43, 238, 0.9), rgba(168, 92, 255, 0.7), rgba(197, 134, 255, 0.5))";
                seatbeltBar.style.boxShadow = "none";
            } else {
                seatbeltBar.style.background = "linear-gradient(145deg, rgba(10, 10, 10, 0.7), rgba(40, 40, 40, 0.9))";
                seatbeltBar.style.boxShadow = "0 0 15px rgba(219, 14, 14, 0.7)";
            }
        }
    }

    if (data.action === "hideHUD") {
        carHud.style.display = "none";
    }
});


