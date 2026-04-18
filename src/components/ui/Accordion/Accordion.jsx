import React from "react";
import { motion } from "framer-motion";
import { accordionStyles } from "./Accordion.styles";
import { cn } from "../../../utils/cn";
import { VARIANTS } from "../../../animations/variants";

export const AccordionItem = ({ question, answer, isOpen, onClick, className }) => {
  return (
    <div className={cn(accordionStyles.container(), className)}>
      <button onClick={onClick} className={accordionStyles.button()}>
        <span>{question}</span>
        <i className={accordionStyles.icon({ isOpen })} />
      </button>
      {isOpen && (
        <motion.div
          variants={VARIANTS.slideDown}
          initial="hidden"
          animate="visible"
          className={accordionStyles.content()}
        >
          <p>{answer}</p>
        </motion.div>
      )}
    </div>
  );
};
