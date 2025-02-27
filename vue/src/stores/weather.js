import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';

// Axios를 사용해 HTTP 요청을 보내기 위한 Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
    params: {
        lang: 'ko',
        key: '********', 
        unitGroup: 'metric',
    },
});

// 사용자 위치를 알아낼 수 있는 navigator 객체에서 제공하는 geolocation
// 하지만, 사용자 위치 정보 수집에 대한 동의서를 받아야 하기 때문에 API로 사용자 IP를 얻은 후, 해당 IP로 사용자 위치를 찾아 지역명을 검색

// ipify API를 기본값으로 하는 Axios 인스턴스 생성
const axiosIpInstance = axios.create({
    baseURL: 'https://api64.ipify.org/?format=json',
});

// Free IP API를 기본값으로 하는 Axios 인스턴스 생성
const axiosFipInstance = axios.create({
    baseURL: 'https://freeipapi.com/api/json',
});

export const useWeatherStore = defineStore('weather', () => {
    const address = ref('seoul'); // 초기 검색 지역
    const currentConditions = ref(null); // 현재 날씨 정보 데이터
    const days = ref(null); // 일별 날씨 객체가 담긴 배열
    const searchData = ref([]); // 검색 날씨 데이터

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

    // 미래 날짜의 날씨 예보 데이터 계산하기
    const forecast = computed(() => {
        return days.value?.filter((v) => v.datetime > dayjs().format('YYYY-MM-DD'));
    });

    // 지역명(city)으로 날씨 API 검색
    const getSearchWeatherInfo = async (city) => {
        try {
            const res = await axiosInstance.get('/' + city)
            // 응답 데이터 객체로 필요한 데이터 가공
            const printData = {
                address: res.data.address, // 지역명
                feelslikemax: res.data.days[0].feelslikemax, // 최고 온도
                feelslikemin: res.data.days[0].feelslikemin, // 최저 온도
                icon: res.data.currentConditions.icon, // 날씨 아이콘
                temp: res.data.currentConditions.temp, // 현재 온도
            };
            // 이미 추가한 지역이면 중복으로 추가하지 않기
            if (
                searchData.value.findIndex((v) => v.address === res.data.address) === -1
            ) {
                searchData.value.push(printData);
            } else {
                alert('이미 조회한 지역입니다ㅠㅠ');
            }
        } catch (e) {
            alert(e.response?.data ? e.response?.data : e.message);
        }
    };

    // 사용자 지역명 구하기
    const getCityName = async () => {
        try {
            const res = await axiosIpInstance.get();
            const ip = res.data.ip;
            const Freeres = await axiosFipInstance.get('/' + ip);
            address.value = Freeres.data.cityName; // 응답 데이터
        } catch (e) {
            alert(e.response?.data ? e.response?.data : e.message);
        }
    };

    return { address, currentConditions, hours, forecast, searchData, getCurrentWeaterInfo, getSearchWeatherInfo, getCityName, };
});


