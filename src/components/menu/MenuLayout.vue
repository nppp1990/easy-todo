<template>
  <div>
    <input type="text" name="" id="" placeholder="搜索">
    <card-item style="width: 200px;"/>

  </div>
</template>
<script>
import CardItem from "@/components/menu/CardItem.vue";

export default {
  name: "MenuLayout",
  components : {
    CardItem
  }
}
</script>
<style scoped>
input {
  width: 100%;
  height: 30px;
  display: block;
}


</style>