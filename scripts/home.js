// scripts/home.js
import { syncSectionsFromDOM, refreshSectionSelect } from './state.js';
import { setupAddSectionModal } from './addSectionModal.js';
import { setupCreateSetModal } from './createSetModal.js';
import { setupSectionAndCardMenus } from './menus.js';

document.addEventListener('DOMContentLoaded', () => {
  syncSectionsFromDOM();
  refreshSectionSelect();

  setupAddSectionModal();
  setupCreateSetModal();
  setupSectionAndCardMenus();
});
