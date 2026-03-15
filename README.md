# DYN Media - change password box

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

## Project Structure

```sh
src/
 ├ __tests__/
    ├ useInputPasswordToggle.spec.ts
    ├ usePasswordChange.spec.ts
 ├ assets/
    ├ main.css
    ├ button.css                  # initial file
 ├ components/
    ├ icons/                      # initial files
    ├ DynButton.vue
    ├ DynInput.vue                # initial file
    ├ DynInputPasswordToggle.vue  # initial file
    ├ DynTitle.vue
    ├ PasswordBox.vue
 ├ composables/
    ├ useInputFocus.ts            # initial file
    ├ useInputPasswordToggle.ts   # initial file
    ├ usePasswordChange.ts
 ├ App.vue
 └ main.ts
```

## Key Decisions

### 1. Separation of UI and business logic

A usePasswordChange.ts composable was created to separate business logic from UI components.
In addition, a simple mock file was added to simulate the password change request.

### 2. Upgrading to Tailwind 4

Tailwind v3 was upgraded to v4. The tailwind.config.cjs file was removed and the theme variables were moved to main.css.
In DynInput.vue, lang="scss" was removed and replaced with @reference "@/assets/main.css" to make @apply work correctly.
The button.scss file was renamed to button.css, and styles were updated to work without SCSS.

### 3. Lean UI vs Inline Validation

Two UX approaches were implemented:

- Inline validation for the new password input.
- Lean UI with "Save" for the current password and confirmation inputs.

### 4. Mobiile adaptation

The layout was adapted for mobile screens to ensure proper spacing and usability on smaller devices.

### 5. Tests implementation

Unit tests were implemented for:

- the password validation function
- the password change composable
- the password visibility toggle
