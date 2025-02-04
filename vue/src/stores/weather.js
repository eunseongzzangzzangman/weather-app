import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
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
    // 초기 검색 지역
    const address = ref('seoul');
    // 현재 날씨 정보 데이터
    const currentConditions = ref(null);
    // 현재 날씨 API 불러오기
    const getCurrentWeaterInfo = async () => {
        try {
            const res = await axiosInstance.get('/' + address.value);
            currentConditions.value = res.data.currentConditions;
        } catch (e) {
            alert(e.response?.data ? e.response?.data : e.message);
        }
    };
    return { currentConditions, getCurrentWeaterInfo, };
});


