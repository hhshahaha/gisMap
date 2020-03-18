<template>
    <div id="app">
        <Uptown></Uptown>
    </div>
</template>

<script>
import Uptown from "@/components/Uptown.vue";
    export default {
        name: "App",
  components: {
    Uptown
  },
    }
</script>

<style>
   * {
  margin: 0px;
  padding: 0px;
} 
html,body,#app{
  height: 100%;
}
</style>
