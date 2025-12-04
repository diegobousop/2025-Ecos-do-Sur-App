export enum Role {
    User = 0,
    Bot = 1,
}

export interface MessageOption {
    text: string;
    callback_data: string;
}

export interface Message {
    role: Role;
    content: string;
    imageUrl?: string;
    prompt?: string;
    options?: MessageOption[][];
}

export interface Chat {
    id: number;
    title: string;
}