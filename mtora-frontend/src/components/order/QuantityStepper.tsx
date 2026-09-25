interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 20,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="qty-stepper">
      <button
        type="button"
        id="qtyMinus"
        aria-label="Decrease quantity"
        onClick={handleDecrement}
        disabled={quantity <= min}
      >
        −
      </button>
      <input
        type="text"
        id="packQty"
        name="packQty"
        value={quantity}
        inputMode="numeric"
        readOnly
      />
      <button
        type="button"
        id="qtyPlus"
        aria-label="Increase quantity"
        onClick={handleIncrement}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
}
