let index = 1;
const total = 4;

const counter = document.getElementById("counter");

document.getElementById("next-btn").onclick = () => {
    if (index < total) index++;
    updateCounter();
};

document.getElementById("prev-btn").onclick = () => {
    if (index > 1) index--;
    updateCounter();
};

function updateCounter() {
    counter.textContent = `${index} of ${total}`;
}