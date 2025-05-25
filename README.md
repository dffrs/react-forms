# React Forms

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Form API](#form-api)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

This repository contains a reference implementation of dynamic, schema-driven forms using React and TypeScript. The goal is to simplify form construction and maintenance using reusable components, controlled inputs and validation logic.

## Features

- Custom form hook (`useForm`) for full control over registration and value tracking
- Field grouping support (e.g. for radios)
- Automatic syncing of form inputs with internal state
- `useWatchValue` hook for subscribing to value changes
- Controlled default values, reset, and dynamic updates

## Usage Guide

### 1. Registering Fields

Use `form.register(name)` to attach input elements to the form:

```tsx
<input type="text" {...form.register("username")} />
<input type="checkbox" {...form.register("acceptTerms")} />
<input type="file" {...form.register("profilePicture")} />
```

For radio groups, use an object with `groupName` and `element`:

```tsx
<input
  type="radio"
  value="email"
  {...form.register({ groupName: "contactMethod", element: "email" })}
/>
<input
  type="radio"
  value="phone"
  {...form.register({ groupName: "contactMethod", element: "phone" })}
/>
```

### 2. Watching Values

Use `useWatchValue(fieldName, { form })` to subscribe to value changes:

```tsx
const checkboxValue = useWatchValue("acceptTerms", { form });

// If using under <FormContext />
const checkboxValue = useWatchValue("acceptTerms");
```

### 3. Getting Values

```tsx
form.getValueFor("username");
form.getValues();
```

### 4. Setting Values

```tsx
form.setValueFor("username", "new name");
form.setValueFor("acceptTerms", true);
```

### 5. Resetting to Defaults

```tsx
form.resetToDefaultValues();
```

## Form API

### `useForm(formId: string, options?: { defaultValues?: Record<string, unknown> })`

Returns a form controller object with:

- `register(fieldName)` - Binds input to internal form state
- `setValueFor(fieldName, value)` - Programmatically sets a field's value
- `getValueFor(fieldName)` - Gets the current value for a field
- `getValues()` - Gets values for all fields
- `resetToDefaultValues()` - Resets all fields to initial values
- `internalState` - Exposes the `Internal` instance managing field refs and value tracking

### `useWatchValue(fieldName: Register, { form })`

Subscribes to value changes of a field and re-renders the component when the value updates.

## License

This project is licensed under the MIT License. See the [LICENSE](./projects/ts/react-forms/LICENSE) file for details.
