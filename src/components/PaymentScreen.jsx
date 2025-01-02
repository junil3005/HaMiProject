/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import OrderHistory from "/src/components/OrderHistory";
import PaymentSuccess from "/src/components/PaymentSuccess";
import KioskCountdownTimer from "/src/components/KioskCountdownTimer";
import styled from "styled-components";
import { TailSpin } from "react-loader-spinner";
import { QRCodeCanvas } from "qrcode.react";
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 800px;
  overflow-y: auto;
  font-size: 20px;
`;
const ButtonClose = styled.button`
  background-color: #f47e28;
  margin-left: 400px;
  margin-top: 60px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  &:hover {
    border: 4px solid #0021f3;
  }
`;
// QR코드 DIV 추가
const QRWrapper = styled.div`
  margin-top: 20px;
  text-align: center;
`;
const PaymentMethods = styled.div`
  background-color: #f47e28;
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  padding: 40px;
  overflow-y: auto;
  font-size: 30px;
  text-align: center;
`;
const ButtonPay = styled.div`
  margin-top: 207px;
  background-color: yellow;
  &:hover {
    border: 4px solid #0021f3;
  }
  &:hover {
    border: 4px solid #0021f3;
  }
`;
const Pay = styled.div`
  color: #f47e28;
`;
const ButtonPay2 = styled.button`
  background-color: yellow;
  font-weight: bold;
  font-size: 30px;
  border-radius: 10px;
  &:hover {
    border: 4px solid #0021f3;
  }
`;
const loadingSpinnerStyles = {
  loadingSpinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: "10px",
  },
};
function PaymentScreen({
  onClose,
  items,
  totalAmount,
  totalPrice,
  makeAllZero,
}) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // qr코드 표시 상태
  const [showCountdown, setShowCountdown] = useState(false);
  // 타이머 초기화를 위한 usestate
  const [timerKey, setTimerKey] = useState(0);
  // 화면 이동을 위한 네비게이트 선언
  const navigate = useNavigate();
  const toHome = () => {
    navigate("/");
  };
  // // QR코드 추가 하기 전 기존 페이먼트
  // const handlePayment = () => {
  //   setIsProcessing(true);
  //   setTimeout(() => {
  //     setIsProcessing(false);
  //     setIsComplete(true);
  //   }, 2000);
  // };
  // QR 코드 추가 후 PAYMENT
  const handlePayment = () => {
    if (paymentMethod === "qr") {
      setShowQRCode(true);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
      }, 2000);
    }
  };
  // QR코드 추가 후 QR코드 페이먼트
  const handleQRCodePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      setShowQRCode(false);
    }, 3000);
  };
  const [orderId, setOrderId] = useState(() => {
    const storedValue = sessionStorage.getItem("paymentCount");
    return storedValue ? parseInt(storedValue) : 1000;
  });
  useEffect(() => {
    sessionStorage.setItem("paymentCount", orderId);
  }, [orderId]);
  const handleClose = () => {
    // 일반적인 닫기 버튼 기능 (예: 모달 닫기)
    onClose();
  };
  const handleCompleteClose = () => {
    // orderId 상태를 안전하게 업데이트
    setOrderId((prevOrderId) => {
      const updatedOrderId = prevOrderId + 1;
      console.log("Updated OrderId:", updatedOrderId); // 디버깅용 로그
      return updatedOrderId;
    });
    // 장바구니 비우기
    makeAllZero();
    // 모달 닫기를 상태 업데이트 이후에 실행
    setTimeout(() => {
      onClose();
      // 홈으로 이동
      toHome();
    }, 50);
  };
  const handleCountdownEnd = () => {
    setShowCountdown(false);
    // 결제가 이루어 지지 않고 타이머가 만료되면 모달창 닫고 메뉴화면으로 이동
    onClose();
  };
  // // QR코드 추가 전 핸들 메서드
  // const handleMethodSelect = (method) => {
  //   setPaymentMethod(method);
  //   setTimerKey((prevKey) => prevKey + 1);
  //   setShowCountdown(true);
  // };
  // QR코드 핸들 메서드 추가
  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === "qr") {
      setShowQRCode(true);
    } else {
      setTimerKey((prevKey) => prevKey + 1);
      setShowCountdown(true);
    }
  };
  const orderDate = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const options2 = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = orderDate.toLocaleString("ko-KR", options);
  const formattedDate2 = orderDate.toLocaleString("ko-KR", options2);
  const orders = [
    {
      id: orderId,
      date: formattedDate,
      date2: formattedDate2,
      totalAmount: totalAmount,
      totalPrice: totalPrice,
      items: items,
    },
  ];
  useEffect(() => {
    if (paymentMethod) {
      setShowCountdown(true);
    }
  }, [paymentMethod]);
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        //  장바구니 비우기
        makeAllZero();
        // 홈 화면으로 이동
        toHome();
      }, 11000); // 11초 후 홈 화면으로 이동(원형 타이머가 10초에 끝나므로 '첫 화면으로 돌아갑니다' 메시지를 보여주기 위해 11초로 설정)
      return () => clearTimeout(timer);
    }
  }, [isComplete, onClose, toHome]);
  const buttonStyle = (method) => ({
    padding: "20px",
    margin: "10px",
    border: `3px solid ${paymentMethod === method ? "#00BFFF" : "#ccc"}`,
    borderRadius: "10px",
    backgroundColor: paymentMethod === method ? "#E6F7FF" : "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "150px",
    height: "150px",
  });
  const imageStyle = {
    width: "80px",
    height: "80px",
    marginBottom: "10px",
  };
  // QR코드 결제 URL 추가
  const qrCodeValue = `http://localhost:5175/menu'?orderId=${orderId}&amount=${totalPrice}`; // 결제 URL
  return (
    <ModalOverlay>
      <ModalContent>
        <div className="payment-screen">
          {!isComplete ? (
            <>
              <Pay>
                <h2>결제 화면</h2>
                {showCountdown && (
                  <KioskCountdownTimer
                    key={timerKey}
                    startFrom={30} //  30초 타이머 설정
                    onCountdownEnd={handleCountdownEnd}
                  >
                    <img
                      src="/src/images/creditCardClock.png"
                      alt=""
                      style={imageStyle}
                    />
                  </KioskCountdownTimer>
                )}
              </Pay>
              <div className="order-summary">
                <OrderHistory orders={orders} />
              </div>
              <PaymentMethods>
                <div className="payment-methods">
                  <br />
                  <h2>결제 수단 선택</h2>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        style={buttonStyle("card")}
                        onClick={() => handleMethodSelect("card")}
                      >
                        <img
                          src="/src/images/creditCard.png"
                          alt="카드"
                          style={imageStyle}
                        />
                        <span>카드</span>
                      </button>
                      <br />
                      <button
                        style={buttonStyle("cash")}
                        onClick={() => handleMethodSelect("cash")}
                      >
                        <img
                          src="/src/images/money.png"
                          alt="현금"
                          style={imageStyle}
                        />
                        <span>현금</span>
                      </button>
                      <br />
                      {/* QR코드 버튼 추가 */}
                      <button
                        style={buttonStyle("qr")}
                        onClick={() => handleMethodSelect("qr")}
                      >
                        <img
                          src="/src/images/image.png"
                          alt="QR 코드"
                          style={imageStyle}
                        />
                        <span>QR 코드</span>
                      </button>
                    </div>
                    {/* QR코드 추가 후 페이먼트 메서드  */}
                    {paymentMethod && paymentMethod !== "qr" && (
                      <div
                        style={{
                          marginLeft: "20px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ButtonPay>
                          <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            style={buttonStyle("payment")}
                          >
                            <img
                              src="/src/images/payments.png"
                              alt="결제"
                              style={imageStyle}
                            />
                            <span>결제하기</span>
                          </button>
                        </ButtonPay>
                      </div>
                    )}
                    {/* QR코드 페이먼드트 메서드 추가하기 전 결제 메서드 */}
                    {/* {paymentMethod && (
                      <div
                        style={{
                          marginLeft: "20px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ButtonPay>
                          <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            style={buttonStyle("payment")}
                          >
                            <img
                              src="/src/images/payments.png"
                              alt="결제"
                              style={imageStyle}
                            />
                            <span>결제하기</span>
                          </button>
                        </ButtonPay>
                      </div>
                    )} */}
                  </div>
                </div>
                {/* QR코드 스캔 및 결제 추가 */}
                {showQRCode && (
                  <QRWrapper>
                    <QRCodeCanvas value={qrCodeValue} size={200} />
                    <p>QR 코드를 스캔하여 결제를 진행하세요.</p>
                    <ButtonPay2 onClick={handleQRCodePayment}>
                      결제 완료
                    </ButtonPay2>
                  </QRWrapper>
                )}
              </PaymentMethods>
              {isProcessing && (
                <div style={loadingSpinnerStyles.loadingSpinner}>
                  <TailSpin color="#00BFFF" height={80} width={80} />
                  <p style={loadingSpinnerStyles.loadingText}>
                    결제 처리 중...
                  </p>
                </div>
              )}
            </>
          ) : (
            // 주문내역 출력
            <PaymentSuccess orderDetails={orders[0]} />
          )}
          {isComplete && (
            <ButtonClose onClick={handleCompleteClose}>닫기</ButtonClose>
          )}
          {!isComplete && <ButtonClose onClick={handleClose}>닫기</ButtonClose>}
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
PaymentScreen.propTypes = {
  items: PropTypes.array,
  totalAmount: PropTypes.number,
  totalPrice: PropTypes.number,
  onClose: PropTypes.func,
  makeAllZero: PropTypes.func.isRequired,
};
export default PaymentScreen;
