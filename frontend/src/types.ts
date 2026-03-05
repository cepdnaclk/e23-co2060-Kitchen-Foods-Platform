export interface Request {
    id: string;
    title: string;
    date: string;
    guests: number;
    budget: number;
    status: 'open' | 'closed' | 'completed';
    bids: number;
    location: string;
    dietary: string[];
    description: string;
}
