
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "../../lib/utils.js";

function Input({ className, type = "text", ...props }) {
    return (
        <InputPrimitive
            data-slot="input"
            type={type}
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            {...props}
        />
    );
}

export { Input };
