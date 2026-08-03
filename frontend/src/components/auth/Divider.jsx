function Divider({text}){
 return(
        <div className="my-6 flex items-center">
                        <div className="h-px flex-1 bg-[var(--border)]"></div>

                        <span className="mx-4 text-xs uppercase tracking-wider text-gray-400">
                            {text}
                        </span>

                        <div className="h-px flex-1 bg-[var(--border)]"></div>
                    </div>
 );
}
export default Divider;