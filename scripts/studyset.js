let current = 0;
let showingFront = true;

const cardFront = document.getElementById("card-front");
const cardBack = document.getElementById("card-back");

function loadCard(index) {
    cardFront.textContent = cards[index].front;
    cardBack.textContent = cards[index].back;
    cardFront.style.display = "flex";
    cardBack.style.display = "none";
    showingFront = true;
}

document.getElementById("flip").addEventListener("click", () => {
    if (showingFront) {
        cardFront.style.display = "none";
        cardBack.style.display = "flex";
    } else {
        cardFront.style.display = "flex";
        cardBack.style.display = "none";
    }
    showingFront = !showingFront;
});

document.getElementById("next").addEventListener("click", () => {
    current = (current + 1) % cards.length;
    loadCard(current);
});

document.getElementById("prev").addEventListener("click", () => {
    current = (current - 1 + cards.length) % cards.length;
    loadCard(current);
});

// Load first card
loadCard(current);

