<!-- src/components/MainLayout.vue -->
<template>
    <div>
        <nav class="main-nav">
            <router-link to="/" exact>🏠Home</router-link>
            <router-link to="/about">About</router-link>
        </nav>

        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script setup>
    // No special logic needed here
</script>

<style scoped>
    .main-nav {
        width: 100%;
        background-color: #fff; /* white background */
        padding: 1rem 2rem;
        display: flex;
        gap: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* subtle shadow */
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .main-nav a {
        color: #333;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .main-nav a:hover {
        color: #007bff;
    }

    .main-nav a.router-link-exact-active {
        font-weight: bold;
        border-bottom: 2px solid #007bff;
    }

</style>
