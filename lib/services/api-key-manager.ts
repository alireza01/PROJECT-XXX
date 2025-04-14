import { BaseService, ServiceConfig } from './base-service';
import { trackError } from '../error-handling';

interface ApiKey {
  id: string;
  key: string;
  user_id: string | null;
  is_active: boolean;
}

export class ApiKeyManager extends BaseService<ApiKey> {
  protected constructor(config?: ServiceConfig) {
    super('ApiKeyManager', {
      ...config,
      tableName: 'gemini_api_keys',
      primaryKey: 'id',
      userIdKey: 'user_id',
      activeKey: 'is_active',
    });
  }

  public static getInstance<T extends BaseService<any>>(
    this: new (config?: ServiceConfig) => T,
    config?: ServiceConfig
  ): T {
    return super.getInstance<T>(config);
  }

  public static getInstanceWithoutConfig(): ApiKeyManager {
    return new ApiKeyManager();
  }

  public async getRandomApiKey(userId: string | null = null, excludeKey?: string): Promise<string> {
    try {
      const apiKey = await this.getRandomItem(
        userId,
        excludeKey,
        (key) => key.is_active
      );
      return apiKey.key;
    } catch (error) {
      trackError(error as Error, {
        service: 'ApiKeyManager',
        operation: 'getRandomApiKey',
        userId,
        excludeKey,
      });
      throw error;
    }
  }

  public async logApiError(apiKey: string, error: string, statusCode?: number): Promise<void> {
    try {
      const key = Array.from(this.data.values())
        .flat()
        .find(k => k.key === apiKey);

      if (key) {
        await this.logItemError(key.id, error, statusCode);
        this.markItemAsUsed(key.id);
      }
    } catch (error) {
      trackError(error as Error, {
        service: 'ApiKeyManager',
        operation: 'logApiError',
        apiKey,
        error,
        statusCode,
      });
    }
  }
} 