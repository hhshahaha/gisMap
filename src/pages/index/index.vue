<template>
  <div id="app">
    <Citywide></Citywide>
  </div>
</template>

<script>
import Citywide from "@/components/Citywide.vue";
export default {
  name: "App",
  components: {
    Citywide
  },
  data() {
    return {
       
    };
  },
  mounted() {},
  method: {
  }
};
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
#app{
height: 100%;
}

</style>
