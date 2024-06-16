<script setup lang="ts">
import { register } from "swiper/element/bundle";
import type { SwiperOptions } from "swiper/types";
register();

const pods = await usePodcasts();

const swiperParams: SwiperOptions = {
  slidesPerView: "auto",
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
  reverseParams.initialSlide = pods.value.length / 2;
  Object.assign(swiper2.value, reverseParams);
  swiper1.value.initialize();
  swiper2.value.initialize();
});
</script>

<template>
  <div class="flex flex-nowrap justify-center gap-4">
    <swiper-container init="false" ref="swiper1" class="m-0">
      <swiper-slide v-for="pod of pods" class="size-40 lg:size-60 my-16">
        <Poster :pod="pod" />
      </swiper-slide>
    </swiper-container>
    <swiper-container init="false" ref="swiper2" class="m-0">
      <swiper-slide v-for="pod of pods" class="size-40 lg:size-60 my-16">
        <Poster :pod="pod" />
      </swiper-slide>
    </swiper-container>
  </div>
</template>
