interface OrderSummaryProps {
  packPrice: number;
  quantity: number;
  deliveryFee: number | null;
  codFee: number;
  total: number;
}

export default function OrderSummary({
  packPrice,
  quantity,
  deliveryFee,
  codFee,
  total,
}: OrderSummaryProps) {
  const packSummaryText = packPrice > 0
    ? `₹${packPrice} × ${quantity} = ₹${packPrice * quantity}`
    : "—";

  return (
    <div className="order-summary" id="orderSummary">
      <div className="row">
        <span>Pack price × quantity</span>
        <span id="sumPack">{packSummaryText}</span>
      </div>

      <div className="row">
        <span>Delivery charge</span>
        <span id="sumDelivery">
          {deliveryFee === null ? (
            "—"
          ) : deliveryFee === 0 ? (
            <span className="free-tag">FREE</span>
          ) : (
            `₹${deliveryFee}`
          )}
        </span>
      </div>

      {codFee > 0 && (
        <div className="row" id="codRow" style={{ display: "flex" }}>
          <span>COD charge</span>
          <span id="sumCod">₹{codFee}</span>
        </div>
      )}

      <div className="row total">
        <span>Total Payable</span>
        <span id="sumTotal">₹{total}</span>
      </div>
    </div>
  );
}
