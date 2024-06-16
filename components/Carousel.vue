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
  reverseParams.initialSlide = pods.value.length / 3;
  Object.assign(swiper2.value, reverseParams);
  swiper1.value.initialize();
  swiper2.value.initialize();
});
</script>

<template>
  <div class="flex flex-nowrap justify-center gap-4 relative">
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
    <div id="top-blur"></div>
    <div id="bottom-blur"></div>
  </div>
</template>

<!-- FIXME: background color should be dynamic -->
<style scoped>
#top-blur {
  z-index: 1;
  background-image: linear-gradient(#f9fafb, transparent);
  width: 100%;
  height: 20%;
  position: absolute;
  top: 0%;
  bottom: auto;
}

#bottom-blur {
  z-index: 1;
  background-image: linear-gradient(transparent, #f9fafb);
  width: 100%;
  height: 20%;
  position: absolute;
  top: auto;
  bottom: 0;
}
</style>
