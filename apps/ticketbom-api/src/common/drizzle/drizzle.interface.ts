import { DrizzleConfig } from 'drizzle-orm';

export interface DrizzlePGConfig {
  connection: 'client' | 'pool';
  config?: DrizzleConfig<any> | undefined;
}
