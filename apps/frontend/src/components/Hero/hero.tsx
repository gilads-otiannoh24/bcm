import { useAuth } from "../../context/AuthContext";
import styles from "./hero.module.css";

const HeroSection = () => {
  const { theme } = useAuth();
  return (
    <div className={styles.container}>
      <section className={styles.wrapper}>
        <div className={styles.hero}></div>
        <div className={styles.content}>
          <h2
            className={styles["h1--scalingSize"] + " text-black text-3xl"}
            data-text="An awesome title"
          >
            Business Card Manager
          </h2>
          <p className="py-6 text-black text-lg">
            Digitize your business cards, manage connections, and grow your
            network efficiently.
          </p>
          <input
            checked={theme === "dark"}
            className="hidden"
            type="checkbox"
            id="switch"
          />
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
