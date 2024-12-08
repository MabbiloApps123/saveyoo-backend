import { FindOptions } from 'sequelize/types';

interface SequelizeFilter<T> extends FindOptions<T> {
  where?: Record<string, any>;
  attributes?: any[] | { include?: string[]; exclude: string[] };
  include?: any[];
  order?: any[];
  group?: string[] | string;
  having?: any;
  limit?: number;
  offset?: number;
  raw?: boolean;
  subQuery?: boolean;
  defaults?: any;
}

export default SequelizeFilter;
