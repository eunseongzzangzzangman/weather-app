<script setup>
import { useWeatherStore } from '@/stores/weather';
import { storeToRefs } from 'pinia';
import { ref, watch, onBeforeMount } from 'vue';
import { getImage } from '@/composables/helper.js';

const weatherStore = useWeatherStore();
const { searchData } = storeToRefs(weatherStore);
const city = ref('');
const searchWeather = async () => {
  await weatherStore.getSearchWeatherInfo(city.value);
  city.value = '';
};

// watch함수로 감시자 등록, searchData 스테이트 값이 변경될 때마다 localStoreage 객체를 사용해 데이터 저장
// setItem 메서드는 값을 문자열로 지정해야 하므로 JSON.Stringify 메서드를 사용해 JSON 문자열로 변환해 저장
watch(
  () => searchData,
  (newValue) => {
    localStorage.setItem('searchData', JSON.stringify(newValue.value));
  },
  { deep: true }
);

// JSON.parse 메서드를 사용해 다시 원래 값으로 변환하여 데이터를 가져옴 (데이터가 없을 수 있으니 빈 배열([])을 가져오게 함)
onBeforeMount(() => {
  const localData = JSON.parse(localStorage.getItem('searchData')) || [];
  searchData.value = localData;
});

// 매개변수로 address 값을 전달받아 기존 searchData 스테이트 값에서 전달받은 값과 일치하는 데이터를 제거한 후 다시 값을 할당
// 삭제진행 -> searchData 스테이트 값에 변화 -> watch(감시)함수 실행 -> searchData 스테이트 값을 다시 로컬 스토리지에 저장 -> 삭제된 데이터 즉시 반영
const removeItem = (address) => {
  searchData.value = searchData.value.filter((v) => v.address !== address);
};
</script>

<template>
    <main class="weather-city">
      <!-- 검색 영역 -->
      <section class="weather__search">
        <input
          v-model="city"
          type="text"
          class="weather__searchBar"
          placeholder="알고 싶은 지역을 입력해 주세요."
          @keyup.enter="searchWeather" />
      </section>
      <!-- 검색 데이터가 있으면 -->
      <section
        v-for="data in searchData"
        :key="data.address"
        class="weather__city">
        <div class="weather__cityLeft">
          <strong class="weather__cityTmp">{{ data.temp }}℃</strong>
          <p class="weather__cityTmpMore">
            H: {{ data.feelslikemax }}℃ / L: {{ data.feelslikemin }}℃</p>
          <p>{{ data.address }}</p>
        </div>
        <div class="weather__cityRight">
          <img
            :src="getImage(data.icon)"
            :alt="`${data.address} ${data.temp}℃`"
            class="weather__cityImg"
          />
        </div>
        <span class="material-symbols-outlined weather__cancel" @click="removeItem(data.address)"> cancel </span>
      </section>
      <!-- 검색 데이터가 없으면 -->
      <section v-if="searchData.length === 0" class="no-data">
        <p>검색한 지역이 없습니다.</p>
      </section>
    </main>
</template>