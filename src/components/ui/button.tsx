
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-full px-4 py-2",
        lg: "h-12 rounded-full px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Add inline styles to ensure rendering regardless of CSS loading
    const getBaseStyles = () => {
      const styles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      };
      
      // Add variant-specific styles
      if (variant === 'default' || !variant) {
        styles.backgroundColor = 'hsl(142, 76%, 36%)';
        styles.color = 'white';
      } else if (variant === 'outline') {
        styles.backgroundColor = 'transparent';
        styles.color = '#333';
        styles.border = '1px solid #ddd';
      } else if (variant === 'secondary') {
        styles.backgroundColor = '#f4f4f5';
        styles.color = '#18181b';
      }
      
      // Add size-specific styles
      if (size === 'lg') {
        styles.height = '3rem';
        styles.padding = '0 2rem';
        styles.fontSize = '1rem';
      } else if (size === 'sm') {
        styles.height = '2.25rem';
        styles.padding = '0 1rem';
        styles.fontSize = '0.875rem';
      } else {
        // default
        styles.height = '2.75rem';
        styles.padding = '0 1.5rem';
        styles.fontSize = '0.875rem';
      }
      
      return styles;
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={getBaseStyles()}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
