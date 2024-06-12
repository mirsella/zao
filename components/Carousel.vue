<script setup lang="ts">
import Swiper from "swiper";

// TODO: should be a plugin
import { register } from "swiper/element/bundle";
register();
//

const swiperParams = {
  slidesPerView: 2,
  loop: true,
  autoplay: {
    delay: 500,
  },
  direction: "vertical",
  freemode: {
    enabled: true,
  },
  autoHeight: true,
};
</script>

<template>
  <swiper-container v-bind="swiperParams">
    <swiper-slide v-for="index of 20" :key="index">
      Slide {{ index }}
    </swiper-slide>
  </swiper-container>
</template>
