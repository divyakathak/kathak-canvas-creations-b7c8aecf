import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans uppercase tracking-[0.18em] text-xs font-medium ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-primary/40 text-primary bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
        ghost: "hover:bg-secondary hover:text-foreground normal-case tracking-normal",
        link: "text-primary underline-offset-4 hover:underline normal-case tracking-normal",
        gold: "bg-gradient-gold text-noir hover:shadow-gold hover:scale-[1.02]",
        hero: "border border-primary/60 text-cream bg-transparent backdrop-blur-sm hover:bg-primary hover:text-noir hover:border-primary",
        ornate: "border border-primary text-primary bg-transparent relative overflow-hidden hover:text-noir before:absolute before:inset-0 before:bg-primary before:translate-y-full before:transition-transform before:duration-500 hover:before:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {variant === "ornate" ? <span className="relative z-10 flex items-center gap-2">{props.children}</span> : props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
