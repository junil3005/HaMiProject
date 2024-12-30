// eslint-disable react/prop-types
// import { useMemo } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PropTypes from "prop-types";
import styled from "styled-components";

const Timer = styled.div`
  font-family: "Montserrat";
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Text = styled.span`
  color: #aaa;
`;
const Value = styled.span`
  font-size: 40px;
`;
const renderTime = ({ remainingTime }) => {
  return (
    <Timer>
      <Text>
        {remainingTime === 0 ? "첫 화면으로 돌아갑니다." : "결제 완료"}
      </Text>
      {remainingTime !== 0 && (
        <>
          <Text>감사합니다.</Text>
          <Value>{remainingTime}</Value>
        </>
      )}
    </Timer>
  );
};

function PaymentSuccess({ orderDetails }) {
  // const totalPrice = useMemo(() => {
  //   if (!orderDetails || !orderDetails.items) return 0;
  //   return orderDetails.items.reduce(
  //     (sum, item) => sum + (item.price || 0) * (item.count || 0),
  //     0
  //   );
  // }, [orderDetails]);

  if (!orderDetails) {
    return <div>주문 정보를 불러오는 중...</div>;
  }

  return (
    <div className="payment-success">
      <h2>결제가 완료되었습니다!</h2>
      <CountdownCircleTimer
        isPlaying
        duration={10}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[7, 5, 2, 0]}
      >
        {renderTime}
        {/* {({ remainingTime }) => remainingTime} */}
      </CountdownCircleTimer>
      <div className="order-summary">
        <h3>주문 요약</h3>
        <p>주문 번호 : {orderDetails.id || "정보 없음"}</p>
        <p>주문 일시 : {orderDetails.date || "정보 없음"}</p>
        <p>총 결제 금액 : {orderDetails.totalPrice}원</p>
        <h4>주문 내역 :</h4>
        <ul>
          {orderDetails.items?.map((item) => (
            <li key={item.id}>
              {item.name} - {item.isCart}개 (
              {(item.isCart * item.price || 0).toLocaleString()}원)
            </li>
          )) || <li>주문 항목이 없습니다.</li>}
        </ul>
      </div>
    </div>
  );
}

PaymentSuccess.propTypes = {
  orderDetails: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default PaymentSuccess;
