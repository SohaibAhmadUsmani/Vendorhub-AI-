function SocialButton({ icon, text, onClick, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="flex h-11 w-full items-center justify-center rounded-xl border border-[var(--border)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-border)] hover:shadow-md gap-2"
        >
            {icon}
            {text}
        </button>
    );

}

export default SocialButton;