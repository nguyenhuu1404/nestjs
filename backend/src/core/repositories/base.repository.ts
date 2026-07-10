export abstract class BaseRepository<T, CreateInput, UpdateInput> {
    protected abstract model: any; // Prisma delegate, vd this.prisma.user, this.prisma.role
  
    findAll(args?: any): Promise<T[]> {
      return this.model.findMany(args);
    }
  
    findById(id: number, args?: any): Promise<T | null> {
      return this.model.findUnique({ where: { id }, ...args });
    }
  
    create(data: CreateInput): Promise<T> {
      return this.model.create({ data });
    }
  
    update(id: number, data: UpdateInput): Promise<T> {
      return this.model.update({ where: { id }, data });
    }
  
    delete(id: number): Promise<T> {
      return this.model.delete({ where: { id } });
    }
  }
