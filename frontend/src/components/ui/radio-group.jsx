
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "../../lib/utils.js";

function RadioGroup({ className, ...props }) {
    return (
        <RadioGroupPrimitive
            data-slot="radio-group"
            className={cn("grid gap-3", className)}
            {...props}
        />
    );
}

function RadioGroupItem({ className, ...props }) {
    return (
        <RadioPrimitive.Root
            data-slot="radio-group-item"
            className={cn(
                "aspect-square size-4 rounded-full border border-input text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

export { RadioGroup, RadioGroupItem };
