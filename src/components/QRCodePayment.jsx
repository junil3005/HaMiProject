import React, { useState } from "react";
import QRCode from "qrcode.react";
import { QRCodeScanner } from "react-qr-scanner";
import styled from "styled-components";

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
  height: 600px;
  overflow-y: auto;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

function QRCodePayment({ onClose, totalPrice }) {
  const [qrCodeData, setQRCodeData] = useState(null); // QR 코드 데이터
  const [isPaymentComplete, setIsPaymentComplete] = useState(false); // 결제 상태
  const [showScanner, setShowScanner] = useState(false); // QR 스캐너 표시 여부

  const handleGenerateQRCode = () => {
    const paymentData = {
      totalPrice,
      timestamp: new Date().toISOString(),
    };
    setQRCodeData(JSON.stringify(paymentData));
  };

  const handleScan = (data) => {
    if (data) {
      console.log("Scanned Data:", data);
      const parsedData = JSON.parse(data.text);

      if (parsedData.totalPrice === totalPrice) {
        setIsPaymentComplete(true);
        setShowScanner(false);
      } else {
        alert("결제 금액이 일치하지 않습니다.");
      }
    }
  };

  const handleScannerError = (error) => {
    console.error("QR Scanner Error:", error);
    alert("QR 코드를 스캔하는 중 오류가 발생했습니다.");
  };

  fetch("http://localhost:5173/api/resource")

  return (
    <ModalOverlay>
      <ModalContent>
        {!isPaymentComplete ? (
          <>
            <h2>QR 코드 결제</h2>
            {qrCodeData ? (
              <>
                <p>아래 QR 코드를 스캔하여 결제를 진행하세요:</p>
                <QRCode value={qrCodeData} size={200} />
                <Button onClick={() => setShowScanner(true)}>
                  QR 코드 스캐너 열기
                </Button>
              </>
            ) : (
              <Button onClick={handleGenerateQRCode}>QR 코드 생성</Button>
            )}
            {showScanner && (
              <QRCodeScanner
                onScan={handleScan}
                onError={handleScannerError}
                style={{ width: "100%" }}
              />
            )}
          </>
        ) : (
          <>
            <h2>결제가 완료되었습니다!</h2>
            <p>총 결제 금액: {totalPrice.toLocaleString()}원</p>
            <Button onClick={onClose}>닫기</Button>
          </>
        )}

        
      </ModalContent>
    </ModalOverlay>
  );
}

export default QRCodePayment;
