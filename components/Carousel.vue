<script setup lang="ts">
import { register } from "swiper/element/bundle";
import type { SwiperOptions } from "swiper/types";
register();

const pods = await usePodcasts();

const swiperParams: SwiperOptions = {
  slidesPerView: 2,
  loop: true,
  speed: 20000,
  autoplay: {
    delay: 1,
    reverseDirection: true,
  },
  direction: "vertical",
  injectStyles: [
    `
    // .swiper { max-height: 40vh; }
    .swiper-wrapper {
      transition-timing-function: linear !important;
      place-items: center;
    }
  `,
  ],
};

const swiper1 = ref();
const swiper2 = ref();

onMounted(() => {
  Object.assign(swiper1.value, swiperParams);
  const reverseParams = structuredClone(swiperParams);
  // @ts-ignore is defined above
  reverseParams.autoplay.reverseDirection = false;
  reverseParams.initialSlide = pods.value.length - 3;
  Object.assign(swiper2.value, reverseParams);
  swiper1.value.initialize();
  swiper2.value.initialize();
});
</script>

<template>
  <div class="flex flex-nowrap justify-center gap-4 relative">
    <swiper-container init="false" ref="swiper1" class="m-0">
      <swiper-slide v-for="pod of pods" class="my-4">
        <Poster :pod="pod" :hidetitle="true" />
      </swiper-slide>
    </swiper-container>
    <swiper-container init="false" ref="swiper2" class="m-0">
      <swiper-slide v-for="pod of pods" class="my-4">
        <Poster :pod="pod" :hidetitle="true" />
      </swiper-slide>
    </swiper-container>
    <div
      class="bg-gradient-to-b from-base-100 z-10 w-full h-32 absolute top-0 bottom-auto"
    ></div>
    <div
      class="bg-gradient-to-t from-base-100 z-10 w-full h-32 absolute top-auto bottom-0"
    ></div>
  </div>
</template>
