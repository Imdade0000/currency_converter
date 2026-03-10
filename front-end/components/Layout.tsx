import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-scréen flex flex-col bg-slate-50 overflow-x-hidden">
            <Header />

            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
            <AuthModal />
        </div>
    );
}
