<script setup lang="ts">
definePageMeta({
  middleware: () => {
    if (isMobile() && process.env.NODE_ENV !== "development") {
      return navigateTo("/library");
    }
  },
});

const location = window.location;
</script>

<template>
  <div class="mx-auto max-w-[80%]">
    <div class="flex flex-wrap lg:flex-nowrap gap-6 mx-auto p-2 items-center">
      <div class="lg:w-1/3 max-md:text-center">
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
          <p class="p-8">
            retrouver tous les jours des nouvelles histoires d'environ 20minutes
            etc...
          </p>
        </div>
      </div>
      <div class="card lg:card-side bg-base-200 shadow-md">
        <div class="card-body place-items-end">
          <p class="card-title">sante mental</p>
          <p class="p-8">
            de petits audios de quelques minutes qui vous aident etc...
          </p>
        </div>
        <figure>
          <img src="/assets/owl.svg" class="aspect-square size-36" />
        </figure>
      </div>

      <div class="card bg-base-200 shadow-md">
        <div class="card-body gap-8 flex-wrap flex-row justify-center">
          <p class="card-title text-2xl justify-center w-full">
            ou et quand vous voulez.
          </p>

          <div class="flex items-center justify-around flex-col">
            <div class="card card-compact text-center max-w-80 h-min">
              <div class="card-body !text-lg">
                <p class="card-title justify-center">
                  ✔️ Annulez à tout moment
                </p>
                votre accès en illimité. C'est sans engagement : vous annulez
                quand vous voulez !
              </div>
            </div>
            <div class="card card-compact text-center max-w-80 h-min">
              <div class="card-body !text-lg">
                <p class="card-title justify-center">
                  ✔️ Écoutez les plus grandes histoires
                </p>
                Faites le plein d'émotions en écoutant des centaines de
                créations originales.
              </div>
            </div>
            <div class="card card-compact text-center max-w-80 h-min">
              <div class="card-body !text-lg">
                <p class="card-title justify-center">
                  ✔️ L'audio qui vous ressemble.
                </p>
                Personnalisez votre expérience en suivant plus de 70 thématiques
                au choix, selon vos envies du moment.
              </div>
            </div>
          </div>

          <div class="w-min">
            <div class="mockup-phone p-1">
              <div class="camera"></div>
              <div class="display">
                <div
                  class="artboard artboard-demo phone-1 bg-base-200 flex justify-center px-4 py-16"
                >
                  <div class="card card-compact text-center">
                    <p class="card-title justify-center">
                      ✔️ Même hors connexion
                    </p>
                    <p class="card-body !text-lg">
                      Téléchargez vos épisodes sur votre smartphone et
                      écoutez-les à tout moment pour ne rien manquer de vos
                      contenus favoris.
                    </p>
                  </div>
                  <div class="py-12 italic">
                    app store & play store link here
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mockup-browser border-4 border-base-300 w-full">
            <div class="mockup-browser-toolbar">
              <div class="input border border-base-300">{{ location }}</div>
            </div>
            <div
              class="flex justify-center items-center px-4 py-16 border-t border-base-300"
            >
              <div class="card w-4/5">
                <div class="card-body !text-lg">
                  <p class="card-title">✔️ sur tous les supports</p>
                  Retrouvez le meilleur de l'audio en accès illimité sur votre
                  smartphone, tablette et ordinateur.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
