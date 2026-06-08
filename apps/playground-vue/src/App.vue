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
  <h1>Tulpar UI — Vue Playground</h1>

  <button @click="toggleDark">
    Toggle dark mode (current: {{ isDark ? "dark" : "light" }})
  </button>

  <section>
    <h2>Variants</h2>
    <TulparButton variant="primary">Primary</TulparButton>
    <TulparButton variant="secondary">Secondary</TulparButton>
    <TulparButton variant="danger">Danger</TulparButton>
    <TulparButton variant="ghost">Ghost</TulparButton>
    <TulparButton variant="link">Link</TulparButton>
  </section>

  <section>
    <h2>Sizes</h2>
    <TulparButton size="xs">xs</TulparButton>
    <TulparButton size="sm">sm</TulparButton>
    <TulparButton size="md">md</TulparButton>
    <TulparButton size="lg">lg</TulparButton>
    <TulparButton size="xl">xl</TulparButton>
    <TulparButton size="2xl">2xl</TulparButton>
    <TulparButton size="3xl">3xl</TulparButton>
  </section>

  <section>
    <h2>States</h2>
    <TulparButton disabled>Disabled</TulparButton>
    <TulparButton loading>Loading</TulparButton>
  </section>

  <section>
    <h2>Form integration</h2>
    <form @submit="onSubmit">
      <input name="email" type="email" placeholder="Email" />
      <TulparButton type="submit">Submit</TulparButton>
      <TulparButton type="reset" variant="secondary">Reset</TulparButton>
    </form>
    <p v-if="submittedEmail">Submitted: {{ submittedEmail }}</p>
  </section>
</template>

<style>
body {
  font-family: var(--tulpar-font-family-body);
  background: var(--tulpar-color-bg-surface);
  color: var(--tulpar-color-text-primary);
  margin: 0;
  padding: 2rem;
}
section { margin: 2rem 0; }
section > * { margin-right: 0.5rem; }
form { display: flex; gap: 0.5rem; align-items: center; }
input { height: 40px; padding: 0 12px; border: 1px solid var(--tulpar-color-border-default); border-radius: 6px; }
h1, h2 { color: var(--tulpar-color-text-primary); }
</style>
