import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';

// Axios를 사용해 HTTP 요청을 보내기 위한 Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
    params: {
        lang: 'ko',
        key: '***************', 
        unitGroup: 'metric',
    },
});
export const useWeatherStore = defineStore('weather', () => {
    const address = ref('seoul'); // 초기 검색 지역
    const currentConditions = ref(null); // 현재 날씨 정보 데이터
    const days = ref(null); // 일별 날씨 객체가 담긴 배열

    // 오늘 시간대별 데이터 계산
    const hours = computed(() => {
        return days.value
        // 날씨 객체 배열에서 오늘 날짜와 일치하는 객체 1개를 찾음
        ?.find((v) => v.datetime === dayjs().format('YYYY-MM-DD'))
        // 현재 시각 이후 시간만 시간별 데이터에 포함
        ?.hours.filter((v) => v.datetime > dayjs().format('HH:mm:ss'));
    });

    // 현재 날씨 API 불러오기
    const getCurrentWeaterInfo = async () => {
        try {
            const res = await axiosInstance.get('/' + address.value);
            currentConditions.value = res.data.currentConditions;
            days.value = res.data.days; // 응답 객체에서 days 속성만 days 반응형 변수에 할당
            console.log(days.value)
        } catch (e) {
            alert(e.response?.data ? e.response?.data : e.message);
        }
    };
    return { currentConditions, hours, getCurrentWeaterInfo };
});


