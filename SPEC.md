# To-Do List App — SPEC.md

## 1. Concept & Vision

A minimalist, focused task manager with a distinctive paper-notebook aesthetic — warm cream backgrounds, subtle ruled-line textures, and handwritten-style typography that feels like jotting tasks in a cherished Moleskine. The experience should feel calm, intentional, and satisfying — crossing off a task is a small ritual, not a checkbox click.

## 2. Design Language

**Aesthetic Direction:** Warm analog stationery — think Field Notes meets a cozy café desk. Tactile warmth with digital convenience.

**Color Palette:**
- Background: `#f5f0e8` (warm cream)
- Surface: `#fffef9` (paper white)
- Primary text: `#2d2a26` (soft charcoal)
- Secondary text: `#7a756d` (warm gray)
- Accent: `#e07a5f` (terracotta coral)
- Accent hover: `#c86a4f`
- Success/Checked: `#81b29a` (sage green)
- Border: `#e8e2d9` (subtle warm border)
- Shadow: `rgba(45, 42, 38, 0.08)`

**Typography:**
- Headings: `'Caveat', cursive` — handwritten, warm personality
- Body/UI: `'DM Sans', sans-serif` — clean, legible, friendly
- Mono (task count): `'JetBrains Mono', monospace`

**Spatial System:**
- Base unit: 8px
- Generous whitespace, asymmetric padding to feel organic
- Rounded corners: 12px for cards, 8px for buttons, 20px for inputs

**Motion Philosophy:**
- Task completion: checkmark draws in with SVG stroke animation (400ms ease-out)
- New task: slides down and fades in (300ms spring)
- Delete: slides right and fades out (250ms ease-in)
- Hover states: subtle lift with shadow increase (150ms)
- All transitions use `cubic-bezier(0.34, 1.56, 0.64, 1)` for organic bounce

**Visual Assets:**
- Subtle ruled-line background pattern via CSS
- Decorative notebook spiral SVG on left edge
- Icons: custom inline SVGs matching the hand-drawn aesthetic
- Checkbox: custom styled with rounded corners, soft shadow

## 3. Layout & Structure

**Single-page layout:**
- Centered card (max-width 540px) floating on ruled-paper background
- Notebook spiral decoration on left margin
- Header with handwritten-style title and task count
- Input area with prominent "Add Task" input + button
- Task list with completion toggles and delete actions
- Subtle footer with encouragement message

**Visual Pacing:**
- Generous top padding (80px) for breathing room
- Stacked sections with clear separation
- Completed tasks subtly dimmed but remain visible

**Responsive Strategy:**
- Mobile-first, card goes full-width on small screens with reduced padding
- Touch-friendly tap targets (min 44px)

## 4. Features & Interactions

**Core Features:**
- Add new task via input field + button (Enter key also works)
- Mark task complete/incomplete via custom checkbox
- Delete task via trash icon button
- Persist tasks to localStorage
- Display total task count and completed count

**Interaction Details:**
- Input: Placeholder "What needs to be done?", focus ring uses accent color
- Add button: Terracotta accent, hover darkens, active presses down
- Checkbox: Click fills with sage green, checkmark SVG animates in
- Delete: Icon appears more prominent on task hover, click triggers slide-out
- Empty state: Friendly message with subtle illustration prompt

**Edge Cases:**
- Empty input: Shake animation on button, no empty task added
- All tasks completed: Celebratory subtle message appears
- localStorage unavailable: Graceful fallback, tasks work in memory only

## 5. Component Inventory

**Header**
- Title "My Tasks" in Caveat font, large (2.5rem)
- Task count badge: "3 of 7 done" in secondary text
- States: Default only

**TaskInput**
- Text input with paper-white background, warm border
- States: Default, focused (accent border + shadow), error (shake)
- Add button: Terracotta, icon + text
- States: Default, hover, active, disabled (when input empty)

**TaskItem**
- Custom checkbox (32x32px touch target)
- Task text with strikethrough animation when complete
- Delete button (trash icon) — subtle opacity, prominent on hover
- States: Default, hover (shadow lift), completed (dimmed text, green check), deleting (slide-out animation)

**EmptyState**
- Centered message: "No tasks yet — add your first one above"
- Faded pencil/checkbox illustration
- Warm secondary text color

**Footer**
- Subtle text: "Small steps lead to big results"
- Very muted, doesn't compete with tasks

## 6. Technical Approach

**Framework:** React (Vite + React)

**State Management:** React useState + useEffect for localStorage persistence

**Architecture:**
- Single `App` component with local state for tasks
- `TaskInput` component for adding tasks
- `TaskList` component that renders task items
- `TaskItem` individual task with all interactions
- CSS Modules or single App.css for styling

**Data Model:**
```
Task {
  id: string (uuid)
  text: string
  completed: boolean
  createdAt: number (timestamp)
}
```

**Persistence:** 
- Tasks array stored in localStorage as JSON
- Load on mount, save on every change via useEffect

**No external dependencies** beyond React itself — keep it lean and fast-loading.