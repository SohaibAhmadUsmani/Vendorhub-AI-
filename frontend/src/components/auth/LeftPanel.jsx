import bgImage from "../../assets/bg.webp";

 export function Dots({ count, activeIndex, tone = "light" }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;

        return (
          <span
            key={index}
            className={` block h-2 rounded-full transition-all duration-300
              ${isActive ? "w-6" : "w-2"}
              ${tone === "light"
                ? isActive
                  ? "bg-white"
                  : "bg-white/40"
                : isActive
                  ? "bg-[var(--primary-purple)]"
                  : "bg-[var(--border-color)]"
              }
            `}
          />
        );
      })}
    </div>
  );
}

export function LeftPanel({
  variant,
  icon: Icon,
  iconClassName,
  title,
  subtitle,
  dotsIndex,
}) {
  return (
    <div className="relative hidden min-h-screen overflow-hidden md:flex md:w-full ">
      {/* Background Image */}
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover "
      />

      {/* Dark overlay for readable text */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Welcome Content */}
      {variant === "welcome" && (
        <div className="absolute bottom-16 left-10 z-10 max-w-[320px] text-white lg:left-12">
          <p className="font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight">
            Welcome
            <br />
            <span className="text-xl">to VendorHub AI</span>
          </p>

          <p className="mt-4 text-sm leading-6 text-white/85">
            VendorHub AI helps you connect, collaborate and grow your business
            with the power of smart procurement.
          </p>
        </div>
      )}

      {/* Dots */}
      {variant === "welcome" && (
        <div className="absolute bottom-6 left-10 z-10 lg:left-12">
          <Dots count={2} activeIndex={dotsIndex} />
        </div>
      )}

      {/* Status Content */}
      {variant === "status" && (
        <div className="relative z-10  flex h-full flex-col items-center justify-end  text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
            <Icon
              size={35}
              className={iconClassName}
            />
          </div>

          <h3 className="mt-5 font-heading text-3xl font-bold text-white">
            {title}
          </h3>

          <p className="mt-3 max-w-md text-base leading-7 text-white/85">
            {subtitle}
          </p>

        </div>
      )}
    </div>
  );
}
