import { useState, useEffect } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const TimerContainer = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${(props) => (props.$isWarning ? "#ff0000" : "#333")};
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimeUnit = styled.span`
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0 0.2rem;
  color: ${(props) => (props.$isWarning ? "#ff0000" : "inherit")};
`;

function KioskCountdownTimer({ startFrom, onCountdownEnd, children }) {
  const [timeLeft, setTimeLeft] = useState(startFrom);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onCountdownEnd();
      Swal.fire({
        icon: "warning",
        title: "결제 시간이 종료!",
        text: "결제 시간이 종료되었습니다.",
      });
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    //  10초에서 숫자가 빨간색으로 긴박한 느낌주기
    if (timeLeft <= 10) {
      setIsWarning(true);
    }

    return () => clearInterval(intervalId);
  }, [timeLeft, onCountdownEnd]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <TimerContainer $isWarning={isWarning}>
      {children}
      <TimeUnit $isWarning={isWarning}>
        {minutes.toString().padStart(2, "0")}
      </TimeUnit>
      {/* <TimeUnit>{minutes.toString().padStart(2, "0")}</TimeUnit> */}
      <span>:</span>
      <TimeUnit $isWarning={isWarning}>
        {seconds.toString().padStart(2, "0")}
      </TimeUnit>
      {/* <TimeUnit>{seconds.toString().padStart(2, "0")}</TimeUnit> */}
    </TimerContainer>
  );
}

KioskCountdownTimer.propTypes = {
  startFrom: PropTypes.number,
  onCountdownEnd: PropTypes.func,
  children: PropTypes.node,
};

export default KioskCountdownTimer;
