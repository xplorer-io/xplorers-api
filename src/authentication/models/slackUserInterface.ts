export interface FetchSlackUserParams {
    userId?: string;
    email?: string;
    userName?: string;
};

export interface SlackUserProfile {
    id?: string;
    first_name?: string;
    last_name?: string;
    title?: string;
    email?: string;
};

export type SlackUserStatusResponse = {
    isActive: boolean;
};