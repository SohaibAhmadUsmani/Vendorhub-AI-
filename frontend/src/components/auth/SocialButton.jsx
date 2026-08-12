function SocialButton({ icon, text, onClick, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-purple)] hover:shadow-md gap-2"
        >
            {icon}
            <span>{text}</span>
        </button>
    );

}

export default SocialButton;