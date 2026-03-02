<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/Task1">Задание 1</RouterLink>
        <RouterLink to="/Task2">Задание 2</RouterLink>
      </nav>
    </div>
  </header>
  <section class="inner">
    <RouterView />
  </section>
</template>

<style scoped lang="scss">

header {
  height: 50px;
  display: flex;
  align-items: center;
  line-height: 1.5;
  width: 100%;
}

.wrapper {
  font-family: 'Inter Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 120px);
  width: 100%;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  white-space: nowrap;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
