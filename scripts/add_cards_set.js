const termInput = document.getElementById("termInput");
const defInput = document.getElementById("defInput");
const addBtn = document.getElementById("addCard");
const clearBtn = document.getElementById("clear");
const termsList = document.getElementById("termsList");
const termCount = document.getElementById("termCount");

let terms = [];
let id = 1;

/* Update badge */
function updateCount() {
    termCount.textContent = `${terms.length} terms`;
}

/* Render terms list */
function renderList() {
    termsList.innerHTML = "";

    terms
        .slice()
        .reverse()
        .forEach((card, idx) => {
            const div = document.createElement("div");
            div.className = "term-card";

            div.innerHTML = `
                <div class="term-header">
                    <div class="term-number">${terms.length - idx}</div>

                    <div>
                        <span class="delete-btn" data-id="${card.id}">🗑️</span>
                        <span class="drag-btn">⋮⋮</span>
                    </div>
                </div>

                <div class="row">
                    <div class="field">
                        <label>Term</label>

                        <div class="format-bar">
                            <button class="format-btn bold-btn"><b>B</b></button>
                            <button class="format-btn italic-btn"><i>I</i></button>
                            <button class="format-btn underline-btn"><u>U</u></button>
                            <button>𝛬</button><button>◇</button><button>A</button>
                            <button class="gray">Equation</button>
                            <button class="gray">Code block</button>
                        </div>

                        <input class="term-input" value="${card.term}" />
                    </div>

                    <div class="field">
                        <label>Definition</label>

                        <div class="format-bar">
                            <button class="format-btn bold-btn"><b>B</b></button>
                            <button class="format-btn italic-btn"><i>I</i></button>
                            <button class="format-btn underline-btn"><u>U</u></button>
                            <button>𝛬</button><button>◇</button><button>A</button>
                            <button class="gray">Equation</button>
                            <button class="gray">Code block</button>
                        </div>

                        <textarea class="definition-input">${card.definition}</textarea>
                    </div>
                </div>
            `;


            termsList.appendChild(div);
        });

    updateCount();

    /* Delete event */
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => {
            const removeId = Number(btn.dataset.id);
            terms = terms.filter(t => t.id !== removeId);
            renderList();
        };
    });
}

/* Add card */
addBtn.onclick = () => {
    const term = termInput.value.trim();
    const def = defInput.value.trim();

    if (!term || !def) {
        alert("Please fill both Term and Definition.");
        return;
    }

terms.push({
    id: id++,
    term,
    definition: def
});

renderList();
    termInput.value = "";
    defInput.value = "";
};

/* Clear fields */
clearBtn.onclick = () => {
    termInput.value = "";
    defInput.value = "";
};
