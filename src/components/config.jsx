import config from "./config";

function fetchData() {
    fetch(`${config.apiUrl}/data`)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error fetching data:", error));
  }
  
  fetchData();



const config = {
    apiUrl: "https://hamiproject.onrender.com",     // json 서버 배포 url
};

const appUrl = "http://192.168.x.x:5173"; // React 앱의 로컬 네트워크 주소

export default config;