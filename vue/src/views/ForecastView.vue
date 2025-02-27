<script setup>
import { useWeatherStore } from '@/stores/weather.js';
import { onBeforeMount } from 'vue';
import { getImage, dayTokor } from '@/composables/helper.js';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';

const weatherStore = useWeatherStore();

const { hours, forecast } = storeToRefs(weatherStore); // storeToRefs()함수로 hours, forecast 가져오기

onBeforeMount(() => {
  weatherStore.getCurrentWeaterInfo();
});
</script>

<template>
    <article class="forecast">
      <!-- 시간별 예보 -->
      <section class="forecast__today">
        <strong class="forecast__title">시간별</strong>
        <ul class="week__list">
          <!-- 시간별 예보 상세 아이템 -->
          <li v-for="hour in hours" :key="hour.datetime" class="week__list__item">
            <span>{{ dayjs(`2024-02-18 ${hour.datetime}`).format('H') }}시</span>
            <img
              :src="getImage(hour.icon)"
              :alt="`${hour.datetime} ${hour.temp}도`" class="week_icons" />
            <span>{{ hour.temp }}℃</span>
          </li>
        </ul>
      </section>
      <!-- 중기 예보 -->
      <section class="forecast__week">
        <strong class="forecast__title">중기예보</strong>
        <ul class="forecast__weekList">
          <!-- 중기 예보 상세 아이템 -->
          <li v-for="day in forecast" :key="day.datetime" class="forecast__weekListItem">
            <div class="forecast__itemLeft">
              <strong class="forecast__day">
                {{ dayTokor[dayjs(day.datetime).day()] }}
              </strong>
              <span class="forecast__date">{{ day.datetime }}</span>
            </div>
            <div class="forecast__itemMiddle">
              <strong class="forecast__tmp">{{ day.temp }}</strong>
            </div>
            <div class="forecast__itemRight">
              <img
                :src="getImage(day.icon)"
                :alt="`${day.datetime} ${day.temp}℃`"
                class="forecast__weekListImg"
              />
            </div>
          </li>
        </ul>
      </section>
    </article>
</template>