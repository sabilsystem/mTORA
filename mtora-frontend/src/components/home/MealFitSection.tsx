import Image from "next/image";

interface MealItem {
  name: string;
  src: string;
  sw1: string;
  sw2: string;
}

const MEALS: MealItem[] = [
  {
    name: "Dal",
    src: "/assets/meals/dal.png",
    sw1: "#2f4a2e",
    sw2: "#4d6b3f",
  },
  {
    name: "Paneer",
    src: "/assets/meals/paneer.png",
    sw1: "#f0e2c0",
    sw2: "#e0c583",
  },
  {
    name: "Sabzi",
    src: "/assets/meals/sabzi.png",
    sw1: "#5a3620",
    sw2: "#8a5527",
  },
  {
    name: "Curd",
    src: "/assets/meals/curd.png",
    sw1: "#f7f4ea",
    sw2: "#e5ddc4",
  },
  {
    name: "Eggs",
    src: "/assets/meals/eggs.png",
    sw1: "#e8d9a8",
    sw2: "#d1a94f",
  },
  {
    name: "Chicken",
    src: "/assets/meals/chicken.png",
    sw1: "#7a3b22",
    sw2: "#a85a30",
  },
];

export default function MealFitSection() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="mealfit-head">
          <span className="eyebrow">How it fits</span>
          <h2 className="reveal">Same meals. More protein.</h2>
          <p className="lede reveal">
            Pair it with the meals you already love — mTORA isn&apos;t a
            replacement for real food, it&apos;s an easy protein upgrade to it.
          </p>
        </div>

        <div className="meal-row reveal">
          {MEALS.map((meal) => (
            <div className="meal-chip" key={meal.name}>
              <div
                className="swatch"
                style={
                  {
                    "--sw1": meal.sw1,
                    "--sw2": meal.sw2,
                  } as React.CSSProperties
                }
              >
                <Image
                  src={meal.src}
                  alt={meal.name}
                  width={168}
                  height={168}
                />
              </div>
              <span>{meal.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
