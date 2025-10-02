
import { LayoutGroup, motion } from "framer-motion";
import RotatingText from "../reactbits/RotatingText";
import "./AnimatedTitle.css";

const ROTATION_INTERVAL = 3000;

interface AnimatedTitleProps {
  descriptionText: string;
  animatedTexts: string[];
  enableAnimation: boolean;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  descriptionText,
  animatedTexts,
  enableAnimation,
}) => {
  return (
    <LayoutGroup>
      <motion.p
        className="rotating-text-ptag"
        layout
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "3rem",
          fontWeight: 900,
        }}
      >
        <motion.span
          className="static-text"
          layout
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          style={{ marginRight: "1rem" }}
        >
          {descriptionText}
        </motion.span>
        {enableAnimation && (
          <motion.span
            className="rotating-text-main"
            layout
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <RotatingText
              texts={animatedTexts}
              mainClassName=""
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="rotating-text-split"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={ROTATION_INTERVAL}
            />
          </motion.span>
        )}
      </motion.p>
    </LayoutGroup>
  );
};

export default AnimatedTitle;
