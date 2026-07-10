export abstract class BaseMapper<TSource, TEntity> {
    abstract toEntity(source: TSource): TEntity;

    toEntities(sources: TSource[]): TEntity[] {
        return sources.map((s) => this.toEntity(s));
    }
}
