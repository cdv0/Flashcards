# STEMCards - Flashcard Application for STEM Students

A user-centered flashcard application designed specifically for CSULB students and college students studying STEM subjects.

## 🎯 Target Audience
- CSULB students and college students
- Students studying STEM subjects (Computer Science, Mathematics, Engineering, Sciences)
- Students who need better support for code and mathematical notation

## 🚀 Key Features

### 1. **Section Organization**
- Organize flashcard sets into customizable sections
- Color-coded sections for easy visual identification
- Move sets between sections easily

### 2. **STEM-Focused Content Support**
- **Code Editor**: Syntax highlighting, language selection, code block formatting
- **Math Editor**: Quick access to mathematical symbols (∫, ∑, √, Greek letters, etc.)
- Support for superscripts, subscripts, and mathematical expressions
- Visual badges indicating code/math content

### 3. **Flexible Card Creation**
- **Add button always visible** (fixes Quizlet's scrolling issue)
- Quick delete button on each card (fixes Omnisets' menu navigation issue)
- Consistent edit interface (same design for creating and editing)
- Auto-detection of code and math content
- No minimum card requirement to save sets

### 4. **Study Mode**
- Full-screen card view with minimal distractions
- Card flipping animation
- Progress tracking with visual indicators
- Mark cards as "Mastered" or "Need Review"
- Shuffle and restart options
- Proper code and math rendering

### 5. **Quiz Mode**
- Multiple choice format
- Customizable quiz length (5, 10, 15, or all cards)
- Immediate feedback on answers
- Detailed results with review of incorrect answers
- Percentage scoring and pass/fail indication

### 6. **Smart Dashboard**
- Search across all flashcard sets
- Statistics overview (total sets, cards, mastered, studied today)
- Quick access to study and quiz modes
- Visual progress indicators

## 🎨 Nielsen's Heuristics Implementation

### 1. Visibility of System Status
- Progress bars in study and quiz modes
- Character counters (0/100, 0/200) in input fields
- Card count display ("X of Y cards")
- Current location breadcrumb navigation
- Real-time stats dashboard

### 2. Match Between System and Real World
- Natural language: "flashcard set", "section", "study", "quiz"
- Section organization mirrors how students organize classes
- "Mastered" vs "Need Review" instead of numeric ratings

### 3. User Control and Freedom
- Cancel buttons in all modals
- Easy section color customization
- Rename/delete options readily available
- Change section assignments easily
- Shuffle and restart options in study mode

### 4. Consistency and Standards
- Three-dot menu (⋮) for settings throughout
- Navigation bar always present at top
- Consistent button placement and styling
- Same design for creating and editing cards

### 5. Error Prevention
- Max length limits on inputs to prevent overflow
- Cannot create section without a name
- Cannot create flashcard set without a title
- Confirmation dialogs before deleting sets or sections
- Quiz requires minimum 4 cards
- Input validation with clear error messages

### 6. Recognition Rather Than Recall
- Set title always visible when editing
- Section names displayed in dropdown menus
- Recent activity timestamps ("Today", "Yesterday", "2 days ago")
- Visual badges for code/math content
- Stats displayed prominently on dashboard

### 7. Flexibility and Efficiency of Use
- Cards can be moved between sections
- Advanced formatting (code, math) for expert use
- Customizable quiz length
- Search functionality for quick access
- Add card button always accessible (not just at bottom)
- Quick edit/delete on each card

### 8. Aesthetic and Minimalist Design
- Plenty of whitespace and clean alignment
- Gradient color schemes for visual hierarchy
- Card-based layout with clear groupings
- Full-screen study mode removes distractions
- Focused quiz interface

### 9. Help Users Recognize, Diagnose, and Recover from Errors
- Confirmation dialogs before destructive actions
- Clear error messages on validation failures
- Red highlighting on invalid inputs
- Quiz review shows correct vs incorrect answers
- Input validation prevents invalid submissions

### 10. Help and Documentation
- Placeholder text guides users
- Tooltips on icon buttons
- Helper text in code and math editors
- Empty states with clear instructions
- Format hints (e.g., "Use ``` for code blocks")

## 📋 Addressing Gaps in Existing Apps

### Problems with Quizlet (FIXED)
✅ Add card button at top instead of requiring scroll to bottom  
✅ Consistent edit interface for single cards and full sets  
✅ Support for code formatting with syntax highlighting  
✅ Support for math equations with symbol picker  
✅ Quick delete option on each card  
✅ No paid tier required for basic formatting  

### Problems with Omnisets (FIXED)
✅ No minimum card requirement to save sets  
✅ Easy-to-find edit and delete buttons  
✅ All actions in consistent, accessible locations  
✅ Quick card management without navigating menus  
✅ Intuitive dashboard for finding sets  

### Problems with Brainscape (FIXED)
✅ Free to use with all features  
✅ Better organization with sections  
✅ Modern, intuitive interface  
✅ STEM-specific features built-in  

## 🎓 Design Principles Applied

- **Fitts's Law**: Large, easily clickable buttons for primary actions
- **Gestalt Principles**: Visual grouping of related elements (sections, cards, stats)
- **Hick's Law**: Limited choices in quiz setup, clear primary actions
- **Affordances**: Clear indication of clickable/interactive elements
- **WCAG Guidelines**: High contrast ratios, proper labeling, keyboard navigation

## 💾 Data Persistence

All data is stored in localStorage, making this a fully functional prototype without requiring a backend.

## 🚀 Getting Started

1. Create a new flashcard set from the dashboard
2. Add cards with terms and definitions
3. Use the code or math editors for STEM content
4. Study your cards with the flip-card interface
5. Test yourself with multiple-choice quizzes
6. Track your progress with mastery indicators

## 🎯 Unique Value Proposition

**"The only flashcard app built specifically for STEM students, with native support for code and mathematical notation, and smart organization features that actually work."**

This isn't just another Quizlet clone—it's a purpose-built tool that solves real problems STEM students face when studying technical content.
