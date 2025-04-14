import { supabase } from '@/lib/supabase/client';
import { trackError } from '@/lib/error-handling';

// Base configuration interface
export interface ServiceConfig {
  cacheDuration?: number;
  tableName?: string;
  primaryKey?: string;
  userIdKey?: string;
  activeKey?: string;
}

// Default configuration
const defaultConfig: ServiceConfig = {
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  tableName: '',
  primaryKey: 'id',
  userIdKey: 'user_id',
  activeKey: 'is_active',
};

// Base class for singleton services
export abstract class BaseService<T> {
  protected static instances: Map<string, any> = new Map();
  protected data: Map<string, T[]> = new Map();
  protected lastFetch: number = 0;
  protected config: ServiceConfig;
  protected usedItems: Set<string> = new Set();

  protected constructor(serviceName: string, config: ServiceConfig = {}) {
    this.config = { ...defaultConfig, ...config };
    BaseService.instances.set(serviceName, this);
  }

  // Get or create instance
  public static getInstance<T extends BaseService<any>>(
    this: new (config?: ServiceConfig) => T,
    config?: ServiceConfig
  ): T {
    const serviceName = this.name;
    if (!BaseService.instances.has(serviceName)) {
      BaseService.instances.set(serviceName, new this(config));
    }
    return BaseService.instances.get(serviceName) as T;
  }

  // Fetch data from database
  protected async fetchData(userId: string | null = null): Promise<void> {
    const now = Date.now();
    if (now - this.lastFetch < this.config.cacheDuration!) {
      return;
    }

    try {
      let query = supabase
        .from(this.config.tableName!)
        .select('*');

      if (this.config.activeKey) {
        query = query.eq(this.config.activeKey, true);
      }

      if (userId) {
        query = query.or(`${this.config.userIdKey}.eq.${userId},${this.config.userIdKey}.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group data by user
      const dataByUser = new Map<string, T[]>();
      data.forEach((item: any) => {
        const itemUserId = item[this.config.userIdKey!] || 'global';
        if (!dataByUser.has(itemUserId)) {
          dataByUser.set(itemUserId, []);
        }
        dataByUser.get(itemUserId)?.push(item as T);
      });

      this.data = dataByUser;
      this.lastFetch = now;
    } catch (error) {
      trackError(error as Error, {
        service: this.constructor.name,
        operation: 'fetchData',
        userId,
      });
      throw error;
    }
  }

  // Get random item
  protected async getRandomItem(
    userId: string | null = null,
    excludeId?: string,
    filter?: (item: T) => boolean
  ): Promise<T> {
    await this.fetchData(userId);

    // Get user's items and global items
    const userItems = this.data.get(userId || '') || [];
    const globalItems = this.data.get('global') || [];
    let allItems = [...userItems, ...globalItems];

    // Apply filter if provided
    if (filter) {
      allItems = allItems.filter(filter);
    }

    // Remove the excluded item if provided
    if (excludeId) {
      allItems = allItems.filter(item => (item as any)[this.config.primaryKey!] !== excludeId);
    }

    // Remove items that have been used in this session
    allItems = allItems.filter(item => !this.usedItems.has((item as any)[this.config.primaryKey!]));

    // If all items have been tried, reset the used items set
    if (allItems.length === 0) {
      this.usedItems.clear();
      allItems = [...userItems, ...globalItems];
      if (filter) {
        allItems = allItems.filter(filter);
      }
      if (excludeId) {
        allItems = allItems.filter(item => (item as any)[this.config.primaryKey!] !== excludeId);
      }
    }

    if (allItems.length === 0) {
      throw new Error(`No ${this.config.tableName} available`);
    }

    // Randomly select an item
    const randomIndex = Math.floor(Math.random() * allItems.length);
    return allItems[randomIndex];
  }

  // Mark item as used
  protected markItemAsUsed(itemId: string): void {
    this.usedItems.add(itemId);
  }

  // Log error for item
  protected async logItemError(
    itemId: string,
    error: string,
    statusCode?: number
  ): Promise<void> {
    try {
      const { error: dbError } = await supabase
        .from(`${this.config.tableName}_errors`)
        .insert({
          [`${this.config.tableName}_id`]: itemId,
          error,
          status_code: statusCode,
          created_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;
    } catch (error) {
      trackError(error as Error, {
        service: this.constructor.name,
        operation: 'logItemError',
        itemId,
      });
    }
  }

  // Clear cache
  public clearCache(): void {
    this.data.clear();
    this.lastFetch = 0;
    this.usedItems.clear();
  }

  // Get cache size
  public getCacheSize(): number {
    return this.data.size;
  }
} 