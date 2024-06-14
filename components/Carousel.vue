<script setup lang="ts">
import { register } from "swiper/element/bundle";
import type { SwiperOptions } from "swiper/types";
register();

const swiperParams: SwiperOptions = {
  slidesPerView: "auto",
  loop: true,
  speed: 2000,
  autoplay: {
    delay: 500,
    reverseDirection: false,
  },
  direction: "vertical",
  injectStyles: [
    `
.swiper {max-height: 40vh;}
`,
  ],
};

const swiper1 = ref();
const swiper2 = ref();

onMounted(() => {
  Object.assign(swiper1.value, swiperParams);
  const reverseParams = structuredClone(swiperParams);
  // @ts-ignore is defined above
  reverseParams.autoplay.reverseDirection = true;
  Object.assign(swiper2.value, reverseParams);
  swiper1.value.initialize();
  swiper2.value.initialize();
});
</script>

<template>
  <div class="flex flex-nowrap">
    <swiper-container init="false" class="!w-1/2" ref="swiper1">
      <swiper-slide v-for="index of 20" :key="index" class="h-40 border">
        Slide {{ index }}
      </swiper-slide>
    </swiper-container>
    <swiper-container init="false" class="!w-1/2" ref="swiper2">
      <swiper-slide v-for="index of 20" :key="index" class="h-40 border">
        Slide {{ index }}
      </swiper-slide>
    </swiper-container>
  </div>
</template>
