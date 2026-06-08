<script setup lang="ts">
import { ref } from "vue";
import { TulparButton } from "@tulpar-ui/vue";

const isDark = ref(false);
const submittedEmail = ref<string | null>(null);

function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}

function onSubmit(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const fd = new FormData(form);
  submittedEmail.value = String(fd.get("email") ?? "");
}
</script>

<template>
  <h1>Tulpar UI — Vue Playground (v0.3)</h1>

  <button @click="toggleDark">Toggle dark mode (current: {{ isDark ? "dark" : "light" }})</button>

  <section>
    <h2>Severities × Solid variant</h2>
    <TulparButton severity="primary">Primary</TulparButton>
    <TulparButton severity="secondary">Secondary</TulparButton>
    <TulparButton severity="info">Info</TulparButton>
    <TulparButton severity="success">Success</TulparButton>
    <TulparButton severity="warn">Warn</TulparButton>
    <TulparButton severity="help">Help</TulparButton>
    <TulparButton severity="danger">Danger</TulparButton>
    <TulparButton severity="contrast">Contrast</TulparButton>
  </section>

  <section>
    <h2>Variants × Primary</h2>
    <TulparButton variant="solid">Solid</TulparButton>
    <TulparButton variant="outlined">Outlined</TulparButton>
    <TulparButton variant="tonal">Tonal</TulparButton>
    <TulparButton variant="ghost">Ghost</TulparButton>
    <TulparButton variant="link">Link</TulparButton>
  </section>

  <section>
    <h2>Color overrides</h2>
    <TulparButton color="gold">Gold</TulparButton>
    <TulparButton color="emerald" variant="tonal">Emerald tonal</TulparButton>
    <TulparButton color="rose" variant="outlined">Rose outlined</TulparButton>
    <TulparButton color="indigo">Indigo</TulparButton>
    <TulparButton color="yellow">Yellow (auto-dark text)</TulparButton>
  </section>

  <section>
    <h2>Shapes + modifiers</h2>
    <TulparButton shape="round">Round</TulparButton>
    <TulparButton raised>Raised</TulparButton>
    <TulparButton raised severity="danger">Raised danger</TulparButton>
  </section>

  <section>
    <h2>Loading</h2>
    <TulparButton loading>Save</TulparButton>
    <TulparButton loading loading-label="Saving…">Save</TulparButton>
    <TulparButton loading loading-position="start">Save</TulparButton>
  </section>

  <section>
    <h2>Form integration</h2>
    <form @submit="onSubmit">
      <input name="email" type="email" placeholder="Email" />
      <TulparButton type="submit">Submit</TulparButton>
      <TulparButton type="reset" severity="secondary" variant="outlined">Reset</TulparButton>
    </form>
    <p v-if="submittedEmail">Submitted: {{ submittedEmail }}</p>
  </section>
</template>

<style>
body {
  font-family: var(--tulpar-font-family-ui);
  background: var(--tulpar-color-bg-surface);
  color: var(--tulpar-color-text-primary);
  margin: 0;
  padding: 2rem;
}
section {
  margin: 2rem 0;
}
section > * {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--tulpar-color-border-default);
  border-radius: 4px;
}
h1,
h2 {
  color: var(--tulpar-color-text-primary);
  font-family: var(--tulpar-font-family-display);
}
</style>
