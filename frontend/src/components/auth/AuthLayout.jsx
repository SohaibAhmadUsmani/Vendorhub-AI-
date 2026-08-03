function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* <Logo /> */}

            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;