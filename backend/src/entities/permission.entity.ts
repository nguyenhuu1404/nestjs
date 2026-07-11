export class PermissionEntity {
    id: number;
    name: string;
    module: string;
    description: string | null;
    createdAt: Date;

    constructor(partial: Partial<PermissionEntity>) {
        Object.assign(this, partial);
    }
}
