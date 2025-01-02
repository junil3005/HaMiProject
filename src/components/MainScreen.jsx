import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function MainScreen() {
  const navigate = useNavigate();
  // 화면 터치 시 다음 화면으로 이동
  const handleTouch = () => {
    navigate("/menu"); // 메뉴 화면으로 이동
  };

  const videoRef = useRef(null); // video 태그 참조
  const [isPlaying, setIsPlaying] = useState(true); // 재생 상태 관리

  // 동영상 재생 /정지 토글
  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  //    언어 선택
  const [selectedLanguage, setSelectedLanguage] = useState("ko"); // 기본언어는 한국어 설정
  // 언어 선택 이벤트 처리
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  // 다국어 데이터
  const languageData = {
    // 한국어
    ko: {
      message: "화면을 터치하여 메뉴로 이동",
      play: "재생",
      pause: "정지",
      languages: "언어 선택",
    },
    // 영어
    en: {
      message: "Touch the screen to go the menu",
      play: "play",
      pause: "Pause",
      languages: "Select Language",
    },
    // 일본어
    jp: {
      message: "画面をタッチしてメニューに移動",
      play: "再生",
      pause: "一時停止",
      languages: "言語選択",
    },
  };

  const isMobile = window.innerWidth <= 768;

<div
  style={{
    position: "absolute",
    width: isMobile ? "90%" : "1100px",
    fontSize: isMobile ? "40px" : "70px",
  }}
>
  {languageData[selectedLanguage].message}
</div>;


  return (
    <div
      onClick={handleTouch}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* 동영상 추가 */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/src/video/video-sufer.mp4.mp4" type="video/mp4" />
      </video>

      {/* 재생/정지 버튼 */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1,
          fontSize: "16px",
        }}
        onClick={(e) => {
          e.stopPropagation(); //  버튼 클릭 시 부모의 터치 이벤트 방지
          togglePlayPause();
        }}
      >
        {isPlaying
          ? languageData[selectedLanguage].pause
          : languageData[selectedLanguage].play}
      </div>
      {/* 언어 선택 */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span style={{ fontWeight: "bold", marginBottom: "5px" }}>
          {languageData[selectedLanguage].languages}
        </span>
        {Object.keys(languageData).map((language) => (
          <button
            key={language}
            style={{
              backgroundColor:
                selectedLanguage === language ? "#FFD700" : "#fff",
              color: selectedLanguage === language ? "#000" : "#000",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleLanguageChange(language);
            }}
          >
            {language.toUpperCase()}
          </button>
        ))}
      </div>
      {/* 안내 텍스트 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff",
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {" "}
        {languageData[selectedLanguage].message}
      </div>
      {/* QR 코드 */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <div style={{ position: "relative", width: "150px", height: "150px" }}>
          <QRCodeCanvas
            value="https://resonant-cascaron-5a1b5b.netlify.app/" // QR 코드로 인코딩할 URL
            size={150}
            bgColor="#ffffff"
            fgColor="#000000"
            level="Q"
          />
          <img
            src="/image.png" // 삽입할 이미지의 경로
            alt="QR LOGO"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50px",
              height: "50px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
