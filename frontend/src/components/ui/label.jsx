
function Label({ className = "", ...props }) {
    return (
        <label
            data-slot="label"
            className={className}
            {...props}
        />
    );
}

export { Label };
