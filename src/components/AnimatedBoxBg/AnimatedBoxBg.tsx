import React from "react";
import "./styles.css";

type AnimatedBoxBgProps = {
   children: React.ReactNode;
};

const AnimatedBoxBg = ({ children }: AnimatedBoxBgProps) => {
   return (
      <div className="area">
         <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
         </ul>
         {children}
      </div>
   );
};

export default AnimatedBoxBg;
