<template>
  <div id="app">
   <TrackPlot></TrackPlot>
  </div>
</template>

<script>
import TrackPlot from "@/components/Track.vue";
export default {
  name: "App",
  components: {
    TrackPlot
  }
};
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
