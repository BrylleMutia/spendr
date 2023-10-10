import React from "react";

type CardProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Card = ({ children, className }: CardProps) => {
  return <article className={`rounded-lg bg-white shadow-sm ${className}`}>{children}</article>;
};

export default Card;
