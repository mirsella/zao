<script setup lang="ts">
definePageMeta({
  middleware: () => {
    if (isMobile() && process.env.NODE_ENV !== "development") {
      return navigateTo("/library");
    }
  },
});
</script>

<template>
  <div class="mx-auto max-w-[80%]">
    <div class="flex flex-wrap lg:flex-nowrap gap-6 mx-auto p-2 items-center">
      <div class="lg:w-1/3">
        <p class="text-5xl py-6 font-bold">
          Les podcasts qui vont transformer votre vie.
        </p>
        <p class="text-xl py-6">
          contenus de qualité, exclusif, <br />
          où que vous soyez.
        </p>
        <NuxtLink to="/library" class="my-4 btn shadow-md">
          Commencer
          <span class="i-carbon-arrow-right size-6" />
        </NuxtLink>
      </div>
      <Carousel class="w-full lg:w-2/3" />
    </div>

    <div class="grid grid-cols-1 my-10 gap-10">
      <div class="card lg:card-side bg-base-200 shadow-md">
        <figure>
          <img src="/assets/owl.svg" class="aspect-square size-36" />
        </figure>
        <div class="card-body">
          <p class="card-title">histoires</p>
          <p class="card-body">
            retrouver tous les jours des nouvelles histoires d'environ 20minutes
            etc...
          </p>
        </div>
      </div>
      <div class="card lg:card-side bg-base-200 shadow-md">
        <div class="card-body">
          <p class="card-title">sante mental</p>
          <p class="card-body">
            de petits audios de quelques minutes qui vous aident à vous etc...
          </p>
        </div>
        <figure>
          <img src="/assets/owl.svg" class="aspect-square size-36" />
        </figure>
      </div>
      <div class="card bg-base-200 shadow-md">
        <div class="card-body">
          <div class="card-title text-2xl justify-center">
            ou et quand vous voulez.
          </div>
          <div class="card-body !gap-8">
            <div class="w-min">
              <div class="mockup-phone p-1">
                <div class="camera"></div>
                <div class="display">
                  <div
                    class="artboard artboard-demo phone-1 bg-base-200 flex justify-center px-4 py-16"
                  >
                    <div class="card card-compact text-center">
                      <p class="card-title justify-center">
                        ✔️ hors connection
                      </p>
                      <p class="card-body">
                        telecharger vos capsules sur votre smartphone et ecouter
                        les a tout moment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card card-compact text-center w-min">
              <p class="card-title justify-center">✔️ hors connection</p>
              <p class="card-body">
                telecharger vos capsules sur votre smartphone et ecouter les a
                tout moment
              </p>
            </div>

            <div class="mockup-browser border-4 border-base-300">
              <div class="mockup-browser-toolbar">
                <div class="input border border-base-300">https://zao.com</div>
              </div>
              <div
                class="flex justify-center px-4 py-16 border-t border-base-300"
              >
                <div class="card card-compact">
                  <p class="card-title">✔️ sur tous les supports</p>
                  <p class="card-body">
                    Retrouvez le meilleur de l'audio en accès illimité sur votre
                    smartphone, tablette et ordinateur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
