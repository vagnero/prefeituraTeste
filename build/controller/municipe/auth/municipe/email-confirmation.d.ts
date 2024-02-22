export declare class EmailConfirmation {
    private from;
    private to;
    private subject;
    private text;
    private token;
    private confirmationLink;
    creationDate: Date;
    expirationDate: Date;
    constructor(to: string, subject: string);
    sendEmail(): Promise<{
        accepted: boolean;
        status: number;
        token: string;
    }>;
}
