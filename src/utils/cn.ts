import { type ClassValue, clsx } from 'clsx';
// Note: tailwind-merge is not installed yet, but recommended for advanced class merging. 
// For now, clsx is sufficient for basic needs. If conflicts arise, we will install tailwind-merge.

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}
