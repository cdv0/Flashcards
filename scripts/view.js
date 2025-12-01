import { openDeleteConfirmationModal } from './openDeleteConfirmationModal.js';
import { openChangeSectionModal } from './changeSectionModal.js';

const terms = [
    { term: "Term", definition: "Usability is the ..." },
    { term: "Usability", definition: "The ease with which a user can use a product..." }
];

let index = 0;
const termDisplay = document.getElementById("flashcard-term");
const counter = document.getElementById("counter");

function updateFlashcard() {
    termDisplay.textContent = terms[index].term;
    counter.textContent = `${index + 1} of ${terms.length}`;
}

document.getElementById("next-btn").onclick = () => {
    if (index < terms.length - 1) index++;
    updateFlashcard();
};

document.getElementById("prev-btn").onclick = () => {
    if (index > 0) index--;
    updateFlashcard();
};

// STUDY BUTTON REDIRECT
document.querySelector(".study-btn").onclick = () => {
    window.location.href = "../pages/study.html";
};

// SUCCESS POPUP FUNCTION
function showSuccess(message) {
    const popup = document.getElementById("successPopup");
    const msg = document.getElementById("successMsg");

    msg.textContent = message;

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}

// EDIT BUTTON (pencil icon) - Redirect to edit page
const editBtn = document.querySelectorAll('.icon-btn')[0]; // First icon button is the edit (✎)

if (editBtn) {
    editBtn.addEventListener('click', () => {
        console.log('Edit button clicked!');
        window.location.href = '../pages/add_cards_set.html';
    });
}

// THREE DOTS MENU DROPDOWN TOGGLE
const menuBtn = document.querySelector(".menu-btn");
const dropdown = document.querySelector(".dropdown-menu");

console.log('Menu button found:', menuBtn);
console.log('Dropdown found:', dropdown);

if (menuBtn && dropdown) {
    menuBtn.addEventListener("click", (e) => {
        console.log('Menu button clicked!');
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
        // Close add-to dropdown if open
        const addToDropdown = document.querySelector(".add-to-dropdown");
        if (addToDropdown) {
            addToDropdown.classList.add("hidden");
        }
        console.log('Dropdown classes:', dropdown.className);
    });
} else {
    console.error('Menu button or dropdown not found!');
}

// DROPDOWN ITEM CLICKS (Change section, Edit details, Delete set, etc.)
const dropdownItems = document.querySelectorAll('.dropdown-menu:not(.add-to-dropdown) .dropdown-item');
console.log('Found dropdown items:', dropdownItems.length);

dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemText = item.textContent.trim();
        console.log('Dropdown item clicked:', itemText);
        
        if (item.classList.contains('delete')) {
            console.log('Delete button clicked!');
            
            openDeleteConfirmationModal(
                'CECS 448 Midterm 2',
                'CECS 448',
                () => {
                    console.log('Set deleted!');
                    // window.location.href = '../pages/home.html';
                }
            );
        } else if (itemText === 'Change section') {
            console.log('Change section clicked!');
            
            // Open the change section modal
            openChangeSectionModal(
                'CECS 448 Midterm 2',  // Set name
                'CECS 448',             // Current section name
                (newSectionName) => {
                    console.log('Section changed to:', newSectionName);
                    // Add logic to update the section
                    showSuccess(`Set moved to section "${newSectionName}"!`);
                }
            );
        } else if (itemText === 'Edit details') {
            console.log('Edit details clicked!');
            // Add your edit details logic here
        } else if (itemText === 'Edit set') {
            console.log('Edit set clicked!');
            // Redirect to edit page
            window.location.href = '../pages/add_cards_set.html';
        }
        
        dropdown.classList.add('hidden');
    });
});

// ADD TO DROPDOWN TOGGLE
const addToBtn = document.querySelector(".add-btn");
const addToDropdown = document.querySelector(".add-to-dropdown");

if (addToBtn && addToDropdown) {
    addToBtn.addEventListener("click", (e) => {
        console.log('Add to button clicked!');
        e.stopPropagation();
        addToDropdown.classList.toggle("hidden");
        // Close the other dropdown if open
        dropdown.classList.add("hidden");
    });
}

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".add-to-container")) {
        if (addToDropdown) {
            addToDropdown.classList.add("hidden");
        }
    }
    if (!e.target.closest(".dropdown-container:not(.add-to-container)")) {
        if (dropdown) {
            dropdown.classList.add("hidden");
        }
    }
});

// ADD TO DROPDOWN ITEM CLICKS
const addToItems = document.querySelectorAll('.add-to-dropdown .dropdown-item');

addToItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Add to item clicked:', item.textContent);
        
        if (item.classList.contains('add-category')) {
            // Handle "Add New Category" click
            const categoryName = prompt('Enter new category name:');
            if (categoryName) {
                console.log('New category:', categoryName);
                // Show success message for new category
                showSuccess(`Added term "${terms[index].term}" to subset "${categoryName}".`);
            }
        } else {
            // Handle confidence level selection
            const confidenceLevel = item.textContent.trim();
            console.log('Selected confidence level:', confidenceLevel);
            
            // Show success message
            showSuccess(`Added term "${terms[index].term}" to subset "${confidenceLevel}".`);
        }
        
        addToDropdown.classList.add('hidden');
    });
});

updateFlashcard();