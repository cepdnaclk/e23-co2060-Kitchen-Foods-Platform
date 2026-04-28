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

export interface FoodCategory {
    id: string;
    name: string;
    description: string;
}

export interface FoodItem {
    id: string;
    name: string;
    description: string;
    price: number;
    chefId: string | null;
    imageUrl: string;
    categoryId: string;
    categoryName: string;
}
