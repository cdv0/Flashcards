// Simple in-memory data for your flashcard sets
const sets = [
    {
      id: "1",
      title: "Python Basics",
      description: "Core Python syntax and data structures",
      section: "Computer Science",
      cards: [
        {
          term: "What is a list comprehension in Python?",
          definition:
            "A short way to build lists.\nExample: squares = [x*x for x in range(10)]",
        },
        {
          term: "What is a dictionary in Python?",
          definition:
            "A key-value data structure.\nExample: user = { 'name': 'Krisha', 'age': 20 }",
        },
        {
          term: "What does len() do?",
          definition: "Returns the length (number of items) in a list, string, etc.",
        },
      ],
    },
    {
      id: "2",
      title: "Calculus: Derivatives",
      description: "Basic derivative rules for calculus",
      section: "Mathematics",
      cards: [
        {
          term: "Power Rule",
          definition: "If f(x) = x^n, then f'(x) = n·x^(n−1).",
        },
        {
          term: "Product Rule",
          definition: "If y = f(x)·g(x), then y' = f'(x)g(x) + f(x)g'(x).",
        },
        {
          term: "Chain Rule",
          definition: "If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x).",
        },
      ],
    },
  ];
  
  let filteredSets = [...sets];
  let currentSet = null;
  let currentCardIndex = 0;
  let showingDefinition = false;
  
  // Grab DOM elements
  const setsListEl = document.getElementById("sets-list");
  const searchInputEl = document.getElementById("search-input");
  
  const currentSetTitleEl = document.getElementById("current-set-title");
  const currentSetDescEl = document.getElementById("current-set-description");
  
  const cardBoxEl = document.getElementById("card-box");
  const cardTermEl = document.getElementById("card-term");
  const cardDefinitionEl = document.getElementById("card-definition");
  const cardCounterEl = document.getElementById("card-counter");
  
  const prevCardBtn = document.getElementById("prev-card");
  const flipCardBtn = document.getElementById("flip-card");
  const nextCardBtn = document.getElementById("next-card");
  
  // Render the list of sets on the left
  function renderSets() {
    setsListEl.innerHTML = "";
  
    if (filteredSets.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No sets found. Try a different search.";
      emptyMsg.style.fontSize = "13px";
      emptyMsg.style.color = "#6b7280";
      setsListEl.appendChild(emptyMsg);
      return;
    }
  
    filteredSets.forEach((set) => {
      const card = document.createElement("button");
      card.className = "set-card";
      card.dataset.id = set.id;
  
      if (currentSet && currentSet.id === set.id) {
        card.classList.add("active");
      }
  
      const title = document.createElement("div");
      title.className = "set-card-title";
      title.textContent = set.title;
  
      const description = document.createElement("div");
      description.className = "set-card-description";
      description.textContent = set.description;
  
      const meta = document.createElement("div");
      meta.className = "set-card-meta";
      meta.textContent = `${set.section} • ${set.cards.length} cards`;
  
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(meta);
  
      card.addEventListener("click", () => {
        selectSet(set.id);
      });
  
      setsListEl.appendChild(card);
    });
  }
  
  // Select a set
  function selectSet(setId) {
    currentSet = sets.find((s) => s.id === setId);
    currentCardIndex = 0;
    showingDefinition = false;
  
    // Update set header
    currentSetTitleEl.textContent = currentSet.title;
    currentSetDescEl.textContent = currentSet.description;
  
    // Enable card box and buttons
    cardBoxEl.classList.remove("disabled");
    flipCardBtn.disabled = false;
    nextCardBtn.disabled = currentSet.cards.length <= 1;
    prevCardBtn.disabled = true;
  
    renderCurrentCard();
    renderSets(); // re-render left panel so "active" class updates
  }
  
  // Show the current card term/definition
  function renderCurrentCard() {
    if (!currentSet) return;
  
    const card = currentSet.cards[currentCardIndex];
  
    cardTermEl.textContent = card.term;
    cardDefinitionEl.textContent = card.definition;
  
    if (showingDefinition) {
      cardDefinitionEl.classList.remove("hidden");
      flipCardBtn.textContent = "Hide Answer";
    } else {
      cardDefinitionEl.classList.add("hidden");
      flipCardBtn.textContent = "Show Answer";
    }
  
    cardCounterEl.textContent = `${currentCardIndex + 1} / ${
      currentSet.cards.length
    } cards`;
  
    // Update prev/next disabled state
    prevCardBtn.disabled = currentCardIndex === 0;
    nextCardBtn.disabled = currentCardIndex === currentSet.cards.length - 1;
  }
  
  // Button handlers
  flipCardBtn.addEventListener("click", () => {
    if (!currentSet) return;
    showingDefinition = !showingDefinition;
    renderCurrentCard();
  });
  
  nextCardBtn.addEventListener("click", () => {
    if (!currentSet) return;
    if (currentCardIndex < currentSet.cards.length - 1) {
      currentCardIndex++;
      showingDefinition = false;
      renderCurrentCard();
    }
  });
  
  prevCardBtn.addEventListener("click", () => {
    if (!currentSet) return;
    if (currentCardIndex > 0) {
      currentCardIndex--;
      showingDefinition = false;
      renderCurrentCard();
    }
  });
  
  // Search / filter sets
  searchInputEl.addEventListener("input", () => {
    const q = searchInputEl.value.toLowerCase().trim();
  
    if (!q) {
      filteredSets = [...sets];
    } else {
      filteredSets = sets.filter((set) => {
        return (
          set.title.toLowerCase().includes(q) ||
          set.description.toLowerCase().includes(q) ||
          set.section.toLowerCase().includes(q)
        );
      });
    }
  
    renderSets();
  });
  
  // Initial render
  renderSets();
  