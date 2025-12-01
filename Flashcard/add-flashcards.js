// Basic fake data for the "Terms in this set" list
let terms = [
    {
      id: 2,
      term: "Usability",
      definition: "Usability is the ...",
    },
    {
      id: 1,
      term: "Term 1",
      definition: "Definition 1",
    },
  ];
  
  const termInput = document.getElementById("term-input");
  const defInput = document.getElementById("definition-input");
  const addBtn = document.getElementById("editor-add");
  const clearBtn = document.getElementById("editor-clear");
  
  const toast = document.getElementById("editor-success");
  const toastTermName = document.getElementById("toast-term-name");
  const termsList = document.getElementById("terms-list");
  const termsCountBadge = document.getElementById("terms-count-badge");
  
  let toastTimeoutId = null;
  
  // Render the "Terms in this set" list
  function renderTerms() {
    termsList.innerHTML = "";
  
    terms.forEach((t, index) => {
      const row = document.createElement("div");
      row.className = "term-row";
  
      const top = document.createElement("div");
      top.className = "term-row__top";
  
      const indexLabel = document.createElement("div");
      indexLabel.className = "term-row__index";
      // Show descending numbers like screenshot (2, 1, ...)
      indexLabel.textContent = terms.length - index;
  
      const delBtn = document.createElement("button");
      delBtn.className = "term-row__delete";
      delBtn.innerHTML = "🗑";
      delBtn.addEventListener("click", () => {
        terms = terms.filter((item) => item.id !== t.id);
        renderTerms();
      });
  
      top.appendChild(indexLabel);
      top.appendChild(delBtn);
  
      const content = document.createElement("div");
      content.className = "term-row__content";
  
      // Term column
      const termCol = document.createElement("div");
      termCol.className = "term-row__column";
  
      const termLabel = document.createElement("div");
      termLabel.textContent = "Term";
  
      const termToolbar = document.createElement("div");
      termToolbar.className = "term-row__toolbar";
      termToolbar.innerHTML = `
        <button class="toolbar-pill">B</button>
        <button class="toolbar-pill">I</button>
        <button class="toolbar-pill">U</button>
        <button class="toolbar-pill">🔦</button>
        <button class="toolbar-pill">A</button>
        <button class="toolbar-pill toolbar-pill--chip">Equation</button>
        <button class="toolbar-pill toolbar-pill--chip">Code block</button>
      `;
  
      const termTextarea = document.createElement("textarea");
      termTextarea.className =
        "field-input field-input--multiline editor-large-input";
      termTextarea.value = t.term;
  
      termCol.appendChild(termLabel);
      termCol.appendChild(termToolbar);
      termCol.appendChild(termTextarea);
  
      // Definition column
      const defCol = document.createElement("div");
      defCol.className = "term-row__column";
  
      const defLabel = document.createElement("div");
      defLabel.textContent = "Definition";
  
      const defToolbar = document.createElement("div");
      defToolbar.className = "term-row__toolbar";
      defToolbar.innerHTML = termToolbar.innerHTML;
  
      const defTextarea = document.createElement("textarea");
      defTextarea.className =
        "field-input field-input--multiline editor-large-input";
      defTextarea.value = t.definition;
  
      defCol.appendChild(defLabel);
      defCol.appendChild(defToolbar);
      defCol.appendChild(defTextarea);
  
      content.appendChild(termCol);
      content.appendChild(defCol);
  
      row.appendChild(top);
      row.appendChild(content);
  
      termsList.appendChild(row);
    });
  
    // Update "2 terms" badge
    termsCountBadge.textContent =
      terms.length === 1 ? "1 term" : `${terms.length} terms`;
  }
  
  // Success toast behaviour
  function showToast(termName) {
    toastTermName.textContent = termName;
    toast.classList.remove("hidden");
  
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    toastTimeoutId = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2500);
  }
  
  // Add card button
  addBtn.addEventListener("click", () => {
    const termText = termInput.value.trim();
    const defText = defInput.value.trim();
  
    if (!termText && !defText) {
      alert("Please enter a term or definition first.");
      return;
    }
  
    const newId = Date.now();
  
    terms.unshift({
      id: newId,
      term: termText || "(Untitled term)",
      definition: defText || "",
    });
  
    renderTerms();
    showToast(termText || "(Untitled term)");
  
    // Clear editor inputs
    termInput.value = "";
    defInput.value = "";
  });
  
  // Clear button
  clearBtn.addEventListener("click", () => {
    termInput.value = "";
    defInput.value = "";
  });
  
  // Initial render
  renderTerms();
  