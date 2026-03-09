import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/member/payments");
    }, 3000); // redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ Payment Successful!</h2>
      <p>You will be redirected to your payments page...</p>

      <button
        onClick={() => navigate("/member/payments")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Go to Payments
      </button>
    </div>
  );
}

export default PaymentSuccess;