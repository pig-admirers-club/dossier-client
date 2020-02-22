<template>
  <div id="menu">
    <ul>
      <li><i class="fas fa-box"></i></li>
    </ul>
  </div>
</template>

<script lang="ts">
  export default {
    
  }
</script>

<style>
  #menu {
    height: 100%;
    width: 50px;
    background-color: #ebebeb;
  }
  #menu-ul {
    height: 100%;
  }
  #menu ul li {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #menu ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
</style>