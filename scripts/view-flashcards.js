document.addEventListener("DOMContentLoaded", () => {
    // Fake data for the view page
    const cards = [
      {
        term: "Usability",
        definition: "Usability is the ...",
      },
      {
        term: "The ease with which a user can use a product",
        definition:
          "The ease with which a user can use a product or software to perform the core tasks.",
      },
    ];
  
    let currentIndex = 0;
  
    // DOM refs
    const cardTermEl = document.getElementById("set-view-card-term");
    const cardIndexLabel = document.getElementById("card-index-label");
    const cardTotalLabel = document.getElementById("card-total-label");
    const prevBtn = document.getElementById("prev-card-btn");
    const nextBtn = document.getElementById("next-card-btn");
  
    const termsCountPill = document.getElementById("terms-count-pill");
    const termsTableBody = document.getElementById("terms-table-body");
  
    const setMenuButton = document.getElementById("set-view-menu-button");
    const setMenu = document.getElementById("set-view-menu");
  
    // Helpers
    function closeAllMenus() {
      document
        .querySelectorAll(".menu-dropdown")
        .forEach((m) => m.classList.add("hidden"));
    }
  
    function renderMainCard() {
      const total = cards.length;
      if (total === 0) {
        cardTermEl.textContent = "No cards yet";
        cardIndexLabel.textContent = "0";
        cardTotalLabel.textContent = "0";
        return;
      }
  
      const card = cards[currentIndex];
      cardTermEl.textContent = card.term || "Untitled term";
      cardIndexLabel.textContent = String(currentIndex + 1);
      cardTotalLabel.textContent = String(total);
  
      // highlight active row in table
      document
        .querySelectorAll(".terms-table__row")
        .forEach((row, idx) => {
          row.classList.toggle("terms-table__row--active", idx === currentIndex);
        });
    }
  
    function renderTermsTable() {
      termsTableBody.innerHTML = "";
      cards.forEach((card, idx) => {
        const row = document.createElement("div");
        row.className = "terms-table__row";
        row.dataset.index = idx.toString();
  
        row.innerHTML = `
          <div class="terms-table__cell terms-table__cell--index">
            ${idx + 1}
          </div>
          <div class="terms-table__cell">${card.term}</div>
          <div class="terms-table__cell">${card.definition}</div>
          <div class="terms-table__cell terms-table__cell--actions">
            <button class="btn btn-outline btn-tiny" type="button">Add to ..</button>
            <button class="icon-button icon-button--inline" type="button">🗑</button>
            <button class="icon-button icon-button--inline" type="button">✏️</button>
          </div>
        `;
  
        // click row → show that card in main view
        row.addEventListener("click", () => {
          currentIndex = idx;
          renderMainCard();
        });
  
        termsTableBody.appendChild(row);
      });
  
      const n = cards.length;
      termsCountPill.textContent = n === 1 ? "1 term" : `${n} terms`;
    }
  
    // Prev/Next handlers
    prevBtn.addEventListener("click", () => {
      if (cards.length === 0) return;
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      renderMainCard();
    });
  
    nextBtn.addEventListener("click", () => {
      if (cards.length === 0) return;
      currentIndex = (currentIndex + 1) % cards.length;
      renderMainCard();
    });
  
    // Set menu (three dots)
    setMenuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const hidden = setMenu.classList.contains("hidden");
      closeAllMenus();
      if (hidden) setMenu.classList.remove("hidden");
    });
  
    document.addEventListener("click", (event) => {
      // close if clicked outside menus
      if (
        !event.target.closest(".menu-dropdown") &&
        !event.target.closest(".menu-wrapper")
      ) {
        closeAllMenus();
      }
    });
  
    // Initial render
    renderTermsTable();
    renderMainCard();
    closeAllMenus();
  });
  