/**
 * AICache - Simple caching layer for AI generations
 * Uses memory cache and localStorage for persistence
 */
export class AICache {
    constructor(namespace = 'ai_cache') {
        this.namespace = namespace;
        this.memory = new Map();
        this.storage = typeof window !== 'undefined' ? window.localStorage : null;
        this.maxMemoryItems = 50;
        this.defaultTTL = 3600000; // 1 hour
    }
    
    /**
     * Generate cache key from type and context
     */
    generateKey(type, context) {
        const contextStr = JSON.stringify(context || {});
        return `${this.namespace}_${type}_${this.hash(contextStr)}`;
    }
    
    /**
     * Simple hash function for cache keys
     */
    hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    /**
     * Get cached value
     */
    async get(key) {
        // Check memory cache first
        if (this.memory.has(key)) {
            const item = this.memory.get(key);
            if (this.isValid(item)) {
                console.log('Cache hit (memory):', key);
                return item.value;
            }
            this.memory.delete(key);
        }
        
        // Check localStorage
        if (this.storage) {
            try {
                const stored = this.storage.getItem(key);
                if (stored) {
                    const item = JSON.parse(stored);
                    if (this.isValid(item)) {
                        console.log('Cache hit (storage):', key);
                        // Promote to memory cache
                        this.setMemory(key, item);
                        return item.value;
                    }
                    this.storage.removeItem(key);
                }
            } catch (e) {
                console.error('Cache read error:', e);
            }
        }
        
        console.log('Cache miss:', key);
        return null;
    }
    
    /**
     * Set cached value
     */
    async set(key, value, ttl = this.defaultTTL) {
        const item = {
            value,
            expires: Date.now() + ttl,
            created: Date.now()
        };
        
        // Store in memory
        this.setMemory(key, item);
        
        // Store in localStorage
        if (this.storage) {
            try {
                this.storage.setItem(key, JSON.stringify(item));
            } catch (e) {
                console.error('Cache write error:', e);
                // If quota exceeded, try to clean up old items
                this.cleanup();
            }
        }
    }
    
    /**
     * Set memory cache with size limit
     */
    setMemory(key, item) {
        // Remove oldest items if at capacity
        if (this.memory.size >= this.maxMemoryItems) {
            const firstKey = this.memory.keys().next().value;
            this.memory.delete(firstKey);
        }
        this.memory.set(key, item);
    }
    
    /**
     * Check if cache item is still valid
     */
    isValid(item) {
        return item && item.expires > Date.now();
    }
    
    /**
     * Clear expired items
     */
    cleanup() {
        // Clean memory cache
        for (const [key, item] of this.memory.entries()) {
            if (!this.isValid(item)) {
                this.memory.delete(key);
            }
        }
        
        // Clean localStorage
        if (this.storage) {
            const keysToRemove = [];
            for (let i = 0; i < this.storage.length; i++) {
                const key = this.storage.key(i);
                if (key && key.startsWith(this.namespace)) {
                    try {
                        const item = JSON.parse(this.storage.getItem(key));
                        if (!this.isValid(item)) {
                            keysToRemove.push(key);
                        }
                    } catch (e) {
                        keysToRemove.push(key);
                    }
                }
            }
            keysToRemove.forEach(key => this.storage.removeItem(key));
        }
    }
    
    /**
     * Clear all cache
     */
    clear() {
        this.memory.clear();
        
        if (this.storage) {
            const keysToRemove = [];
            for (let i = 0; i < this.storage.length; i++) {
                const key = this.storage.key(i);
                if (key && key.startsWith(this.namespace)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => this.storage.removeItem(key));
        }
    }
    
    /**
     * Get cache statistics
     */
    getStats() {
        let storageCount = 0;
        let storageSize = 0;
        
        if (this.storage) {
            for (let i = 0; i < this.storage.length; i++) {
                const key = this.storage.key(i);
                if (key && key.startsWith(this.namespace)) {
                    storageCount++;
                    const item = this.storage.getItem(key);
                    storageSize += item ? item.length : 0;
                }
            }
        }
        
        return {
            memoryCount: this.memory.size,
            storageCount,
            storageSize,
            storageSizeKB: (storageSize / 1024).toFixed(2)
        };
    }
}

// Export singleton instance
export const aiCache = new AICache();