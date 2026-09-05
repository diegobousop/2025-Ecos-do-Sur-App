export enum Role {
    User = 0,
    Bot = 1,
    BotHeader = 2
}

export interface MessageOption {
    text: string;
    callback_data: string;
}

export interface Message {
    id: string;
    role: Role;
    content: string;
    imageUrl?: string;
    prompt?: string;
    options?: MessageOption[][];
}

export interface Chat {
    id: number;
    type: 'urgent' | 'information';
    title: string;
    messages?: Message[];
    createdAt: string;
    updatedAt?: string;
    isFixed?: boolean;
    user_id?: string | null;
}

export interface NotificationItem {
    _id?: string;
    titulo: string;
    fecha: string;
    cuerpo: string;
    enlace_externo?: string | null;
    url_imagen?: string | null;
    type?: 'notification';
}

export interface UserData {
    id: string;
    userName: string;
    email: string;
    role: 'admin' | 'user';
    numberOfChats: number;
    numberOfUrgentChats: number;
    numberOfInformationChats: number;
}