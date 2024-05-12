import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzlePGConfig } from './drizzle.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzlePGConfig>()
  .setExtras(
    {
      tag: 'default',
    },
    (definition, extras) => ({
      ...definition,
      tag: extras.tag,
    })
  )
  .build();
