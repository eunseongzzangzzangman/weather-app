<script setup>
import { useWeatherStore } from '@/stores/weather.js';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import { getImage } from '@/composables/helper.js'; //helper.js 추가

// useWeatherStore()함수를 사용하여 스토어에 정의된 스테이트, 게터, 액션에 접근
const weatherStore = useWeatherStore();
// 반응형을 유지하면서 비구조화 할당을 하려면 storeToRefs()함수 사용 -- 일반적인 방법으로 비구조화 할당을 하면 반응형이 깨짐
const { currentConditions, address } = storeToRefs(weatherStore);

onBeforeMount(async () => {
  await weatherStore.getCityName();
  await weatherStore.getCurrentWeaterInfo(); // 스토어에서 정의한 getCurrentWeatherInfo()액션 호출, 호출되면 API의 응답 데이터를 
                                            // currentConditions 스테이트에 할당, 응답 데이터는 storeToRefs()에 의해 컴포넌트 내부에서 사용 가능
});
</script>
<template>
  <header v-if="currentConditions" class="header">
      <!-- 지역 -->
      <h1 class="header__title">
        <span class="material-symbols-outlined"> location_on </span>{{ address }}
      </h1>
      <!-- <h2 class="header__date">{{ hourToMinutes }}</h2>  (dayjs라이브러리 사용하여 삭제) --> 
      <h2 class="header__date">{{ dayjs().format('HH:mm') }}</h2>
    </header>
    <!-- 현재 날씨 -->
    <main v-if="currentConditions" class="main">
      <article class="weather">
        <section class="weather__info">
          <img
            :src="getImage(currentConditions.icon)"
            :alt="`${currentConditions.datetime} ${currentConditions.temp}도`"
            class="weather__img"
          />
          <h3 class="weather_temp">{{ currentConditions.temp }}℃</h3>
          <p class="weather_summary">{{ currentConditions.conditions }}</p>
          <ul class="weather__moreList">
            <li class="weather__moreListItem">
              <p class="weather__subtitle">습도</p>
              <p class="weather__desc">{{ currentConditions.humidity }}%</p>
            </li>
            <li class="weather__moreListItem">
              <p class="weather__subtitle">풍속</p>
              <p class="weather__desc">{{ currentConditions.windspeed }}/ms</p>
            </li>
            <li class="weather__moreListItem">
              <p class="weather__subtitle">체감</p>
              <p class="weather__desc">{{ currentConditions.feelslike }}℃</p>
            </li>
          </ul>
        </section>
      </article>
    </main>
</template>
