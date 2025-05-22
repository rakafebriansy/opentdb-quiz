import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertErrorProps {
    message: string | null;
}

const AlertError: React.FC<AlertErrorProps> = ({ message }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg w-fit max-w-xs"
                >
                    <div className="flex justify-between items-center gap-4">
                        <span className="font-medium">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertError;