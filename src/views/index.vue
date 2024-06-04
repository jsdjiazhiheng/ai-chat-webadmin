<template>
  <div class="app-container home">
    <el-card class="card-box" :style="'min-height: ' + boxHeight + 'px'"></el-card>
  </div>
</template>

<script setup name="Index" lang="ts">
import { initWebSocket } from '@/utils/websocket';
const { height } = useWindowSize()
onMounted(() => {
  let protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  initWebSocket(protocol + window.location.host + import.meta.env.VITE_APP_BASE_API + "/resource/websocket");
});

const boxHeight = computed(() => {
  return height.value - 134;
})
</script>

<style scoped lang="scss">
.home {
  .card-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
</style>
