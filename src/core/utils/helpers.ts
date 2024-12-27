import { SelectQueryBuilder } from 'typeorm';

export function applyDynamicConditions(
  qb: SelectQueryBuilder<any>,
  conditions: { [key: string]: any },
): SelectQueryBuilder<any> {
  Object.keys(conditions).forEach((key) => {
    qb.andWhere(`${key} = :${key}`, { [key]: conditions[key] });
  });
  return qb;
}
