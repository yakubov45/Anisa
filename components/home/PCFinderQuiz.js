"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const icons = {
    gaming: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a1 1 0 11-2 0 1 1 0 012 0zM9 11a1 1 0 11-2 0 1 1 0 012 0zM12 7a1 1 0 110-2 1 1 0 010 2zM12 15a1 1 0 110-2 1 1 0 010 2z" /><rect x="2" y="6" width="20" height="12" rx="3" strokeWidth="2" /></svg>,
    work: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    rendering: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
    office: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    coding: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    heavy: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1.5 3 4 3h8c2.5 0 4-1 4-3V7c0-2-1.5-3-4-3H8C5.5 4 4 5 4 7zm0 0c0 2 1.5 3 4 3h8c2.5 0 4-1 4-3M4 12c0 2 1.5 3 4 3h8c2.5 0 4-1 4-3" /></svg>,
    adobe: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    design3d: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>,
    cad: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    esports: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    aaa: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    money: <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export default function PCFinderQuiz() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [budgetValue, setBudgetValue] = useState("");

    const getQuestion = (stepIndex) => {
        if (stepIndex === 0) {
            return {
                title: "Kompyuterni nima maqsadda xarid qilyapsiz?",
                options: [
                    { id: "gaming", label: "Faqat o'yinlar uchun", icon: icons.gaming },
                    { id: "work", label: "Dasturlash / Ofis ishlari", icon: icons.work },
                    { id: "rendering", label: "3D Dizayn / Video Montaj", icon: icons.rendering }
                ]
            };
        }
        if (stepIndex === 1) {
            if (answers[0] === 'work') {
                return {
                    title: "Asosan qanday dasturlardan foydalanasiz?",
                    options: [
                        { id: "office", label: "Word, Excel, Brauzer (Yengil)", icon: icons.office },
                        { id: "coding", label: "VS Code, Docker, Web dasturlash", icon: icons.coding },
                        { id: "heavy", label: "1C, Katta bazalar (Og'ir)", icon: icons.heavy }
                    ]
                };
            }
            if (answers[0] === 'rendering') {
                return {
                    title: "Qaysi dasturlarda ishlaysiz?",
                    options: [
                        { id: "adobe", label: "Premiere Pro, After Effects", icon: icons.adobe },
                        { id: "3d", label: "Blender, 3ds Max, Maya", icon: icons.design3d },
                        { id: "cad", label: "AutoCAD, Revit, CorelDraw", icon: icons.cad }
                    ]
                };
            }
            return {
                title: "Qanday darajadagi o'yinlarni o'ynaysiz?",
                options: [
                    { id: "esports", label: "CS2, Valorant, Dota 2 (Yengil)", icon: icons.esports },
                    { id: "aaa", label: "Cyberpunk, GTA V, RDR2 (Og'ir)", icon: icons.aaa }
                ]
            };
        }
        if (stepIndex === 2) {
            return {
                title: "Kompyuter uchun qancha pul ajratmoqchisiz?",
                options: [
                    { id: "6000000", label: "~ $500 (Boshlang'ich daraja)", icon: icons.money },
                    { id: "12000000", label: "~ $1000 (O'rta daraja)", icon: icons.money },
                    { id: "24000000", label: "~ $2000+ (Professional)", icon: icons.money }
                ],
                hasCustomInput: true
            };
        }
        return null;
    };

    const currentQuestion = getQuestion(step);
    const totalSteps = 3;

    const handleAnswer = (val) => {
        setAnswers({ ...answers, [step]: val });
        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            setStep(totalSteps); // Show results
        }
    };

    const handleBudgetSubmit = () => {
        if (!budgetValue || isNaN(budgetValue) || budgetValue < 100000) return;
        handleAnswer(budgetValue);
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setBudgetValue("");
    };

    return (
        <section className="bg-primary/5 dark:bg-white/5 rounded-3xl md:rounded-[3rem] p-8 md:p-16 border border-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            {/* Background blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

            <div className="flex-1 space-y-6 z-10 text-center md:text-left">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-xs border border-primary/20">
                    O'zingizga mosini toping
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                    Sizga qanday kompyuter kerak?
                </h2>
                <p className="text-surface-600 dark:text-surface-400 font-medium text-lg max-w-xl">
                    Atigi 3 ta qisqa savolga javob bering va biz sizning ehtiyojingiz hamda byudjetingizga mos tushuvchi eng zo'r kompyuterni topib beramiz!
                </p>
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn-premium btn-premium-red text-white font-black py-4 px-8 rounded-xl uppercase tracking-widest text-sm inline-flex items-center gap-2 shadow-xl shadow-primary/30"
                >
                    Testni boshlash
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>

            <div className="flex-1 w-full relative z-10 hidden md:block">
                <img src="https://www.google.com/imgres?q=modern%20computer%20fotos&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1525547719571-a2d4ac8945e2%3Ffm%3Djpg%26q%3D60%26w%3D3000%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%253D&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fcomputer&docid=WjFMXVMU2MKcuM&tbnid=uGvESnLpLrohcM&vet=12ahUKEwjq6NPxsc2UAxU3_rsIHTxOEmkQnPAOegQINRAB..i&w=3000&h=3750&hcb=2&ved=2ahUKEwjq6NPxsc2UAxU3_rsIHTxOEmkQnPAOegQINRAB" alt="PC Finder" className="w-full h-auto drop-shadow-2xl scale-110 hover:scale-125 transition-transform duration-700" />
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#0c0c0e] w-full max-w-2xl rounded-[2rem] p-6 md:p-8 relative z-10 border border-black/10 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[95vh]"
                        >
                            <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-surface-400 hover:text-foreground bg-surface-100 dark:bg-white/5 p-2 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            {step < totalSteps ? (
                                <div className="space-y-6 mt-2">
                                    <div className="flex gap-2 mb-6">
                                        {[...Array(totalSteps)].map((_, i) => (
                                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-surface-200 dark:bg-white/10'}`}></div>
                                        ))}
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">
                                        {currentQuestion.title}
                                    </h3>

                                    <div className="grid gap-2.5">
                                        {currentQuestion.options && currentQuestion.options.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleAnswer(opt.id)}
                                                className="w-full text-left px-5 py-3.5 rounded-2xl border-2 border-surface-200 dark:border-white/10 hover:border-primary dark:hover:border-primary font-bold text-base md:text-lg transition-all hover:bg-primary/5 group flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-surface-100 dark:bg-white/5 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                                        {opt.icon}
                                                    </div>
                                                    <span className="text-surface-700 dark:text-surface-300 group-hover:text-primary transition-colors">{opt.label}</span>
                                                </div>
                                                <svg className="w-5 h-5 text-surface-300 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        ))}

                                        {currentQuestion.hasCustomInput && (
                                            <div className="mt-2 border-t border-black/5 dark:border-white/5 pt-4">
                                                <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-3">Yoki o'zingiz kiriting (UZS)</p>
                                                <div className="flex flex-col md:flex-row gap-3">
                                                    <div className="relative flex-1">
                                                        <input
                                                            type="number"
                                                            value={budgetValue}
                                                            onChange={(e) => setBudgetValue(e.target.value)}
                                                            placeholder="Masalan: 7000000"
                                                            className="w-full bg-surface-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-3 text-base font-bold focus:outline-none focus:border-primary transition-colors text-foreground"
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 font-black text-sm">UZS</span>
                                                    </div>
                                                    <button
                                                        onClick={handleBudgetSubmit}
                                                        disabled={!budgetValue}
                                                        className="btn-premium btn-premium-red disabled:bg-surface-200 disabled:dark:bg-white/10 disabled:cursor-not-allowed text-white font-black px-6 py-3 rounded-xl uppercase tracking-widest text-xs shadow-xl shadow-primary/20 md:w-auto w-full flex-shrink-0 whitespace-nowrap"
                                                    >
                                                        Tasdiqlash
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 py-8">
                                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-foreground">Ajoyib tanlov!</h3>
                                    <p className="text-surface-500 font-medium text-lg">
                                        Sizning ehtiyojlaringiz va narx byudjetingizga ({Number(answers[2]).toLocaleString()} UZS atrofida) eng mos keluvchi kompyuterlarni topamiz!
                                    </p>
                                    <div className="pt-4 flex flex-col items-center gap-4">
                                        <a href={`/prebuilts?purpose=${answers[0]}&budget=${answers[2]}`} className="btn-premium btn-premium-red text-white font-black py-4 px-8 rounded-xl uppercase tracking-widest text-sm inline-block shadow-xl shadow-primary/30 w-full md:w-auto">
                                            Kompyuterlarni Ko'rish
                                        </a>
                                        <button onClick={resetQuiz} className="text-xs font-bold uppercase tracking-widest text-surface-400 hover:text-foreground transition-colors p-2">
                                            Qaytadan boshlash
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
